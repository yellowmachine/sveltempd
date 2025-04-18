import fs from 'node:fs';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

const defaultData = { volume: 50 }; 
const dbFile = 'settings.json';

function withLoad(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      // @ts-ignore
      await this.load();
      return original.apply(this, args);
    };
    return descriptor;
}

class LowdbAdapter {
  db: Low<{ volume: number }>;
  
  constructor(filename = dbFile) {
    this.db = new Low(new JSONFile<{ volume: number }>(filename), defaultData);
  }

  async load() {
    await this.db.read();
  }

  @withLoad
  async getVolume() {
    return this.db.data.volume;
  }

  @withLoad
  async setVolume(value: number) {
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
