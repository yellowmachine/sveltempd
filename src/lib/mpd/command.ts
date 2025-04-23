import { getMPDClient } from '$lib/mpdClient';
import type { MPDApi } from 'mpd-api';
import { z } from 'zod';
import { db } from '$lib/db';
import { formatSongArray, queueMsg } from '$lib/messages';
import { exec } from 'child_process';
import { promisify } from 'node:util';
import { NodeSSH } from 'node-ssh';


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
    await this.setVol(amount);
  }

  async volumeInc(amount: number) {
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

export async function updateSnapclientOpts(
  host: string,
  username: string,
  password: string,
  currentSnapOpts: string,
  newSnapOpts: string
) {
  const ssh = new NodeSSH();
  try {
    await ssh.connect({
      host,
      username,
      password
    });

    const obj = { ...parseSnapclientOpts(currentSnapOpts), ...parseSnapclientOpts(newSnapOpts) };
    let newOpts = joinSnapClientOpts(obj);

    newOpts = newOpts.replace(/"/g, '\\"');
    const replaceCmd = `sudo sed -i 's/^SNAPCLIENT_OPTS=.*/SNAPCLIENT_OPTS="${newOpts}"/' /etc/default/snapclient`;
    const restartCmd = 'sudo systemctl restart snapclient';

    const { stdout, stderr } = await ssh.execCommand(`${replaceCmd} && ${restartCmd}`);
    if (stderr) {
      throw new Error(stderr);
    }
    return stdout;
  } finally {
    ssh.dispose();
  }
}

export function joinSnapClientOpts(obj: Record<string, string | boolean>): string {
  return Object.entries(obj)
    .map(([key, value]) => {
      const cliKey = '--' + key.replace(/_/g, '-');
      if (typeof value === 'boolean') {
        return value ? cliKey : '';
      }
      // Wrap value in quotes if it contains spaces
      const safeValue = /\s/.test(String(value)) ? `"${value}"` : value;
      return `${cliKey} ${safeValue}`;
    })
    .filter(Boolean)
    .join(' ');
}

export function parseSnapclientOpts(line: string): Record<string, string | boolean> {
  // Remove the prefix and possible quotes
  let opts = line.replace(/^SNAPCLIENT_OPTS="?([^"]*)"?$/, '$1').trim();

  // Split respecting quoted values
  const regex = /--([a-zA-Z0-9-]+)(?:[= ]("[^"]+"|'[^']+'|[^\s]+))?/g;
  const result: Record<string, string | boolean> = {};

  let match;
  while ((match = regex.exec(opts)) !== null) {
    const key = match[1].replace(/-/g, '_');
    let value = match[2];

    if (value === undefined) {
      result[key] = true; // flag option (e.g., --debug)
    } else {
      value = value.trim();
      // Remove surrounding quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      result[key] = value;
    }
  }

  return result;
}

