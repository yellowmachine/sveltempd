import fs from 'node:fs';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

type Data = { volume: number };

const defaultData: Data = { volume: 50 }; 
const dbFile = 'settings.json';

class LowdbAdapter {
  db: Low<{ volume: number }>;
  
  constructor(filename = dbFile) {
    this.db = new Low(new JSONFile<{ volume: number }>(filename), defaultData);
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
    if (!fs.existsSync(dbFile)) {
      await this.db.read();
      if (this.db.data === null) {
        this.db.data = defaultData;
        await this.db.write();
      }
    } else {
      await this.db.read();
    }
  }
}

export default LowdbAdapter;
