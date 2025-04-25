import {db} from '$lib/db';

export async function load() {
  const data = await db.getData();
  return { db: data };
}
