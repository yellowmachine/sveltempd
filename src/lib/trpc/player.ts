import type { Context } from '$lib/trpc/context';
import { initTRPC } from '@trpc/server';
import { z } from 'zod';

export const t = initTRPC.context<Context>().create();

export const player = t.router({
    play: t.procedure.mutation(async ({ ctx }) => {
        await ctx.player.play()
    }),
    pause: t.procedure.mutation(async ({ ctx }) => {
        await ctx.player.pause()
    }),
    seek: t.procedure.input(z.object({
        time: z.number().int(),
      })).mutation(async ({ ctx, input }) => {
        await ctx.player.seek(input.time)
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
    }),
    playHere: t.procedure
    .input(z.object({
        playlistName: z.string().optional(),
        files: z.array(z.string()).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
        await ctx.player.playHere(input);
    })

});