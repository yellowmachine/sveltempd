import { z } from 'zod';

export const settingsSchema = z.object({
  server: z.object({
    ip: z.string().ip().min(1, "IP obligatoria"),
    username: z.string().min(1, "Usuario obligatorio"),
    password: z.string().min(1, "Contraseña obligatoria").nullable()
  }),
  clients: z.array(
    z.object({
      ip: z.string().min(1, "IP obligatoria"),
      username: z.string().min(1, "Usuario obligatorio"),
      password: z.string().min(1, "Contraseña obligatoria")
    })
  ),
  global: z.object({
    latency: z.number().min(0, "Latencia debe ser positiva")
  })
});

export type Settings = z.infer<typeof settingsSchema>;
