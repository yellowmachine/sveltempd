import { z } from 'zod';
import { mpdProcedure, t } from './trpc';

const procedure = mpdProcedure

export const player = t.router({
    play: procedure.input(z.number().int().optional()).mutation(async ({ ctx, input }) => {
        await ctx.player.play(input)
    }),
    pause: procedure.mutation(async ({ ctx }) => {
        await ctx.player.pause()
    }),
    seek: procedure.input(z.object({
        time: z.number().int(),
      })).mutation(async ({ ctx, input }) => {
        await ctx.player.seek(input.time)
    }),
    next: procedure.mutation(async ({ ctx }) => {
        await ctx.player.next()
    }),
    prev: procedure.mutation(async ({ ctx }) => {
        await ctx.player.prev()
    }),
    volume: procedure.input(z.object({
        amount: z.number().int(),
      })).mutation(async ({ ctx, input }) => {
        await ctx.player.volume(input.amount)
    }),
    mute: procedure.mutation(async ({ ctx }) => {
        await ctx.player.mute()
    }),
    unmute: procedure.mutation(async ({ ctx }) => {
        await ctx.player.unmute()
    }),
    playHere: procedure
    .input(z.object({
        playlistName: z.string().optional(),
        path: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
        await ctx.player.playHere(input);
    })

});