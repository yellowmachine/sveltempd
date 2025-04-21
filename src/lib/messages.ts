import { exec } from 'child_process';
import { promisify } from 'node:util';
import { getMPDClient } from './mpdClient';

const execAsync = promisify(exec);

function formatSong(stdout: string) {
    const lines = stdout.trim().split('\n');
    const [artist, ...songParts] = lines[0].trim().split(' - ');
    const title = songParts.join(' - ');
    return { artist: artist || '', title: title || '' };
  }

export async function queueMsg(){
  let msg;
  try {
    const { stdout } = await execAsync('mpc queue');
    const queue = formatSong(stdout);
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
    const playlist = formatSong(stdout);
    msg = { playlist };
  } catch {
    msg = { playlist: [] };
  }

  return msg;
}

export async function playerMsg(){
    let msg, client;
    try{
      client = await getMPDClient();
      msg = {...await client.api.status.get() }
    }finally{
      try{
        if(client) client.disconnect()
      }catch(e){
        console.error('Error al desconectar del cliente MPD:', e);
      }
    }
    return msg;
  }