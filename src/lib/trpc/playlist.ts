import { z } from 'zod';
import { mpdProcedure, t } from './trpc';

const procedure = mpdProcedure

export const playlist = t.router({
    get: procedure
        .query(async ({ ctx }) => {
            return await ctx.playlist.get();
    }),
    create: procedure
        .input(z.object({
            name: z.string(),
            files: z.array(z.string())
        }))
        .mutation(async ({ input, ctx }) => {
            await ctx.playlist.create(input.name);
        }
    ),
    list: procedure
        .input(z.object({
            name: z.string()
        }))
        .query(async ({ input, ctx }) => {
            const library = await ctx.playlist.list(input.name);
            return library;
        }
    ),
    add: procedure
        .input(z.object({
            uri: z.string()
        }))
        .mutation(async ({ input, ctx }) => {
            await ctx.playlist.add(input.uri);
        }
    ),
    remove: procedure
        .input(z.object({
            uri: z.string(),
        }))
        .mutation(async ({ input, ctx }) => {
            await ctx.playlist.remove(input.uri);
        }
    ),
    clear: procedure
        .input(z.object({
            name: z.string()
        }))
        .mutation(async ({ input, ctx }) => {
            await ctx.playlist.clear(input.name);
        }
    ),
    save: procedure
        .input(z.object({
            name: z.string(),
            mode: z.string()
        }))
        .mutation(async ({ input, ctx }) => {
            await ctx.playlist.save(input.name, input.mode);
        }
    ),
    load: procedure
        .input(z.object({
            name: z.string()
        }))
        .mutation(async ({ input, ctx }) => {
            await ctx.playlist.load(input.name);
        }
    )
});