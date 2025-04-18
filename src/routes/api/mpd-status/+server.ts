import { getMPDClient } from '$lib/mpdClient';
import { json } from '@sveltejs/kit';


export async function GET() {
  const client = await getMPDClient();
  const status = await client.api.status.get();
  return json({ ...status });
}
