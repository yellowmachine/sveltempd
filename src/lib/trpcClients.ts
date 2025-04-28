import { trpc } from '$lib/trpc/client';
import { page } from '$app/state';
import type { Settings } from './schemas';
import type { Host } from './ssh.base';

export const trpcLibraryClient = {
  load: async (folder: string) => {
    return await trpc(page).library.getFolderContent.query({path: folder});
  },
  update: async () => {
    return await trpc(page).library.update.mutate();
  }
  //saveAs: async (name: string) => {
  //  await trpc(page).playlist.save.mutate({ name, mode: 'replace' });
  //}
}

export const trpcSnapclient = {
    restart: async () => {
        await trpc(page).snapclient.restart.mutate();
    },
    changeSnapclientOpts: async (opts: string) => {
        await trpc(page).snapclient.changeOpts.mutate({ opts });
    }
}

export const trpcSetupclient = {
  update: async ({ip, username, password}: Host) => {
      return await trpc(page).setup.update.mutate({ip, username, password});
  }
}

export const trpcAdmin = {
  save: async (form: Settings) => {
      return await trpc(page).admin.save.mutate(form);
  }
}

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
