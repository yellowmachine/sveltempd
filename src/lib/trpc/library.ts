import { z } from 'zod';
import { mpdProcedure, t } from './trpc';

const procedure = mpdProcedure

export const library = t.router({
    getFolderContent: procedure
        .input(z.object({ path: z.string() }))
        .query(async ({ ctx, input }) => {
            const library = await ctx.library.getFolderContent(input.path);
            return library;
        }),
    update: procedure
        .mutation(async ({ ctx }) => {
            await ctx.library.update();
    })
});