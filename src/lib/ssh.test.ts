import { describe, it, expect } from 'vitest';
import { parseSnapclientOpts, joinSnapClientOpts } from './ssh';

describe('parseSnapclientOpts', () => {
  it('parsea opciones básicas con valores', () => {
    const input = 'SNAPCLIENT_OPTS="--host=192.168.1.10 --port=1704 --player=alsa"';
    expect(parseSnapclientOpts(input)).toEqual({
      host: '192.168.1.10',
      port: 1704,
      player: 'alsa'
    });
  });

  it.skip('parsea flags booleanos', () => {
    const input = 'SNAPCLIENT_OPTS="--debug --daemon"';
    expect(parseSnapclientOpts(input)).toEqual({
      debug: true,
      daemon: true
    });
  });

  it('parsea valores numéricos correctamente', () => {
    const input = 'SNAPCLIENT_OPTS="--latency=120 --buffer=3000 --volume=80"';
    expect(parseSnapclientOpts(input)).toEqual({
      latency: 120,
      buffer: 3000,
      volume: 80
    });
  });

  it('parsea valores con espacios y comillas', () => {
    const msg = {
        line: 'SNAPCLIENT_OPTS="--name=\'Sala Principal\' --logfilter=*:info,player:debug"'
    }
      
    expect(parseSnapclientOpts(msg.line)).toEqual({
      name: 'Sala Principal',
      logfilter: '*:info,player:debug'
    });
  });

  it('lanza excepción si el formato es incorrecto', () => {
    expect(() => parseSnapclientOpts('--host=192.168.1.10')).toThrow();
  });

  it('lanza excepción si hay opciones no válidas', () => {
    const input = 'SNAPCLIENT_OPTS="--host=192.168.1.10 --fakeopt=foo"';
    expect(() => parseSnapclientOpts(input)).toThrow(/no válida/i);
  });

  it('lanza excepción si el valor numérico es inválido', () => {
    const input = 'SNAPCLIENT_OPTS="--latency=foo"';
    expect(() => parseSnapclientOpts(input)).toThrow(/número/);
  });

  it('lanza excepción si no hay ninguna opción válida', () => {
    const input = 'SNAPCLIENT_OPTS=""';
    expect(() => parseSnapclientOpts(input)).toThrow(/no se encontraron/i);
  });
});


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
