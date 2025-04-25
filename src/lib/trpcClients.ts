import { trpc } from '$lib/trpc/client';
import { page } from '$app/state';
import { trpcError } from '$lib/stores.svelte';
import { TRPCClientError } from '@trpc/client';
import type { Settings } from './schemas';


function withTrpcError<T extends (...args: any[]) => Promise<any>>(fn: T): T {
  return (async (...args: any[]) => {
    try {
      return await fn(...args);
    } catch (err) {
      if (err instanceof TRPCClientError) {
        trpcError.update(JSON.stringify(err))
      }
      throw err;
    }
  }) as T;
}

function decorateTrpcObject<T extends Record<string, any>>(obj: T): T {
  const result: Record<string, any> = {};
  for (const key in obj) {
    if (typeof obj[key] === 'function') {
      result[key] = withTrpcError(obj[key]);
    } else {
      result[key] = obj[key];
    }
  }
  return result as T;
}

export const trpcSnapclient = decorateTrpcObject({
    restart: async () => {
        await trpc(page).snapclient.restart.mutate();
    }
})

export const trpcAdmin = decorateTrpcObject({
  save: async (form: Settings) => {
      return await trpc(page).admin.save.mutate(form);
  }
})

export const trpcQueue = {
    play: async (pos?: number) => {
        await trpc(page).player.play.mutate(pos);
    },
    clear: async () => {
      await trpc(page).queue.clear.mutate();
    },
    remove: async (uri: string) => {
      await trpc(page).queue.remove.mutate({ uri });
    },
    add: async (uri: string) => {
      await trpc(page).queue.add.mutate({ uri });
    },
    saveAs: async (name: string) => {
      await trpc(page).playlist.save.mutate({ name, mode: 'replace' });
    },
    load: async (name: string) => {
      await trpc(page).playlist.load.mutate({ name });
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
