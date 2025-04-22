import { trpc } from '$lib/trpc/client';
import { page } from '$app/state';

export const trpcQueue = {
    play: async () => {
        await trpc(page).player.play.mutate();
    },
    clear: async () => {
      await trpc(page).queue.clear.mutate();
    },
    add: async (uri: string) => {
      await trpc(page).queue.add.mutate({ uri });
    }
  };

export type TRPCQueue = typeof trpcQueue;