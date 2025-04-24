import { getMPDClient } from '$lib/mpdClient';
import { json } from '@sveltejs/kit';


export async function GET() {
  const client = await getMPDClient();
  const playlist = await client.api.playlists.listinfo();
  return json(playlist);
}
