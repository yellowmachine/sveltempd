<script lang="ts">
    import { invalidate } from '$app/navigation';
	  import { trpcSetupclient } from '$lib/trpcClients';

    let ip = $state('');
    let username = $state('');
    let password = $state('');
  
    async function handleSubmit(event: Event) {
      event.preventDefault();
      const ok = await trpcSetupclient.update({ ip, username, password });
      if (ok) {
        await invalidate('/');
      }
    }
  </script>
  
  <h2 class="text-2xl font-bold mb-4">Configuración del Servidor</h2>
  <form class="max-w-sm mx-auto mt-8 p-6 bg-white rounded shadow" onsubmit={handleSubmit}>
    <div class="mb-4">
      <label class="block text-gray-700 font-bold mb-2" for="ip">
        Ip
      </label>
      <input
        class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        id="ip"
        type="text"
        bind:value={ip}
        required
      />
    </div>
    <div class="mb-4">
      <label class="block text-gray-700 font-bold mb-2" for="username">
        Usuario
      </label>
      <input
        class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        id="username"
        type="text"
        bind:value={username}
        required
        autocomplete="username"
      />
    </div>
    <div class="mb-6">
      <label class="block text-gray-700 font-bold mb-2" for="password">
        Contraseña
      </label>
      <input
        class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        id="password"
        type="password"
        bind:value={password}
        required
        autocomplete="new-password"
      />
    </div>
    <button
      type="submit"
      class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
    >
      Guardar configuración
    </button>
  </form>
  