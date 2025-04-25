import type { Context } from '$lib/trpc/context';
import { initTRPC } from '@trpc/server';
import { settingsSchema } from '$lib/schemas';
import { db } from '$lib/db';

export const t = initTRPC.context<Context>().create();


export const admin = t.router({
  save: t.procedure
    .input(settingsSchema)
    .mutation(async ({ input }) => {
      console.log(input)
      const data = await db.getData();
      db.setData({...data, ...input});
      return { success: true };
    }),
});