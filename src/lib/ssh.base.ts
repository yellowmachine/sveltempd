import { NodeSSH } from 'node-ssh';

export type Host = {ip: string, username: string, password: string}


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