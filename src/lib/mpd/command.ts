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

  async mute() {
    await db.setVolume(await this.getCurrentVolume());
    await this.client.api.playback.setvol('0');
  }

  async unmute() {
    await this.client.api.playback.setvol('' + await db.getVolume());
  }

  async volumeUp(options?: VolumeUpOptions) {
    const currentVolume = await this.getCurrentVolume();
    const newVolume = Math.min(currentVolume + (options?.amount ?? 5), 100);
    await this.client.api.playback.setvol('' + newVolume);
  }
  async volumeDown(options?: VolumeDownOptions) {
    const currentVolume = await this.getCurrentVolume();
    const newVolume = Math.max(currentVolume - (options?.amount ?? 5), 0);
    await this.client.api.playback.setvol('' + newVolume);
  }
  async stop() {
    await this.client.api.playback.stop();
  }
  /*
  async getStatus() {
    const status = await this.client.api.playback.status();
    return status;
  }
  async getCurrentSong() {
    const currentSong = await this.client.api.playback.currentsong();
    return currentSong;
  }
  async getPlaylist() {
    const playlist = await this.client.api.playback.playlistinfo();
    return playlist;
  }
    */
}

let playerSingleton: Player | null = null;

export async function getPlayer(): Promise<Player> {
  if (!playerSingleton) {
    const client = await getMPDClient();
    playerSingleton = new Player(client);
  }
  return playerSingleton;
}
