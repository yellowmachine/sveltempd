import mpdApi from 'mpd-api';
import type { MPDApi } from 'mpd-api';

type Client = MPDApi.ClientAPI;

type MpdCommandOptions = Record<string, any>;

type VolumeObj = { volume: number };


export interface ChangeCardOptions {
    command: 'changeCard';
    host: string;
    deviceIndex: string | number;
  }

interface ListCardsOptions {
    command: 'listCards';
    host: string;
    deviceIndex: string | number;
  }  

interface VolumeUpOptions {
    command: 'volumeUp';
    // Puedes agregar más campos si lo necesitas, por ejemplo, cantidad
    amount?: number;
  }
  
interface VolumeDownOptions {
    command: 'volumeDown';
    amount?: number;
  }
  
interface MuteOptions {
    command: 'mute';
  }
  
interface UnmuteOptions {
    command: 'unmute';
  }
  
interface PlayOptions {
    command: 'play';
}

interface PauseOptions {
    command: 'pause';
}

  // Unión de todas las opciones posibles
export type CommandOptions =
    | ChangeCardOptions
    | ListCardsOptions
    | VolumeUpOptions
    | VolumeDownOptions
    | PlayOptions
    | PauseOptions
    | MuteOptions
    | UnmuteOptions;

async function getCurrentVolume(client: MPDApi.ClientAPI){
    const obj = await client.api.playback.getvol() as VolumeObj
    if (typeof obj.volume === 'number') { 
        return obj.volume;
      }
      // Maneja el caso en que no haya mezclador
      throw new Error('No hay mezclador disponible');
}

async function withClient<T>(fn: (client: Client) => Promise<T>): Promise<T> {
  const client = await mpdApi.connect({ host: 'localhost', port: 6600 });
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
    //await client.sendCommand('next');
}

export async function previous() {
  //await client.sendCommand('previous');
}

export async function mute() {
    await withClient((client) => client.api.playback.setvol('0'));
}

export async function unmute() {
    await withClient((client) => client.api.playback.setvol('30'));
}

async function _volumeUp(client: Client, options?: MpdCommandOptions) {
    const currentVolume = await getCurrentVolume(client);
    const newVolume = Math.min(currentVolume + (options?.amount ?? 5), 100);
    await client.api.playback.setvol('' + newVolume);
}

async function _volumeDown(client: Client, options?: MpdCommandOptions) {
    const currentVolume = await getCurrentVolume(client);
    const newVolume = Math.max(currentVolume - (options?.amount ?? 5), 0);
    await client.api.playback.setvol('' + newVolume);
}

export async function volumeUp(options?: MpdCommandOptions) {
    await withClient((client) => _volumeUp(client, options));
}

export async function volumeDown(options?: MpdCommandOptions) {
    await withClient((client) => _volumeDown(client, options));
}