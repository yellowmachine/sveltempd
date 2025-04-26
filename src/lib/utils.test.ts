import { describe, it, expect } from 'vitest';
import { formatTime, correctVolume, parseSnapclientOpts } from './utils';

describe('formatTime', () => {
  it('returns empty string for undefined', () => {
    expect(formatTime(undefined)).toBe('');
  });

  it('returns empty string for 0', () => {
    expect(formatTime(0)).toBe('');
  });

  it('formats single-digit seconds', () => {
    expect(formatTime(7)).toBe('0:07');
  });

  it('formats under a minute', () => {
    expect(formatTime(42)).toBe('0:42');
  });

  it('formats minutes and seconds', () => {
    expect(formatTime(125)).toBe('2:05');
    expect(formatTime(3599)).toBe('59:59');
  });

  it('rounds down seconds', () => {
    expect(formatTime(125.9)).toBe('2:05');
  });
});

describe('correctVolume', () => {
  it('returns 0 for negative values', () => {
    expect(correctVolume(-10)).toBe(0);
  });

  it('returns 100 for values over 100', () => {
    expect(correctVolume(150)).toBe(100);
    expect(correctVolume(101)).toBe(100);
  });

  it('returns rounded value for values between 0 and 100', () => {
    expect(correctVolume(50)).toBe(50); 
    expect(correctVolume(75.4)).toBe(75);
  });

  it('returns 0 for 0', () => {
    expect(correctVolume(0)).toBe(0);
  });

  it('returns 100 for 100', () => {
    expect(correctVolume(100)).toBe(100); 
  });
});

describe('parseSnapclientOpts', () => {
  it('parsea opciones básicas con valores', () => {
    const input = 'SNAPCLIENT_OPTS="--host=192.168.1.10 --port=1704 --player=alsa"';
    expect(parseSnapclientOpts(input)).toEqual({
      host: '192.168.1.10',
      port: 1704,
      player: 'alsa'
    });
  });

  it('parsea opciones básicas con valores excluye latency', () => {
    const input = 'SNAPCLIENT_OPTS="--host=192.168.1.10 --latency=150 --port=1704 --player=alsa"';
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
    const input = 'SNAPCLIENT_OPTS="--buffer=3000 --volume=80"';
    expect(parseSnapclientOpts(input)).toEqual({
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

  it.skip('lanza excepción si el valor numérico es inválido', () => {
    const input = 'SNAPCLIENT_OPTS="--latency=foo"';
    expect(() => parseSnapclientOpts(input)).toThrow(/número/);
  });

  it('lanza excepción si no hay ninguna opción válida', () => {
    const input = 'SNAPCLIENT_OPTS=""';
    expect(() => parseSnapclientOpts(input)).toThrow(/no se encontraron/i);
  });
});
