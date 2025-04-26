import { encrypt } from '$lib/cryptutils';
import { db } from '$lib/db';
import type { Context } from '$lib/trpc/context';
import { initTRPC } from '@trpc/server';
import { z } from 'zod';

export const t = initTRPC.context<Context>().create();

export const setup = t.router({
    update: t.procedure.input(
        z.object({
            ip: z.string(),
            username: z.string(),
            password: z.string(),
        })
    ).mutation(async ({ input }) => {
        let { ip, username, password } = input;
        password = encrypt(password);

        await db.setData({
                admin: { ...(await db.getDataWithPassword()).admin, server: { ip, username, password } },
                setupDone: true
            });
        }
    ),
    get: t.procedure
        .query(async ({ ctx }) => {
            return (await db.getData()).setupDone;
        }
    ),
});