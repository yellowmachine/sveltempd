import { getMPDClient } from '$lib/mpdClient';
import type { MPDApi } from 'mpd-api';
import { z } from 'zod';
import { db } from '$lib/db';


export const ChangeCardOptionsSchema = z.object({
  command: z.literal('changeCard'),
  host: z.string(),
  deviceIndex: z.union([z.string(), z.number()])
});

export const ListCardsOptionsSchema = z.object({
  command: z.literal('listCards'),
  host: z.string(),
  deviceIndex: z.union([z.string(), z.number()])
});

export const VolumeUpOptionsSchema = z.object({
  command: z.literal('volumeUp'),
  amount: z.number().optional()
});

export const VolumeDownOptionsSchema = z.object({
  command: z.literal('volumeDown'),
  amount: z.number().optional()
});

export const MuteOptionsSchema = z.object({
  command: z.literal('mute')
});

export const UnmuteOptionsSchema = z.object({
  command: z.literal('unmute')
});

export const PlayOptionsSchema = z.object({
  command: z.literal('play')
});

export const PauseOptionsSchema = z.object({
  command: z.literal('pause')
});

export const CommandOptionsSchema = z.union([
  ChangeCardOptionsSchema,
  ListCardsOptionsSchema,
  VolumeUpOptionsSchema,
  VolumeDownOptionsSchema,
  PlayOptionsSchema,
  PauseOptionsSchema,
  MuteOptionsSchema,
  UnmuteOptionsSchema
]);

export type ChangeCardOptions = z.infer<typeof ChangeCardOptionsSchema>;
export type ListCardsOptions = z.infer<typeof ListCardsOptionsSchema>;
export type VolumeUpOptions = z.infer<typeof VolumeUpOptionsSchema>;
export type VolumeDownOptions = z.infer<typeof VolumeDownOptionsSchema>;
export type MuteOptions = z.infer<typeof MuteOptionsSchema>;
export type UnmuteOptions = z.infer<typeof UnmuteOptionsSchema>;
export type PlayOptions = z.infer<typeof PlayOptionsSchema>;
export type PauseOptions = z.infer<typeof PauseOptionsSchema>;

export type CommandOptions = z.infer<typeof CommandOptionsSchema>;

type Client = MPDApi.ClientAPI;
type VolumeObj = {
    volume: number;
}

async function getCurrentVolume(client: MPDApi.ClientAPI){
    const obj = await client.api.playback.getvol() as VolumeObj
    if (typeof obj.volume === 'number') { 
        return obj.volume;
      }
      // Maneja el caso en que no haya mezclador
      throw new Error('No hay mezclador disponible');
}

async function withClient<T>(fn: (client: Client) => Promise<T>): Promise<T> {
  const client = await getMPDClient();
  try {
    return await fn(client);
  } finally {
    try{
        await client.disconnect();
    }catch(e){
        console.error('Error al desconectar el cliente MPD:', e);
    }    
  }
}

export async function play() {
    await withClient((client) => client.api.playback.play());
}

export async function pause() {
    await withClient((client) => client.api.playback.pause());
}

export async function stop() {
    await withClient((client) => client.api.playback.stop());
}

export async function next() {
  await withClient((client) => client.api.playback.next());
}

export async function previous() {
  await withClient((client) => client.api.playback.prev());
}

export async function mute() {
    await withClient(async (client) => {
      await db.setVolume(await getCurrentVolume(client));
      client.api.playback.setvol('0')
    }
  );
}

export async function unmute() {
    await withClient(async (client) => {
      client.api.playback.setvol('' + await db.getVolume())
    });
}

async function _volumeUp(client: Client, options?: VolumeUpOptions) {
    const currentVolume = await getCurrentVolume(client);
    const newVolume = Math.min(currentVolume + (options?.amount ?? 5), 100);
    await client.api.playback.setvol('' + newVolume);
}

async function _volumeDown(client: Client, options?: VolumeDownOptions) {
    const currentVolume = await getCurrentVolume(client);
    const newVolume = Math.max(currentVolume - (options?.amount ?? 5), 0);
    await client.api.playback.setvol('' + newVolume);
}

export async function volumeUp(options?: VolumeUpOptions) {
    await withClient((client) => _volumeUp(client, options));
}

export async function volumeDown(options?: VolumeDownOptions) {
    await withClient((client) => _volumeDown(client, options));
}