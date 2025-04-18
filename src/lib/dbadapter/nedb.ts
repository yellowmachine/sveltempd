/*
import Datastore from '@seald-io/nedb';

class NeDBAdapter {
  db: any;
  constructor(filename = 'settings.db') {
    this.db = new Datastore({ filename, autoload: true });
  }
  async getVolume() {
    try {
      const doc = await this.db.findOne({}).exec();
      if (doc) {
        return doc.volume;
      } else {
        // If no document exists, insert a new one with default volume
        const defaultVolume = 50;
        await this.db.insert({ volume: defaultVolume });
        return defaultVolume;
      }
    } catch (err) {
      console.error('Error fetching volume:', err);
      throw err;
    }
  }
  async setVolume(value: number) {
    try {
      const doc = await this.db.findOne({}).exec();
      if (doc) {
        await this.db.update({}, { $set: { volume: value } });
      } else {
        await this.db.insert({ volume: value });
      }
    } catch (err) {
      console.error('Error setting volume:', err);
      throw err;
    }
  }
  
}
export default NeDBAdapter;
*/