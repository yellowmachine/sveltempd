<script lang="ts">
    import { invalidate } from '$app/navigation';
	  import { hostSchema } from '$lib/schemas';
	  import { trpcSetupclient } from '$lib/trpcClients';

    let ip = $state('');
    let username = $state('');
    let password = $state('');
    let errors: Record<string, string> = $state({});

    function validate() {
      const result = hostSchema.safeParse({ip, username, password});
      errors = {};
      if (!result.success) {
        for (const issue of result.error.issues) {
          errors[issue.path.join('.')] = issue.message;
        }
        return false;
      }
      return true;
    }
  
    async function handleSubmit(event: Event) {
      event.preventDefault();
      if (!validate()) return;
      const ok = await trpcSetupclient.update({ ip, username, password });
      if (ok) {
        await invalidate('/');
      }
    }
  </script>
  
  <form class="max-w-sm mx-auto mt-8 p-6 bg-white rounded border border-orange-300" onsubmit={handleSubmit}>
    <h2 class="text-2xl font-bold mb-4 text-orange-600 text-center">Configuración inicial</h2>
    <h2 class="text-2xl font-bold mb-4 text-orange-600 text-center">Datos de ssh al servidor mpd</h2>
    <div class="mb-4">
      <label class="block text-gray-700 font-bold mb-2 text-orange-600" for="ip">
        Ip
      </label>
      <input
        class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
        id="ip"
        type="text"
        bind:value={ip}
        placeholder="localhost"
      />
    </div>
    <div class="mb-4">
      <label class="block text-gray-700 font-bold mb-2 text-orange-600" for="username">
        Usuario
      </label>
      <input
        class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
        id="username"
        type="text"
        bind:value={username}
        autocomplete="username"
      />
    </div>
    <div class="mb-6">
      <label class="block text-gray-700 font-bold mb-2 text-orange-600" for="password">
        Contraseña
      </label>
      <input
        class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-oreange-500"
        id="password"
        type="password"
        bind:value={password}
        autocomplete="new-password"
      />
    </div>
    <button
      type="submit"
      class="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded transition"
    >
      Guardar configuración
    </button>
    {#if Object.keys(errors).length > 0}
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 mt-4">
        <ul class="list-disc pl-5">
          {#each Object.entries(errors) as [field, message]}
            <li><strong>{field}:</strong> {message}</li>
          {/each}
        </ul>
      </div>
    {/if}
  </form>
  