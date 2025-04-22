import type { Context } from '$lib/trpc/context';
import { initTRPC } from '@trpc/server';
import { z } from 'zod';

export const t = initTRPC.context<Context>().create();

export const queue = t.router({
    info: t.procedure
        .query(async ({ ctx }) => {
            const library = await ctx.queue.info();
            return library;
        }
    ),
    add: t.procedure
        .input(z.object({
            uri: z.string()
        }))
        .mutation(async ({ input, ctx }) => {
            const { uri } = input;
            await ctx.queue.add(uri);
        }
    ),
    remove: t.procedure
        .input(z.object({
            uri: z.string(),
        }))
        .mutation(async ({ input, ctx }) => {
            await ctx.queue.remove(input.uri);
        }
    ),
    clear: t.procedure
        .mutation(async ({ input, ctx }) => {
            await ctx.queue.clear();
        }
    )
});