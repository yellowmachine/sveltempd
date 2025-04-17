import type { EventEmitter } from 'events';
import mpdApi from 'mpd-api';
import { exec } from 'child_process';
import { promisify } from 'node:util';

const execAsync = promisify(exec);


type SSEController = ReadableStreamDefaultController<Uint8Array>;
export const clients = new Set<SSEController>();

export async function startListening() {
    const client: EventEmitter = await mpdApi.connect({
      host: 'localhost',
      port: 6600,
    });

    console.log('Conectado al servidor MPD para eventos.');

    client.on('system', (name: string) => {
        console.log('MPD system event:', name);
        broadcast('system')
    });

}

function sseFormat(event: string, data: unknown): string {
    return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  }

async function currentSong(){
  try {
    const { stdout } = await execAsync('mpc current');
    const [artist, ...songParts] = stdout.trim().split(' - ');
    const song = songParts.join(' - ');

    return { artist: artist || '', song: song || '' };
  } catch {
    return null;
  }
}

export async function broadcast(event: string) {
  let status, client;

  try{
    client = await mpdApi.connect({ host: 'localhost', port: 6600 });
    status = {...await client.api.status.get(), currentSong: await currentSong() }
  }finally{
    if(client) client.disconnect()
  }
  

  const message = sseFormat(event, status);
  const encoded = new TextEncoder().encode(message);

  for (const client of clients) {
    try {
      client.enqueue(encoded);
    } catch {
      clients.delete(client);
    }
  }
}
