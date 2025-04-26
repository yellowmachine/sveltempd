import { getMPDClient } from '$lib/mpdClient';
import type { MPDApi } from 'mpd-api';
import { z } from 'zod';
import { db } from '$lib/db';
import { formatSongArray, queueMsg } from '$lib/messages';
import { exec } from 'child_process';
import { promisify } from 'node:util';
import { restartEachSnapclients } from '$lib/ssh';

const execAsync = promisify(exec);


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

export function toBeIncluded(entry: string) {
  if(entry.startsWith('/')){
    entry = entry.slice(1);
  } 
  if(entry !== '' && !entry.includes('/'))
    return entry;
  return null;
}

export function getFirstLevel(array: {directory: string, file: string[]}[], ruta: string) {
  // Inicializa sets para evitar duplicados
  const dirs = new Set();
  const files = new Set();

  // Normaliza la ruta para evitar problemas de barra final
  const rutaNorm = ruta.replace(/\/$/, "");

  array.forEach(entry => {
    if (entry.directory === rutaNorm) {
      (entry.file || []).forEach(f => {
        let rel = f.slice(rutaNorm.length);
        const include = toBeIncluded(rel);
        if(include) 
          files.add(include);
      });
    }
    
    if (entry.directory.startsWith(rutaNorm)) {
      let resto = entry.directory.slice(rutaNorm.length);
      const include = toBeIncluded(resto);
      if(include)
        dirs.add(include);
    }
  });

  return {
    directories: Array.from(dirs) as string[],
    files: Array.from(files) as string[]
  };
}

type ListAllItem = { file?: string; directory?: string };

class Library {
  private client: Client;
  constructor(client: any) {
    this.client = client;
  }
  async getFolderContent(path: string) {
    const { stdout } = await execAsync('mpc -f "%artist% - %title% - %id% - %file% - %time%" listall "' + path + '"');
    const files = formatSongArray(stdout).filter(item => path !== '' && item.uri.startsWith(path));
    const currentSong = (await execAsync('mpc current -f "%file%"')).stdout
    
    const result = await this.client.api.db.listall(path) as ListAllItem[];
    const directories = result.
      filter(item => typeof item.directory === 'string' && item.directory.startsWith(path)).
      map(item => item.directory).filter(item => item !== undefined)
    
    return {files, directories, currentSong};
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

  async playHere({playlistName, path}: {playlistName?: string, path?: string}) {
    await this.client.api.queue.clear();

    if (playlistName) {
      await this.client.api.playlists.load(playlistName);
    } else if (path) {
      const content = await librarySingleton?.getFolderContent(path);
      if(content){
        for (const file of content.files) {
          await this.client.api.queue.add(file.uri);
        }
      }
    }

    await this.client.api.playback.play();
    await snapclient.restart();
  }


  async play(pos?: number) {
    await this.client.api.playback.play(''+pos);
    await snapclient.restart();
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
    await this.setVol(amount);
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

  async get() {
    return await this.client.api.playlists.get() as unknown as {name: string}[];
  }

  async create(name: string) {
    await this.client.api.playlists.save(name);
  }
  async list(name: string) { 
    const songs = await this.client.api.playlists.listinfo(name) as unknown as {name: string, file: string, time: number, duration: number}[];
    return {name, songs}
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

  async save(name: string, mode: string) {
    await this.client.api.playlists.save(name, mode);
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
    const queue = await queueMsg();
    return queue;
  }
  async add(uri: string) {
    await this.client.api.queue.add(uri);
  }
  async remove(uri: string) {
    await this.client.api.queue.delete(uri);
  }
  async clear() {
    await this.client.api.queue.clear();
  }
}

class Snapclient {
  async restart(){
    await restartEachSnapclients();
  }
}

export const snapclient = new Snapclient();

