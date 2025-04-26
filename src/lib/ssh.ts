import { NodeSSH } from 'node-ssh';
//import { exec } from 'child_process';
//import { promisify } from 'node:util';
import { db } from './db';

//const execAsync = promisify(exec);

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

export const restartEachSnapclients = async () => {
    const clients = (await db.getData()).admin?.clients;
    if(clients) {
        for(const client of clients) {
            await restartSnapclient(client);
        }
    }
}

export const restartSnapclient = async (host: Host) => 
    await executeSSH('sudo systemctl restart snapclient', host)


export const updateSnapclientOpts = async ({host, currentSnapOpts, newSnapOpts}: 
    {host: Host, currentSnapOpts: string, newSnapOpts: string}) => {
    
                                        const obj = { ...parseSnapclientOpts(currentSnapOpts), ...parseSnapclientOpts(newSnapOpts) };
    let newOpts = joinSnapClientOpts(obj);
    
    newOpts = newOpts.replace(/"/g, '\\"');
    const replaceCmd = `sudo sed -i 's/^SNAPCLIENT_OPTS=.*/SNAPCLIENT_OPTS="${newOpts}"/' /etc/default/snapclient`;
    const restartCmd = 'sudo systemctl restart snapclient';
    await executeSSH(`${replaceCmd} && ${restartCmd}`, host)
    }
    
    export function joinSnapClientOpts(obj: Record<string, string | boolean>): string {
    return Object.entries(obj)
        .map(([key, value]) => {
        const cliKey = '--' + key.replace(/_/g, '-');
        if (typeof value === 'boolean') {
            return value ? cliKey : '';
        }
        // Wrap value in quotes if it contains spaces
        const safeValue = /\s/.test(String(value)) ? `"${value}"` : value;
        return `${cliKey} ${safeValue}`;
        })
        .filter(Boolean)
        .join(' ');
    }
    
    export function parseSnapclientOpts(line: string): Record<string, string | boolean> {
    // Remove the prefix and possible quotes
    let opts = line.replace(/^SNAPCLIENT_OPTS="?([^"]*)"?$/, '$1').trim();
    
    // Split respecting quoted values
    const regex = /--([a-zA-Z0-9-]+)(?:[= ]("[^"]+"|'[^']+'|[^\s]+))?/g;
    const result: Record<string, string | boolean> = {};
    
    let match;
    while ((match = regex.exec(opts)) !== null) {
        const key = match[1].replace(/-/g, '_');
        let value = match[2];
    
        if (value === undefined) {
        result[key] = true; // flag option (e.g., --debug)
        } else {
        value = value.trim();
        // Remove surrounding quotes if present
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
        }
        result[key] = value;
        }
    }
    
    return result;
    }
      