import type { Context } from '$lib/trpc/context';
import { initTRPC } from '@trpc/server';
import { //getPlayer, getLibrary, getPlaylist, getQueue, 
    snapclient, getMpdService } from '$lib/mpd/command';


export const t = initTRPC.context<Context>().create();

const mpdMiddleware = t.middleware(async ({ ctx, next }) => {
  //const player = await getPlayer(); //deberian compartir mpd client
  //const library = await getLibrary();
  //const playlist = await getPlaylist();
  //const queue = await getQueue();

  const mpdService = await getMpdService();

  return next({
    ctx: {
      ...ctx,
      ...mpdService,
      //player,
      //library,
      //playlist,
      //queue,
      snapclient
    }
  });
});

export const mpdProcedure = t.procedure.use(mpdMiddleware);
