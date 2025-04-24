import { createCaller } from "$lib/trpc/router";
import { createContext } from "$lib/trpc/context";

export async function load({}) {
  const caller = createCaller(await createContext({} as any)); 
  const playlists = await caller.playlist.get();
  return { playlists };
}
