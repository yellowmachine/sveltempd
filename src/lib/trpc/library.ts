import type { Context } from '$lib/trpc/context';
import { initTRPC } from '@trpc/server';
import { z } from 'zod';

export const t = initTRPC.context<Context>().create();

export const library = t.router({
    getFolderContent: t.procedure
        .input(z.object({ path: z.string() }))
        .query(async ({ ctx, input }) => {
            const library = await ctx.library.getFolderContent(input.path);
            return library;
        })
});