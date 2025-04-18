import type { Context } from '$lib/trpc/context';
import { initTRPC } from '@trpc/server';
import { z } from 'zod';

export const t = initTRPC.context<Context>().create();

export const router = t.router({
    play: t.procedure.mutation(async ({ ctx }) => {
        await ctx.player.play()
    }),
    pause: t.procedure.mutation(async ({ ctx }) => {
        await ctx.player.pause()
    }),
    next: t.procedure.mutation(async ({ ctx }) => {
        await ctx.player.next()
    }),
    prev: t.procedure.mutation(async ({ ctx }) => {
        await ctx.player.prev()
    }),
    volume: t.procedure.input(z.object({
        amount: z.number().int(),
      })).mutation(async ({ ctx, input }) => {
        await ctx.player.volume(input.amount)
    }),
    mute: t.procedure.mutation(async ({ ctx }) => {
        await ctx.player.mute()
    }),
    unmute: t.procedure.mutation(async ({ ctx }) => {
        await ctx.player.unmute()
    })
});

export const createCaller = t.createCallerFactory(router);

export type Router = typeof router;
