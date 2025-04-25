import LowdbAdapter from './dbadapter/lowdb';
import type { Settings } from './schemas';

type Data = { volume: number, admin?: Settings };
const defaultData: Data = { volume: 50 };

export const db = new LowdbAdapter();

export async function initializeDB() {
  await db.initialize();
}
