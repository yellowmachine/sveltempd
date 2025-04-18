import { json, type RequestHandler } from '@sveltejs/kit';
import { exec } from 'child_process';
import fs from 'fs/promises';
import type { MPDApi } from 'mpd-api';
import { play, pause, volumeDown, volumeUp, mute, unmute } from '$lib/mpd/command';
import type { ChangeCardOptions, CommandOptions } from '$lib/mpd/command';
  

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
  const newLine = `SNAPCLIENT_OPTS="-h ${host} -s ${deviceIndex}" --latency 100`;
  const regex = /^SNAPCLIENT_OPTS=.*$/m;

  if (regex.test(content)) {
    content = content.replace(regex, newLine);
  } else {
    content += `\n${newLine}\n`;
  }

  await fs.writeFile(filePath, content, 'utf-8');

  await new Promise<void>((resolve, reject) => {
    exec('systemctl restart snapclient', (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

async function commandHandler(options: CommandOptions){
    if (options.command === 'changeCard') {
        await changeActiveCard(options);
    } else if(options.command === 'listCards'){
        const cards = await getSoundCards()
        return {success: true, payload: cards}
    } else if (options.command === 'play') {
        await play();
    } else if (options.command === 'pause') {
        await pause();
    } else if (options.command === 'volumeUp') {
        await volumeUp(options);
    } else if (options.command === 'volumeDown') {
        await volumeDown(options);
    } else if (options.command === 'mute') {
        await mute();
    } else if (options.command === 'unmute') {
        await unmute();
    } else {
      throw new Error('Comando no soportado');
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

  