import { getPlayer, getLibrary, getPlaylist, getQueue } from '$lib/mpd/command';
import type { RequestEvent } from '@sveltejs/kit';


export async function createContext(event: RequestEvent) {
  return {
    event, // 👈 `event` is now available in your context,
    player: await getPlayer(),
    library: await getLibrary(),
    playlist: await getPlaylist(),
    queue: await getQueue()
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
