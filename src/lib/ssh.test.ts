import { describe, it, expect, vi, beforeEach } from 'vitest';
export type Host = {ip: string, username: string, password: string}

// Mocks ANTES de importar el módulo que los usa
vi.mock('./ssh.base', async () => {
  const actual = await vi.importActual('./ssh.base');
  return {
    ...actual,
    executeSSH: vi.fn()
  };
});

vi.mock('./db', async () => {
  const actual = await vi.importActual<typeof import('./db')>('./db');
  return {
    ...actual,
    db: {
      ...actual.db,
      getData: vi.fn()
    }
  };
});

// Importa 'replace' DESPUÉS de definir los mocks
import { replace } from './ssh';
import { db } from './db';
import { executeSSH } from './ssh.base';

describe('replace', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('devuelve la línea SNAPCLIENT_OPTS con latency global', async () => {
    (executeSSH as any).mockResolvedValue('SNAPCLIENT_OPTS="--host=192.168.1.10 --name=Sala"');
    (db.getData as any).mockResolvedValue({ admin: { global: { latency: 150 } } });

    const host: Host = { ip: '192.168.1.10', username: 'test', password: 'test' };
    const commandLine = await replace(host, '--player=alsa');

    const match = commandLine.match(/SNAPCLIENT_OPTS="([^"]+)"/);
    expect(match).not.toBeNull();
    const snapclientOpts = match![1];

    expect(snapclientOpts).toMatch(/--latency=150/);
    expect(snapclientOpts).toMatch(/--player=alsa/);

    
  });
});

/*
describe('joinSnapClientOpts', () => {
  it('convierte opciones simples a línea de comandos', () => {
    const opts = { host: '192.168.1.10', port: 1704, player: 'alsa' };
    expect(joinSnapClientOpts(opts)).toBe('--host=192.168.1.10 --port=1704 --player=alsa');
  });

  it('incluye flags booleanos solo si son true', () => {
    const opts = { debug: true, daemon: false, host: 'localhost' };
    expect(joinSnapClientOpts(opts)).toBe('--debug --host=localhost');
  });

  it('escapa valores con espacios o caracteres especiales', () => {
    const opts = { name: 'Sala Principal', logfilter: '*:info,player:debug' };
    // Puede variar según tu función, ajusta si usas comillas dobles
    expect(joinSnapClientOpts(opts)).toMatch(/--name="Sala Principal"/);
    expect(joinSnapClientOpts(opts)).toContain('--logfilter=*:info,player:debug');

  });

  it('convierte números correctamente', () => {
    const opts = { latency: 150, buffer: 4096 };
    expect(joinSnapClientOpts(opts)).toBe('--latency=150 --buffer=4096');
  });

  it('omite flags booleanos false', () => {
    const opts = { debug: false, daemon: false };
    expect(joinSnapClientOpts(opts)).toBe('');
  });
});
*/
