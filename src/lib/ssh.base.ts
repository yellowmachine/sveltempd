import { NodeSSH } from 'node-ssh';
import { db } from './db';
import { decrypt } from './cryptutils';

export type Host = {ip: string, username: string, password: string}


export async function executeSSH(command: string, host: Host) {
  const ssh = new NodeSSH();
  try {
    await ssh.connect({
      host: host.ip,
      username: host.username,
      password: decrypt(host.password) 
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



export const executeSSHServer = async (command: string) => {
  const server = (await db.getDataWithPassword()).admin?.server;
  if(!server) throw new Error('Server not found');
  
  return await executeSSH(command, server);
}