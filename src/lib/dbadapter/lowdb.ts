import { access } from 'node:fs/promises';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import type { Settings, SettingsWithPassword } from '$lib/schemas';

export type Data = { volume: number, admin: Settings };
type DataWithPassword = Omit<Data, 'admin'> & { admin: SettingsWithPassword };

const defaultData: Data = { volume: 50, admin: {
  global: { latency: 100 },
  server: { ip: 'localhost', username: 'someuser', password: null },
  clients: []
} }; 
const dbFile = 'db.json';

function stripPasswords(data: Data) {
  if (!data.admin) return data;
  const { server, clients, ...restAdmin } = data.admin;

  const { password, ...serverSinPassword } = server;
  const clientsSinPassword = clients.map(({ password, ...clientSinPassword }) => clientSinPassword);

  return {
    ...data,
    admin: {
      ...restAdmin,
      server: serverSinPassword,
      clients: clientsSinPassword
    }
  };
}

class LowdbAdapter {
  db: Low<Data>;
  
  constructor(filename = dbFile) {
    this.db = new Low(new JSONFile<Data>(filename), defaultData);
  }

  async load() {
    await this.db.read();
  }

  async getData(): Promise<Data> {
    await this.load();
    return stripPasswords(this.db.data) as Data;
  }

  async getDataWithPassword(): Promise<DataWithPassword> {
    await this.load();
    return this.db.data as DataWithPassword;
  }

  async setData(data: Partial<DataWithPassword>) {
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
