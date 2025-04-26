import mpdApi from 'mpd-api';
import { db } from './db';

export async function getMPDClient() {
  const serverIp = (await db.getData()).admin?.server.ip || 'localhost';
  return await mpdApi.connect({ host: serverIp, port: 6600 });
}
