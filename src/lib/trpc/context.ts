import { getPlayer } from '$lib/mpd/command';
import type { RequestEvent } from '@sveltejs/kit';

export async function createContext(event: RequestEvent) {
  return {
    event, // 👈 `event` is now available in your context,
    player: await getPlayer(), // 👈 `player` is now available in your context
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
