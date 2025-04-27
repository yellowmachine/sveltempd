<script lang="ts">
    import { settingsSchema, type Settings } from "$lib/schemas";
	import { createAsync } from "$lib/stores.svelte";
	import { trpcAdmin } from "$lib/trpcClients";
	import ActionButton from "./ActionButton.svelte";

    let {data}: {data?: Settings} = $props();

    console.log(data)

    const mut = createAsync(submit);

    let form: Settings = $state(data || { global: { latency: 100 }, 
                                          server: { ip: '', username: '', password: '' }, 
                                          clients: [] 
                                        });
  
    let errors: Record<string, string> = $state({});
  
    function validate() {
      const result = settingsSchema.safeParse(form);
      errors = {};
      if (!result.success) {
        for (const issue of result.error.issues) {
          errors[issue.path.join('.')] = issue.message;
        }
        return false;
      }
      return true;
    }
  
    async function submit(event: SubmitEvent) {
        event.preventDefault();
        if (!validate()) //return;
          throw new Error('Invalid form');
        form = await trpcAdmin.save(form) 
    }
  
    function addClient() {
      if (!validate()) 
          throw new Error('No puedes porque hay errores en el formulario');
      form = {...form, clients: [...form.clients, { ip: '', username: '', password: '' }]};
    }
    function removeClient(index: number) {
      form.clients.splice(index, 1);
    }
  </script>
  
  {JSON.stringify(errors, null, 2)}
  <form class="max-w-xl mx-auto p-6 bg-white shadow rounded space-y-6" onsubmit={submit}>
    <h2 class="text-2xl font-bold mb-4">Configuración del Servidor</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="p-2">
          <label for="server-ip" class="block font-medium mb-1">IP</label>
          <input id="server-ip" class="input w-full" bind:value={form.server.ip} />
          {#if errors['server.ip']}<span class="text-red-500 text-xs">{errors['server.ip']}</span>{/if}
        </div>
        <div class="p-2">
          <label for="server-username" class="block font-medium mb-1">Usuario</label>
          <input id="server-username" class="input w-full" bind:value={form.server.username} />
          {#if errors['server.username']}<span class="text-red-500 text-xs">{errors['server.username']}</span>{/if}
        </div>
        <div class="p-2">
          <label for="server-password" class="block font-medium mb-1">Contraseña</label>
          <input id="server-password" class="input w-full" type="password" bind:value={form.server.password} />
          {#if errors['server.password']}<span class="text-red-500 text-xs">{errors['server.password']}</span>{/if}
        </div>
      </div>
      
  
      <h2 class="text-2xl font-bold mb-4">Clientes</h2>
      {#each form.clients as client, i (i)}
        <div class="clientparent grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
          <div class="p-2">
            <label for="client-ip" class="block font-medium mb-1">IP</label>
            <input id="client-ip" class="input w-full" bind:value={client.ip} />
            {#if errors[`clients.${i}.ip`]}
              <span class="text-red-500 text-xs">{errors[`clients.${i}.ip`]}</span>
            {/if}
          </div>
          <div class="p-2">
            <label for="client-username" class="block font-medium mb-1">Usuario</label>
            <input id="client-username" class="input w-full" bind:value={client.username} />
            {#if errors[`clients.${i}.username`]}
              <span class="text-red-500 text-xs">{errors[`clients.${i}.username`]}</span>
            {/if}
          </div>
          <div class="p-2 flex items-end space-x-2">
            <div class="flex-1">
              <label for="client-password" class="block font-medium mb-1">Contraseña</label>
              <input id="client-password" class="input w-full" type="password" bind:value={client.password} />
              {#if errors[`clients.${i}.password`]}
                <span class="text-red-500 text-xs">{errors[`clients.${i}.password`]}</span>
              {/if}
            </div>
          </div>
          {#if form.clients.length > 0}
            <div class="client">
              <button type="button" class="bg-white text-red-600 hover:bg-red-400 px-4 rounded transition" onclick={() => removeClient(i)}>Eliminar</button>
            </div>
            {/if}
        </div>
      {/each}
      
    <ActionButton action={addClient} >
      <button type="button" class="bg-white text-gray-600 hover:bg-gray-300 px-4 rounded transition disabled:cursor-not-allowed">Añadir cliente</button>
    </ActionButton>  

    <h2 class="text-2xl font-bold mb-4">Global</h2>
    <div class="mb-4">
      <label for="latency" class="block font-medium">Latencia (ms)</label>
      <input id="latency" class="input" type="number" min="0" bind:value={form.global.latency} />
      {#if errors['global.latency']}<span class="text-red-500 text-xs">{errors['global.latency']}</span>{/if}
    </div>
  
    <ActionButton successMessage={"guardado"} {mut} >
        <button disabled={mut.loading} class="bg-white text-gray-600 hover:bg-gray-300 px-4 rounded transition disabled:cursor-not-allowed">
            {mut.loading ? 'Guardando...' : 'Guardar configuración'}
        </button>
    </ActionButton>
    
  </form>
  
  <style>
    .clientparent:has(.client:hover) {
        background-color: #fca5a5; /* bg-red-300 en Tailwind */
    }

  </style>