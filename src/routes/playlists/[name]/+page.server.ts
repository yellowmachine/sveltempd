import { createCaller } from "$lib/trpc/router";
import { createContext } from "$lib/trpc/context";

export async function load({params}) {
  const caller = createCaller(await createContext({} as any));
  const playlistName = params.name; 
  const playlist = await caller.playlist.list({ name: playlistName }) as Array<{ artist: string; title: string }>;
  return { playlist };
}
