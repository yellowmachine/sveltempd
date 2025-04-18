import type { Context } from '$lib/trpc/context';
import { initTRPC } from '@trpc/server';


export const t = initTRPC.context<Context>().create();

export const router = t.router({
    play: t.procedure.mutation(async ({ ctx }) => {
        await ctx.player.play()
    }),
  greeting: t.procedure.query(async () => {
    return `Hello tRPC v10 @ ${new Date().toLocaleTimeString()}`;
  })
});

export const createCaller = t.createCallerFactory(router);

export type Router = typeof router;
