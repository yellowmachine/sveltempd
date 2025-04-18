//import type { EventEmitter } from 'events';
import mpdApi from 'mpd-api';
import { exec } from 'child_process';
import { promisify } from 'node:util';

const execAsync = promisify(exec);
type SSEController = ReadableStreamDefaultController<Uint8Array>;

export const clients = new Set<SSEController>();

export async function startListening() {
  const client = await mpdApi.connect({
    host: 'localhost',
    port: 6600,
  });

  console.log('Conectado al servidor MPD para eventos.');

  client.on('system', (name) => {
      if (name === 'player') {
          // Evento relacionado con el estado de reproducción (play, pause, stop, cambio de canción)
          console.log('MPD player event');
          broadcast(name); 
      }
      if (name === 'playlist') {
          // Evento relacionado con cambios en la playlist
          console.log('MPD playlist event');
          broadcast(name); 
      }
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

async function playlistMsg(){
  let msg;

  try {
    const { stdout } = await execAsync('mpc playlist');
    const playlist = stdout.trim().split('\n').map((line) => {
      const [artist, ...songParts] = line.trim().split(' - ');
      const song = songParts.join(' - ');
      return { artist: artist || '', song: song || '' };
    });
    msg = { playlist };
  } catch {
    msg = { playlist: [] };
  }

  return msg;
}

async function playerMsg(){
  let msg, status, client;
  try{
    client = await mpdApi.connect({ host: 'localhost', port: 6600 });
    msg = status = {...await client.api.status.get(), currentSong: await currentSong() }
  }finally{
    try{
      if(client) client.disconnect()
    }catch(e){
      console.error('Error al desconectar del cliente MPD:', e);
    }
  }
  return msg;
}

export async function broadcast(event: string) {
  let msg;

  if(event === 'playlist') {
    msg = await playlistMsg();
  } else if(event === 'player') {
    msg = await playerMsg();
  } else {
    msg = null;
  }
  
  if (msg) {
    const sseFormatMsg = sseFormat(event, msg);
    const encoded = new TextEncoder().encode(sseFormatMsg);
    for (const client of clients) {
      try {
        client.enqueue(encoded);
      } catch {
        clients.delete(client);
      }
    }
  }
}
