import { createCaller } from "$lib/trpc/router";
import { createContext } from "$lib/trpc/context";

export async function load() {
  const caller = createCaller(await createContext({} as any));
  const queue: Array<{ artist: string; title: string }> = await caller.queue.info() as Array<{ artist: string; title: string }>;
  return { queue };
}
