import { exec } from 'child_process';
import { promisify } from 'node:util';
import { getMPDClient } from './mpdClient';
import type { MPDStatus } from './types';

const execAsync = promisify(exec);

function formatSong(line: string) {
    const [artist, title, id] = line.trim().split(' - ');
    return { artist: artist || '', title: title || '', id: id || '' };
}

function formatSongArray(stdout: string) {
    const lines = stdout.trim().split('\n');
    const songs = lines.map(line => {
        return formatSong(line);
    });
    return songs;
}

export async function queueMsg(){
  let msg;
  try {
    const { stdout } = await execAsync('mpc -f "%artist% - %title% - %id%" playlist');
    const queue = formatSongArray(stdout);
    msg = { queue };
  } catch {
    msg = { queue: [] };
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