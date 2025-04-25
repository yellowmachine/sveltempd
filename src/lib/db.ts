import LowdbAdapter from './dbadapter/lowdb';

//const defaultData: Data = { volume: 50 };

export const db = new LowdbAdapter();

export async function initializeDB() {
  await db.initialize();
}
