import { access } from 'node:fs/promises';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import type { Settings } from '$lib/schemas';

export type Data = { volume: number, admin: Settings };

const defaultData: Data = { volume: 50, admin: {
  global: { latency: 100 },
  server: { ip: '', username: '', password: '' },
  clients: []
} }; 
const dbFile = 'db.json';

class LowdbAdapter {
  db: Low<Data>;
  
  constructor(filename = dbFile) {
    this.db = new Low(new JSONFile<Data>(filename), defaultData);
  }

  async load() {
    await this.db.read();
  }

  async getData() {
    await this.load();
    return this.db.data;
  }

  async setData(data: Partial<Data>) {
    await this.load();
    this.db.data = { ...this.db.data, ...data };
    await this.db.write();
  }

  async getVolume() {
    return (await this.getData()).volume;
  }

  async setVolume(value: number) {
    await this.setData({ volume: value });
  }

  async initialize() {
    try {
      await access(dbFile); 
      await this.db.read();
    } catch (err) {
      this.db.data = defaultData;
      await this.db.write();
    }
  }
  
}


export default LowdbAdapter;
