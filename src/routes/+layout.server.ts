import { playerMsg, queueMsg } from '$lib/messages';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
  //const res = await fetch('/api/mpd-status');
  //const status = await res.json();
  const player = await playerMsg();
  const queue = await queueMsg();
  //const playlist = await playlistMsg();
  //const playlistRes = await fetch('/api/playlist');
  //const playlist = await playlistRes.json();
 
  return { player, ...queue };
};
