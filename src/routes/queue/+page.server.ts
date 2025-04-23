import { createCaller } from "$lib/trpc/router";
import { createContext } from "$lib/trpc/context";
import type { QueueMsg } from "$lib/messages";

export async function load() {
  const caller = createCaller(await createContext({} as any));
  const queue = await caller.queue.info() as QueueMsg;
  return { ...queue };
}
