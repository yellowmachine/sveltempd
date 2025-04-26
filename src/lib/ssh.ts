import { NodeSSH } from 'node-ssh';
import { db } from './db';
import { parseSnapclientOpts } from './utils';

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