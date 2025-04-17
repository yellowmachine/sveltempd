import type { EventEmitter } from 'events';

import mpd from 'mpd2';

export async function startListening() {
    const client = await mpd.connect({
      host: 'tu_servidor_mpd',
      port: 6600,
    });

    const eeClient = client as unknown as EventEmitter;

    console.log('Conectado al servidor MPD para eventos.');

    eeClient.on('system', (name: string) => {
        console.log('MPD system event:', name);
    });

}