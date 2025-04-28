import { z } from 'zod';
import { mpdProcedure, t } from './trpc';

const procedure = mpdProcedure

export const queue = t.router({
    info: procedure
        .query(async ({ ctx }) => {
            const library = await ctx.queue.info();
            return library;
        }
    ),
    add: procedure
        .input(z.object({
            uri: z.string()
        }))
        .mutation(async ({ input, ctx }) => {
            const { uri } = input;
            await ctx.queue.add(uri);
        }
    ),
    remove: procedure
        .input(z.object({
            uri: z.string(),
        }))
        .mutation(async ({ input, ctx }) => {
            await ctx.queue.remove(input.uri);
        }
    ),
    clear: procedure
        .mutation(async ({ input, ctx }) => {
            await ctx.queue.clear();
        }
    )
});