import type { Context } from '$lib/trpc/context';
import { initTRPC } from '@trpc/server';
import { z } from 'zod';

export const t = initTRPC.context<Context>().create();

export const playlist = t.router({
    create: t.procedure
        .input(z.object({
            name: z.string(),
            files: z.array(z.string())
        }))
        .mutation(async ({ input, ctx }) => {
            await ctx.playlist.create(input.name);
        }
    ),
    list: t.procedure
        .input(z.object({
            name: z.string()
        }))
        .query(async ({ input, ctx }) => {
            const library = await ctx.playlist.list(input.name);
            return library;
        }
    ),
    load: t.procedure
        .input(z.object({
            name: z.string()
        }))
        .query(async ({ input, ctx }) => {
            const playlist = await ctx.playlist.load(input.name);
            return playlist;
        }
    ),
    add: t.procedure
        .input(z.object({
            uri: z.string()
        }))
        .mutation(async ({ input, ctx }) => {
            await ctx.playlist.add(input.uri);
        }
    ),
    remove: t.procedure
        .input(z.object({
            uri: z.string(),
        }))
        .mutation(async ({ input, ctx }) => {
            await ctx.playlist.remove(input.uri);
        }
    ),
    clear: t.procedure
        .input(z.object({
            name: z.string()
        }))
        .mutation(async ({ input, ctx }) => {
            await ctx.playlist.clear(input.name);
        }
    ),
    save: t.procedure
        .input(z.object({
            name: z.string(),
            mode: z.string()
        }))
        .mutation(async ({ input, ctx }) => {
            await ctx.playlist.save(input.name, input.mode);
        }
    )   
});