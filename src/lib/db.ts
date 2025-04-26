import LowdbAdapter from './dbadapter/lowdb';

export const db = new LowdbAdapter();

export async function initializeDB() {
  await db.initialize();
}
