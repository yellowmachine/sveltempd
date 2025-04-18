import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import fs from 'node:fs';
import path from 'node:path';

type Data = { volume: number };
const defaultData: Data = { volume: 50 };

const dbFile = path.resolve('db.json');
const adapter = new JSONFile<Data>(dbFile);
export const db = new Low<Data>(adapter, defaultData);

export async function initializeDB() {
  if (!fs.existsSync(dbFile)) {
    await db.read();
    if (db.data === null) {
      db.data = defaultData;
      await db.write();
    }
  } else {
    await db.read();
  }
}
