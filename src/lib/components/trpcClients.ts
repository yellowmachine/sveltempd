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

export const trpcPlayer = {
    play: async () => {
        await trpc(page).player.play.mutate();
    },
    pause: async () => {
        await trpc(page).player.pause.mutate();   
    },
    mute: async () => {
        await trpc(page).player.mute.mutate();
    },
    unmute: async () => {
        await trpc(page).player.unmute.mutate();
    },
    volumeInc: async (amount: number) => {
        await trpc(page).player.volumeInc.mutate({ amount });
    },
    volume: async (amount: number) => {
        await trpc(page).player.volume.mutate({ amount });
    },
    prev: async () => {
        await trpc(page).player.prev.mutate();
    },
    next: async () => {
        await trpc(page).player.next.mutate();
    }
};

export type TRPCPlayer = typeof trpcPlayer;
