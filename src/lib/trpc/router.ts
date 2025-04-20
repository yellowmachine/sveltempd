import type { Context } from '$lib/trpc/context';
import { initTRPC } from '@trpc/server';
import { player } from './player'
import { library } from './library';

export const t = initTRPC.context<Context>().create();

export const appRouter = t.router({
    player,
    library
});

export const createCaller = t.createCallerFactory(appRouter);

export type Router = typeof appRouter;
