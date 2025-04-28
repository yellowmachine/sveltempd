import { playerMsg, queueMsg } from '$lib/messages';
//import { getMPDClient } from '$lib/mpdClient';
import { json } from '@sveltejs/kit';


export async function GET() {
  //const client = await getMPDClient();
  //client.api.status.get();
  const player = await playerMsg();
  const queue = await queueMsg();
  const msg = { player, queue };
  return json(msg);
}
