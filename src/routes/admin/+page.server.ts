import {db} from '$lib/db';

import type { Data } from '$lib/dbadapter/lowdb';

function stripPasswords(data: Data) {
  if (!data.admin) return data;
  const { server, clients, ...restAdmin } = data.admin;

  const { password, ...serverSinPassword } = server;
  const clientsSinPassword = clients.map(({ password, ...clientSinPassword }) => clientSinPassword);

  return {
    ...data,
    admin: {
      ...restAdmin,
      server: serverSinPassword,
      clients: clientsSinPassword
    }
  };
}


export async function load() {
  const data = await db.getData();
  return { db: stripPasswords(data) };
}
