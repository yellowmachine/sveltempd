import type { EventEmitter } from 'events';
import mpdApi from 'mpd-api';


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
        broadcast('system', name)
    });

}

function sseFormat(event: string, data: unknown): string {
    return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  }

// Función para emitir eventos a todos los clientes conectados
export function broadcast(event: string, data: unknown) {
  const message = sseFormat(event, data);
  const encoded = new TextEncoder().encode(message);

  for (const client of clients) {
    try {
      client.enqueue(encoded);
    } catch {
      clients.delete(client);
    }
  }
}
