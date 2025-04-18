import type { RequestHandler } from '@sveltejs/kit';
import { clients } from '$lib/mpdListener';


export const GET: RequestHandler = async () => {
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      clients.add(controller);

      // Cuando el cliente se desconecta
      // @ts-expect-error: signal puede no estar tipado en todos los controladores
      controller.signal?.addEventListener('abort', () => {
        clients.delete(controller);
      });
    },
    cancel() {
      // Limpieza si es necesario
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    }
  });
};

