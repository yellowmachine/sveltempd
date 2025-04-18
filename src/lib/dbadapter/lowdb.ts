import fs from 'node:fs';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

const defaultData = { volume: 50 }; 
const dbFile = 'settings.json';

class LowdbAdapter {
  db: Low<{ volume: number }>;
  constructor(filename = dbFile) {
    this.db = new Low(new JSONFile<{ volume: number }>(filename), defaultData);
  }
  async load() {
    await this.db.read();
  }
  async getVolume() {
    await this.load();
    return this.db.data.volume;
  }
  async setVolume(value: number) {
    await this.load();
    this.db.data.volume = value;
    await this.db.write();
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
