import { json, type RequestHandler } from '@sveltejs/kit';
import { exec } from 'child_process';
import fs from 'fs/promises';
import mpd from 'mpd-api';
import type { MPDApi } from 'mpd-api';


interface ChangeCardOptions {
    command: 'changeCard';
    host: string;
    deviceIndex: string | number;
  }

interface ListCardsOptions {
    command: 'listCards';
    host: string;
    deviceIndex: string | number;
  }  

interface VolumeUpOptions {
    command: 'volumeUp';
    // Puedes agregar más campos si lo necesitas, por ejemplo, cantidad
    amount?: number;
  }
  
interface VolumeDownOptions {
    command: 'volumeDown';
    amount?: number;
  }
  
interface MuteOptions {
    command: 'mute';
  }
  
interface UnmuteOptions {
    command: 'unmute';
  }
  
interface PlayOptions {
    command: 'play';
}

interface PauseOptions {
    command: 'pause';
}

  // Unión de todas las opciones posibles
type CommandOptions =
    | ChangeCardOptions
    | ListCardsOptions
    | VolumeUpOptions
    | VolumeDownOptions
    | PlayOptions
    | PauseOptions
    | MuteOptions
    | UnmuteOptions;
  

async function getSoundCards(): Promise<string[]> {
  return new Promise((resolve, reject) => {
    exec('snapclient -l', (error, stdout) => {
      if (error) {
        reject(error);
        return;
      }
      const dispositivos = stdout
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
      resolve(dispositivos);
    });
  });
}

async function changeActiveCard(options: ChangeCardOptions): Promise<void> {
  const { host, deviceIndex } = options;

  if (!host || deviceIndex === undefined) {
    throw new Error('Se requieren "host" y "deviceIndex"');
  }

  const filePath = '/etc/default/snapclient';

  let content = await fs.readFile(filePath, 'utf-8');
  const newLine = `SNAPCLIENT_OPTS="-h ${host} -s ${deviceIndex}"`;
  const regex = /^SNAPCLIENT_OPTS=.*$/m;

  if (regex.test(content)) {
    content = content.replace(regex, newLine);
  } else {
    content += `\n${newLine}\n`;
  }

  await fs.writeFile(filePath, content, 'utf-8');

  await new Promise<void>((resolve, reject) => {
    exec('systemctl restart snapclient.service', (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

let previousVolume: number | null = null;

type VolumeObj = { volume: number };

async function getCurrentVolume(client: MPDApi.ClientAPI){
    const obj = await client.api.playback.getvol() as VolumeObj
    if (typeof obj.volume === 'number') { 
        return obj.volume;
      }
      // Maneja el caso en que no haya mezclador
      throw new Error('No hay mezclador disponible');
}

export async function commandHandler(options: CommandOptions): Promise<{success?: boolean, error?: string, payload?: unknown}> {
    if (options.command === 'changeCard') {
      await changeActiveCard(options);
      return { success: true };
    } else if(options.command === 'listCards'){
        const cards = await getSoundCards()
        return {success: true, payload: cards}
    } else if (options.command === 'play') {
        return await executeCommand((client) => client.api.playback.play())
    } else if (options.command === 'pause') {
        return await executeCommand((client) => client.api.playback.pause())
    } else if (options.command === 'volumeUp') {
        return await executeCommand(async (client) => {
            const currentVolume = await getCurrentVolume(client); 
            const newVolume = Math.min(currentVolume + (options.amount ?? 5), 100);
            await client.api.playback.setvol(''+newVolume);
        })
    } else if (options.command === 'volumeDown') {
        return await executeCommand(async (client) => {
            const currentVolume = await getCurrentVolume(client); 
            const newVolume = Math.max(currentVolume - (options.amount ?? 5), 0);
            await client.api.playback.setvol(''+newVolume);
        })
    } else if (options.command === 'mute') {
        return await executeCommand(async (client) => {
            previousVolume = await getCurrentVolume(client);
            await client.api.playback.setvol('0');
        })
  
    } else if (options.command === 'unmute') {
        return await executeCommand(async (client) => {
            await client.api.playback.setvol(''+previousVolume);
        })
  
    } else {
      throw new Error('Comando no soportado');
    }
  }
  

export type Command = (
    client: MPDApi.ClientAPI,
    options?: CommandOptions
  ) => Promise<void>;

async function executeCommand(command: Command, options?: CommandOptions) {
    let client: MPDApi.ClientAPI | null = null;
    try {
        client = await mpd.connect({ host: 'localhost', port: 6600 });
        await command(client, options);
        return {success: true}
        //return {result: client.api.status.get()};
    } catch(error: unknown){
        //return { error: error?.message || 'Error ejecutando comando MPD' };
        const message = error instanceof Error
            ? error.message
            : 'Error interno';

        return { error: message || 'Error ejecutando comando MPD' };
    } finally {
        if (client) {
            try {
              await client.disconnect();
            } catch {
              // Ignora errores de desconexión
            }
        }
    }
  }
  
export const POST: RequestHandler = async ({ request }) => {
    try {
      const options = await request.json() as CommandOptions;
  
      // Opcional: puedes validar que options tenga 'command'
      if (!options || typeof options.command !== 'string') {
        return json({ error: 'Comando no soportado' }, { status: 400 });
      }
  
      const result = await commandHandler(options);
  
      return json({ success: true, result });
    } catch (error: unknown) {
        const message = error instanceof Error
            ? error.message
            : 'Error interno';

        return json({ error: message }, { status: 500 });
    } 
  };

  