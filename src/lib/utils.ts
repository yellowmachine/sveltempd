export function formatTime(seconds: number | null | undefined) {
    if (!seconds) return '';
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  }

export function correctVolume(amount: number) {
    if(amount < 0) return 0
    if(amount > 100) return 100
    return Math.floor(amount)
}

const VALID_SNAPCLIENT_OPTS: Record<string, 'string' | 'boolean' | 'number'> = {
  host: 'string',
  port: 'number',
  player: 'string',
  soundcard: 'string',
  latency: 'number',
  buffer: 'number',
  volume: 'number',
  user: 'string',
  password: 'string',
  logfilter: 'string',
  daemon: 'boolean',
  version: 'boolean',
  help: 'boolean',
  debug: 'boolean',
  logtofile: 'string',
  id: 'string',
  name: 'string',
  mixer: 'string',
  mixer_device: 'string',
  mixer_control: 'string',
  alsa_volume_max: 'number',
  alsa_volume_min: 'number',
  alsa_card: 'string',
  alsa_mixer_device: 'string',
  alsa_mixer_control: 'string'
};

export function parseSnapclientOpts(line: string): Record<string, string | boolean | number> {
  console.log(line)
  if (!/^SNAPCLIENT_OPTS="?([^"]*)"?$/.test(line.trim())) {
    throw new Error('La línea no tiene el formato SNAPCLIENT_OPTS="..."');
  }

  let opts = line.replace(/^SNAPCLIENT_OPTS="?([^"]*)"?$/, '$1').trim();
  const regex = /--([a-zA-Z0-9-_]+)(?:[= ]("[^"]+"|'[^']+'|[^\s]+))?/g;
  const result: Record<string, string | boolean | number> = {};

  let match;
  while ((match = regex.exec(opts)) !== null) {
    const key = match[1].replace(/-/g, '_');
    let value = match[2];

    // Validar si la opción está permitida
    if (!(key in VALID_SNAPCLIENT_OPTS)) {
      throw new Error(`Opción no válida para Snapclient: --${key.replace(/_/g, '-')}`);
    }

    if(key === 'latency')
      continue;

    const expectedType = VALID_SNAPCLIENT_OPTS[key];

    if (value === undefined) {
      // Flag (booleano)
      if (expectedType !== 'boolean') {
        throw new Error(`La opción --${key.replace(/_/g, '-')} requiere un valor`);
      }
      result[key] = true;
    } else {
      value = value.trim();
      // Quitar comillas si las tiene
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      // Validar tipo de valor
      if (expectedType === 'number') {
        const num = Number(value);
        if (isNaN(num)) {
          throw new Error(`El valor de --${key.replace(/_/g, '-')} debe ser un número`);
        }
        result[key] = num;
      } else if (expectedType === 'boolean') {
        // Permitir true/false explícitos, aunque normalmente los flags no llevan valor
        if (value === 'true' || value === '1') {
          result[key] = true;
        } else if (value === 'false' || value === '0') {
          result[key] = false;
        } else {
          throw new Error(`El valor de --${key.replace(/_/g, '-')} debe ser booleano (true/false)`);
        }
      } else {
        result[key] = value;
      }
    }
  }

  if (Object.keys(result).length === 0) {
    throw new Error('No se encontraron opciones válidas en la línea SNAPCLIENT_OPTS');
  }

  return result;
}