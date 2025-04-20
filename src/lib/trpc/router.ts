import type { Context } from '$lib/trpc/context';
import { initTRPC } from '@trpc/server';
import { player } from './player'
import { library } from './library';
import { playlist } from './playlist';
import { queue } from './queue';

export const t = initTRPC.context<Context>().create();

export const appRouter = t.router({
    player,
    library,
    playlist,
    queue
});

export const createCaller = t.createCallerFactory(appRouter);

export type Router = typeof appRouter;
