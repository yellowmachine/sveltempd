import type { Context } from '$lib/trpc/context';
import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { player } from './player'

export const t = initTRPC.context<Context>().create();



export const router = t.router({
    player
});

export const createCaller = t.createCallerFactory(router);

export type Router = typeof router;
