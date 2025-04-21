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

class Library {
  private client: Client;
  constructor(client: any) {
    this.client = client;
  }
  async getFolderContent(folder: string) {
    const library = await this.client.api.db.lsinfo(folder) as object[];
  }
}

let librarySingleton: Library | null = null;
export async function getLibrary(): Promise<Library> {
  if (!librarySingleton) {
    const client = await getMPDClient();
    librarySingleton = new Library(client);
  }
  return librarySingleton;
}

class Player {
  private client: Client;

  constructor(client: any) {
    this.client = client;
  }

  async playHere({playlistName, files}: {playlistName?: string, files?: string[]}) {
    await this.client.api.queue.clear();

    if (playlistName) {
      // Cargar la playlist por nombre
      await this.client.api.playlists.load(playlistName);
    } else if (files) {
      // Añadir canciones una a una
      for (const file of files) {
        await this.client.api.queue.add(file);
      }
    }

    await this.client.api.playback.play();
    return { ok: true };
  }


  async play() {
    await this.client.api.playback.play();
  }

  async pause() {
    await this.client.api.playback.pause();
  }

  async seek(time: number) {
    await this.client.api.playback.seekcur(''+time);
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

let playlistSingleton: Playlist | null = null;
export async function getPlaylist(): Promise<Playlist> {
  if (!playlistSingleton) {
    const client = await getMPDClient();
    playlistSingleton = new Playlist(client);
  }
  return playlistSingleton;
}
class Playlist {
  private client: Client;

  constructor(client: any) {
    this.client = client;
  }

  async create(name: string) {
    await this.client.api.playlists.save(name);
  }
  async list(name: string) { 
    return await this.client.api.playlists.listinfo(name);
  }
  async load(name: string) {
    await this.client.api.queue.clear();
    await this.client.api.playlists.load(name);
  }
  async add(uri: string) {
    await this.client.api.playlists.add(uri);
  }
  async remove(uri: string) {
    await this.client.api.playlists.remove(uri);

  }
  async clear(name: string) {
    await this.client.api.playlists.clear();
  }
}

let queueSingleton: Queue | null = null;
export async function getQueue(): Promise<Queue> {
  if (!queueSingleton) {
    const client = await getMPDClient();
    queueSingleton = new Queue(client);
  }
  return queueSingleton;
}

class Queue {
  private client: Client;
  constructor(client: any) {
    this.client = client;
  }
  async info() {
    const queue = await this.client.api.queue.info();
    return queue;
  }
  async remove(uri: string) {
    await this.client.api.queue.delete(uri);
  }
  async clear() {
    await this.client.api.queue.clear();
  }
}