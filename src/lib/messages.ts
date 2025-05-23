import { getMPDClient } from './mpdClient';
import type { MPDStatus } from './types';
import { executeSSHServer } from './ssh.base';
import { db } from './db';


function formatSong(line: string) {
    const [artist, title, id, uri, time, ...rest] = line.trim().split('\\').map(c => c.trim());
    return { artist: artist || '', title: title || uri || '', id: parseInt(id), uri: uri || '', time: time || '' };
}

export function formatSongArray(stdout: string) {
    if(stdout.trim() === '') return [];
    
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

export const checkIfSetupIsDone = async () => {
    return (await (db.getData())).setupDone;
}

export type QueueMsg = {queue: Song[], currentSong: string}

export async function queueMsg(): Promise<QueueMsg> { 
  let msg;
  try {
    const mpcPlaylist = await executeSSHServer('mpc -f "%artist% \\ %title% \\ %id% \\ %file% \\ %time%" playlist');
    const queue = formatSongArray(mpcPlaylist);
    const currentSong = await executeSSHServer('mpc current -f "%file%"');
    
    msg = {queue, currentSong};
  } catch {
    msg = {queue: [], currentSong: ''};
  }
  return msg;
}

export async function playlistMsg(){
  return await queueMsg();
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