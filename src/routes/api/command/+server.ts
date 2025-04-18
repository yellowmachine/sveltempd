import { json, type RequestHandler } from '@sveltejs/kit';
import { exec } from 'child_process';
import fs from 'fs/promises';
import { getPlayer, CommandOptionsSchema } from '$lib/mpd/command';
import type { ChangeCardOptions, CommandOptions } from '$lib/mpd/command';
  

async function getSoundCards(): Promise<string[]> {
  return new Promise((resolve, reject) => {
    exec('snapclient -l', (error, stdout) => {
      if (error) {
        reject(error);
        return;
      }
      const dispositivos = stdout
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
      resolve(dispositivos);
    });
  });
}

async function changeActiveCard(options: ChangeCardOptions): Promise<void> {
  const { host, deviceIndex } = options;

  if (!host || deviceIndex === undefined) {
    throw new Error('Se requieren "host" y "deviceIndex"');
  }

  const filePath = '/etc/default/snapclient';

  let content = await fs.readFile(filePath, 'utf-8');
  const newLine = `SNAPCLIENT_OPTS="-h ${host} -s ${deviceIndex}" --latency 100`;
  const regex = /^SNAPCLIENT_OPTS=.*$/m;

  if (regex.test(content)) {
    content = content.replace(regex, newLine);
  } else {
    content += `\n${newLine}\n`;
  }

  await fs.writeFile(filePath, content, 'utf-8');

  await new Promise<void>((resolve, reject) => {
    exec('systemctl restart snapclient', (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

    
export const POST: RequestHandler = async ({ request }) => {
    try {
      const body = await request.json() as CommandOptions;
      const options = CommandOptionsSchema.safeParse(body);

      if (!options.success) {
        return json({ error: 'Comando no soportado', details: options.error.errors }, { status: 400 });
      }
  
      //const result = await commandHandler(options.data);
  
      return json({ success: true /*, result */ });
    } catch (error: unknown) {
        const message = error instanceof Error
            ? error.message
            : 'Error interno';

        return json({ error: message }, { status: 500 });
    } 
  };

  