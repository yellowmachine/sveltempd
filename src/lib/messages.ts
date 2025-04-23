import { exec } from 'child_process';
import { promisify } from 'node:util';
import { getMPDClient } from './mpdClient';
import type { MPDStatus } from './types';

const execAsync = promisify(exec);

function formatSong(line: string) {
    const [artist, title, id, uri, time, ...rest] = line.trim().split('-').map(c => c.trim());
    return { artist: artist || '', title: title || uri || '', id: parseInt(id), uri: uri || '', time: time || '' };
}

export function formatSongArray(stdout: string) {
    const lines = stdout.trim().split('\n');
    const songs = lines.map(line => {
        return formatSong(line);
    });
    return songs;
}

export type Song = {
    artist: string;
    title: string;
    id: number;
    uri: string;
    time: string;
};

export async function queueMsg(): Promise<{queue: Song[], currentSong: string}> { 
  let msg;
  try {
    const { stdout } = await execAsync('mpc -f "%artist% - %title% - %id% - %file% - %time%" playlist');
    const queue = formatSongArray(stdout);
    const currentSong = (await execAsync('mpc current -f "%file%"')).stdout
    msg = {queue, currentSong};
  } catch {
    msg = {queue: [], currentSong: ''};
  }
  return msg;
}

export async function playlistMsg(){
  let msg;

  try {
    const { stdout } = await execAsync('mpc playlist');
    const playlist = formatSongArray(stdout);
    msg = { playlist };
    return msg;
  } catch {
    msg = { playlist: [] };
    return msg;
  }

  //return msg;
}

export async function playerMsg(){
    let msg: MPDStatus, client;

    try{
      client = await getMPDClient();
      msg = {...await client.api.status.get() }
      return msg
    }catch{
      return null
    }finally{
        if (client) {
            client.disconnect();
        }
    }
  }