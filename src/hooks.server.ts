import type { Handle } from '@sveltejs/kit';
import { paraglideMiddleware } from '$lib/paraglide/server';
import { sequence } from '@sveltejs/kit/hooks';
import { startListening } from '$lib/mpdListener';
import { initializeDB } from '$lib/db';
import { createTRPCHandle } from 'trpc-sveltekit';
import { createContext } from '$lib/trpc/context';
import { router } from '$lib/trpc/router';

const trpcHandle: Handle = createTRPCHandle({ router, createContext });

const handleParaglide: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request, locale }) => {
		event.request = request;

		return resolve(event, {
			transformPageChunk: ({ html }) => html.replace('%paraglide.lang%', locale)
		});
	});

let hasInitialized = false;

async function initializeServer() {
  console.log("Inicializando el servidor...");

  await initializeDB(); 
  // Inicializar la escucha de eventos MPD
  await startListening();
  console.log("Servidor inicializado.");
  
  hasInitialized = true;
}

const defaultHandle: Handle = async ({ event, resolve }) => {
  if (!hasInitialized) {
    await initializeServer();
  }
  return await resolve(event);
}

export const handle: Handle = sequence(handleParaglide, defaultHandle, trpcHandle);

