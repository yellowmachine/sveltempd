import { getMPDClient } from './mpdClient';
import { queueMsg, playlistMsg, playerMsg } from './messages';

type SSEController = ReadableStreamDefaultController<Uint8Array>;

export const clients = new Set<SSEController>();

export async function startListening() {
  const client = await getMPDClient();

  console.log('Conectado al servidor MPD para eventos.');

  client.on('ready', () => {
      console.log('MPD listo para recibir eventos.');
      // Enviar el estado inicial al cliente
      //broadcast('playlist');
      //broadcast('player');
  });

  client.on('system', (name) => {
    console.log('Evento del sistema MPD:', name);
    broadcast(name);
  });
}


function sseFormat(event: string, data: unknown): string {
    return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

export async function broadcast(event: string) {
  let msg;

  if(event === 'playlist') {
    msg = await playlistMsg();
  } else if(event === 'player' || event === 'mixer') {
    msg = await playerMsg();
  } else if(event === 'queue') {
    msg = await queueMsg();
  } 
  else {
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
