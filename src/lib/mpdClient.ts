import mpdApi from 'mpd-api';

export async function getMPDClient() {
  return await mpdApi.connect({ host: 'localhost', port: 6600 });
}
