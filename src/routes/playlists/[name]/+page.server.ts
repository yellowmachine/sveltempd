import { createCaller } from "$lib/trpc/router";
import { createContext } from "$lib/trpc/context";
import type { Song } from "$lib/messages";

export async function load({params}) {
  const caller = createCaller(await createContext({} as any));
  const playlistName = params.name; 
  const playlist = await caller.playlist.list({ name: playlistName }) as Array<Song>;
  return { playlist };
}
