import { NodeSSH } from 'node-ssh';
import { db } from './db';

export async function executeSSH(command: string, host: Host) {
  const ssh = new NodeSSH();
  try {
    await ssh.connect({
      host: host.ip,
      username: host.username,
      password: host.password
    });

    const { stdout, stderr } = await ssh.execCommand(`${command}`);
    if (stderr) {
      throw new Error(stderr);
    }
    return stdout;
  } finally {
    ssh.dispose();
  }
}

type Host = {ip: string, username: string, password: string}

export async function getSnapclientOpts(host: Host){
    return await executeSSH('cat /etc/default/snapclient | grep ^SNAPCLIENT_OPTS', host);      
}

export const restartEachSnapclients = async () => {
    await executeSSHEachClient('sudo systemctl restart snapclient')
}

export const updateSnapclientOptsEachClient = async (newSnapOpts: string) => {
    const clients = (await db.getData()).admin?.clients || [];
    const cmdArray = await Promise.all(clients.map(async (c) => {
        const command = await replace(c, newSnapOpts);
        return { ip: c.ip, command };
    }));

    // Convierte el array a un objeto { [ip]: command }
    const cmd: Record<string, string> = Object.fromEntries(
        cmdArray.map(({ ip, command }) => [ip, command])
    );

    await executeSSHEachClient(cmd);
};


async function replace(ip: Host, newSnapOpts: string) {
    const currentSnapOpts = await getSnapclientOpts(ip);

    // Parsear y fusionar opciones, las nuevas sobrescriben a las actuales
    const obj = { ...parseSnapclientOpts(currentSnapOpts), ...parseSnapclientOpts(newSnapOpts) };

    // Unir las opciones en una sola línea
    let newOpts = joinSnapClientOpts(obj);

    // Escapar comillas para sed
    newOpts = newOpts.replace(/"/g, '\\"');

    const replaceCmd = `sudo sed -i 's/^SNAPCLIENT_OPTS=.*/SNAPCLIENT_OPTS="${newOpts}"/' /etc/default/snapclient`;
    const restartCmd = 'sudo systemctl restart snapclient';

    return `${replaceCmd} && ${restartCmd}`;
}


type Command = string | Record<string, string>; // { [ip: string]: command: string }

async function executeSSHEachClient(cmd: Command) {
    const clients = (await db.getData()).admin?.clients || [];
    
    // Convertir cmd a un mapa de IPs para O(1) lookups
    const commandMap = typeof cmd === 'string' 
        ? Object.fromEntries(clients.map(c => [c.ip, cmd])) 
        : cmd;

    await Promise.all(
        clients.map(async (client) => {
            const command = commandMap[client.ip];
            
            if (!command) {
                console.log(`No command for IP ${client.ip}, skipping.`);
                return;
            }

            try {
                await executeSSH(command, client);
            } catch (error) {
                console.error(`Error executing command on ${client.ip}:`, error);
            }
        })
    );
}
    
export function joinSnapClientOpts(opts: Record<string, string | boolean | number>): string {
    return Object.entries(opts)
        .map(([key, value]) => {
            const cliKey = '--' + key.replace(/_/g, '-');
            if (typeof value === 'boolean') {
                // Solo incluir flags si son true
                return value ? cliKey : '';
            } else if (typeof value === 'number') {
                return `${cliKey}=${value}`;
            } else {
                // Si el valor contiene espacios o caracteres especiales, poner comillas
                const needsQuotes = /\s|["'\\]/.test(value);
                const safeValue = needsQuotes ? `"${value.replace(/(["\\])/g, '\\$1')}"` : value;
                return `${cliKey}=${safeValue}`;
            }
        })
        .filter(Boolean) // Elimina cadenas vacías (flags false)
        .join(' ');
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
  
async function streamJournal() {
    const ssh = new NodeSSH();

    try {
        await ssh.connect({
        host: 'tuserver.com',
        username: 'tuusuario',
        privateKey: '/ruta/a/tu/llave_privada'
        });
    
        // Ejecutar journalctl -f (seguimiento en tiempo real)
        await ssh.exec('journalctl', ['-f', '-u', 'snapclient.service'], {
        onStdout: (chunk) => {
            console.log('Nueva línea:', chunk.toString('utf8'));
        },
        onStderr: (chunk) => {
            console.error('Error:', chunk.toString('utf8'));
        },
        // Opcional: forzar el cierre después de 30 segundos (si no se usa, el comando seguirá corriendo)
        execOptions: { 
            timeout: 30000 
        }
        });
    
    } catch (error) {
        console.error('Error de conexión/comando:', error);
    }
}