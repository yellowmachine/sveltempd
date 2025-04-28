import { z } from 'zod';
import { mpdProcedure, t } from './trpc';

const procedure = mpdProcedure

export const snapclient = t.router({
    restart: procedure.mutation(async ({ ctx }) => {
        await ctx.snapclient.restart();
    }),
    changeOpts: procedure
        .input(z.object({
            opts: z.string()
        }))
        .mutation(async ({ input, ctx }) => {
            await ctx.snapclient.changeOpts(input.opts);
        })
});