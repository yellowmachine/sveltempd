import type { Context } from '$lib/trpc/context';
import { initTRPC } from '@trpc/server';
import { settingsSchema, type Settings, type SettingsWithPassword } from '$lib/schemas';
import { db } from '$lib/db';
import { encrypt } from '$lib/cryptutils';

export const t = initTRPC.context<Context>().create();

export const admin = t.router({
  save: t.procedure
    .input(settingsSchema)
    .mutation(async ({ input }) => {
      const data = await db.getDataWithPassword();

      // Copia el objeto anterior
      const prevAdmin = data.admin || {};

      // --- Server ---
      const serverInput = input.server;
      const prevServer = prevAdmin.server || {};

      // Si password viene como undefined o null, conserva el anterior
      const mergedServer = {
        ...prevServer,
        ...serverInput,
        password:
          serverInput.password === undefined || serverInput.password === null
            ? prevServer.password
            : encrypt(serverInput.password),
      };

      // --- Clients ---
      const prevClients = prevAdmin.clients || [];
      const inputClients = input.clients || [];

      // Fusiona cada cliente por posición (puedes mejorarlo por IP si lo necesitas)
      const mergedClients = inputClients.map((clientInput, idx) => {
        const prevClient = prevClients[idx] || {};
        return {
          ...prevClient,
          ...clientInput,
          password:
            clientInput.password === undefined || clientInput.password === null
              ? prevClient.password
              : encrypt(clientInput.password),
        };
      });

      // --- Global ---
      const mergedGlobal = {
        ...(prevAdmin.global || {}),
        ...(input.global || {}),
      };

      // --- Monta el nuevo objeto admin ---
      const newAdmin: SettingsWithPassword = {
        ...prevAdmin,
        ...input,
        server: mergedServer,
        clients: mergedClients,
        global: mergedGlobal,
      };

      // Guarda y devuelve
      await db.setData({ ...data, admin: newAdmin });
      return (await db.getData()).admin as Settings;
    }),
});
