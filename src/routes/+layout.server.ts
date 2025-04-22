import { playerMsg, queueMsg } from '$lib/messages';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
  const player = await playerMsg();
  const queue = await queueMsg();
 
  return { player, queue };
};
