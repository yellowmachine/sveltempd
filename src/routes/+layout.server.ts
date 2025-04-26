import { playerMsg, queueMsg, checkIfSetupIsDone } from '$lib/messages';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
  const player = await playerMsg();
  const queue = await queueMsg();
  const setupDone = await checkIfSetupIsDone();
 
  return { player, queue, setupDone };
};
