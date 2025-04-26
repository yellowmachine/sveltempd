import type { Context } from '$lib/trpc/context';
import { initTRPC } from '@trpc/server';
import { z } from 'zod';

export const t = initTRPC.context<Context>().create();

export const snapclient = t.router({
    restart: t.procedure.mutation(async ({ ctx }) => {
        await ctx.snapclient.restart();
    }),
    changeOpts: t.procedure
        .input(z.object({
            opts: z.string()
        }))
        .mutation(async ({ input, ctx }) => {
            await ctx.snapclient.changeOpts(input.opts);
        })
});