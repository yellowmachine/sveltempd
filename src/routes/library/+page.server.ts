import { createCaller } from "$lib/trpc/router";
import { createContext } from "$lib/trpc/context";


export async function load() {
  const caller = createCaller(await createContext({} as any));
  const rootContents = await caller.library.getFolderContent({path: ''});
  return {
    rootContents
  };
}
