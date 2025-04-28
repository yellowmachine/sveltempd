import { playerMsg, queueMsg } from '$lib/messages';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const player = await playerMsg();
  const queue = await queueMsg();
  
  return { player, queue };
};
