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

export const VolumeOptionsSchema = z.object({
  command: z.literal('volume'),
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

export const NextOptionsSchema = z.object({
  command: z.literal('next')
});

export const PrevOptionsSchema = z.object({
  command: z.literal('prev')
});

export const CommandOptionsSchema = z.union([
  ChangeCardOptionsSchema,
  ListCardsOptionsSchema,
  VolumeOptionsSchema,
  PlayOptionsSchema,
  PauseOptionsSchema,
  MuteOptionsSchema,
  UnmuteOptionsSchema,
  NextOptionsSchema,
  PrevOptionsSchema
]);

export type ChangeCardOptions = z.infer<typeof ChangeCardOptionsSchema>;
export type ListCardsOptions = z.infer<typeof ListCardsOptionsSchema>;
export type VolumeOptions = z.infer<typeof VolumeOptionsSchema>;
export type MuteOptions = z.infer<typeof MuteOptionsSchema>;
export type UnmuteOptions = z.infer<typeof UnmuteOptionsSchema>;
export type PlayOptions = z.infer<typeof PlayOptionsSchema>;
export type PauseOptions = z.infer<typeof PauseOptionsSchema>;
export type NextOptions = z.infer<typeof NextOptionsSchema>;
export type PrevOptions = z.infer<typeof PrevOptionsSchema>;

export type CommandOptions = z.infer<typeof CommandOptionsSchema>;

type Client = MPDApi.ClientAPI;
type VolumeObj = {
    volume: number;
}

class Player {
  private client: Client;

  constructor(client: any) {
    this.client = client;
  }

  async play() {
    await this.client.api.playback.play();
  }

  async pause() {
    await this.client.api.playback.pause();
  }

  async next() {
    await this.client.api.playback.next();
  }

  async prev() {
    await this.client.api.playback.prev();
  }

  async getCurrentVolume() {
    const obj = await this.client.api.playback.getvol() as VolumeObj
    if (typeof obj.volume === 'number') { 
        return obj.volume;
    }
    throw new Error('No hay mezclador disponible');
  }

  private async setVol(vol: number) {
    await this.client.api.playback.setvol('' + vol);
  }

  async mute() {
    await db.setVolume(await this.getCurrentVolume());
    await this.setVol(0);
  }

  async unmute() {
    await this.setVol(await db.getVolume());
  }

  async volume(amount: number) {
    const currentVolume = await this.getCurrentVolume();
    let newVolume = currentVolume + amount;
    if(newVolume > 100) {
        newVolume = 100;
    } else if(newVolume < 0) {
        newVolume = 0;
    }
    await this.setVol(newVolume);
  }
  async stop() {
    await this.client.api.playback.stop();
  }
}

let playerSingleton: Player | null = null;

export async function getPlayer(): Promise<Player> {
  if (!playerSingleton) {
    const client = await getMPDClient();
    playerSingleton = new Player(client);
  }
  return playerSingleton;
}
