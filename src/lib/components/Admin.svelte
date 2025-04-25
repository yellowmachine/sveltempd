<script lang="ts">
    import { settingsSchema, type Settings } from "$lib/schemas";
	import { createMutation } from "$lib/stores.svelte";
	import { trpcAdmin } from "$lib/trpcClients";
	import ActionButton from "./ActionButton.svelte";

    let {data}: {data?: Settings} = $props();

    const m = createMutation(submit);

    let form: Settings = $state(data || { global: { latency: 100 }, 
                                          server: { ip: '', username: '', password: '' }, 
                                          clients: [] 
                                        });
  
    let errors: Record<string, string> = $state({});
    let success = $state(false);
    let loading = $state(false);
    let isFormValid = $state(false);

    $effect(() => {
      isFormValid = validate();
    })
  
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
  
    async function submit() {
        //event.preventDefault();
        if (!validate()) return;
        loading = true;
        try {
            form = await trpcAdmin.save(form)
            success = true;
        } catch (e) {
            success = false;
            // Manejo de error real aquí
        } finally {
            loading = false;
        }
    }
  
    function addClient() {
      form.clients.push({ ip: '', username: '', password: '' });
    }
    function removeClient(index: number) {
      form.clients.splice(index, 1);
    }
  </script>
  
  <form class="max-w-xl mx-auto p-6 bg-white shadow rounded space-y-6" onsubmit={submit}>
    <h2 class="text-2xl font-bold mb-4">Configuración del Servidor</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="p-2">
          <label class="block font-medium mb-1">IP</label>
          <input class="input w-full" bind:value={form.server.ip} />
          {#if errors['server.ip']}<span class="text-red-500 text-xs">{errors['server.ip']}</span>{/if}
        </div>
        <div class="p-2">
          <label class="block font-medium mb-1">Usuario</label>
          <input class="input w-full" bind:value={form.server.username} />
          {#if errors['server.username']}<span class="text-red-500 text-xs">{errors['server.username']}</span>{/if}
        </div>
        <div class="p-2">
          <label class="block font-medium mb-1">Contraseña</label>
          <input class="input w-full" type="password" bind:value={form.server.password} />
          {#if errors['server.password']}<span class="text-red-500 text-xs">{errors['server.password']}</span>{/if}
        </div>
      </div>
      
  
      <h2 class="text-2xl font-bold mb-4">Clientes</h2>
      {#each form.clients as client, i (i)}
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
          <div class="p-2">
            <label class="block font-medium mb-1">IP</label>
            <input class="input w-full" bind:value={client.ip} />
            {#if errors[`clients.${i}.ip`]}
              <span class="text-red-500 text-xs">{errors[`clients.${i}.ip`]}</span>
            {/if}
          </div>
          <div class="p-2">
            <label class="block font-medium mb-1">Usuario</label>
            <input class="input w-full" bind:value={client.username} />
            {#if errors[`clients.${i}.username`]}
              <span class="text-red-500 text-xs">{errors[`clients.${i}.username`]}</span>
            {/if}
          </div>
          <div class="p-2 flex items-end space-x-2">
            <div class="flex-1">
              <label class="block font-medium mb-1">Contraseña</label>
              <input class="input w-full" type="password" bind:value={client.password} />
              {#if errors[`clients.${i}.password`]}
                <span class="text-red-500 text-xs">{errors[`clients.${i}.password`]}</span>
              {/if}
            </div>
            {#if form.clients.length > 1}
              <button type="button" class="btn bg-red-500 text-white h-10" onclick={() => removeClient(i)}>-</button>
            {/if}
          </div>
        </div>
      {/each}
      
    {#if isFormValid}
        <button type="button" class="btn bg-blue-500 text-white" onclick={addClient}>Añadir cliente</button>
    {/if}

    <h2 class="text-2xl font-bold mb-4">Global</h2>
    <div class="mb-4">
      <label class="block font-medium">Latencia (ms)</label>
      <input class="input" type="number" min="0" bind:value={form.global.latency} />
      {#if errors['global.latency']}<span class="text-red-500 text-xs">{errors['global.latency']}</span>{/if}
    </div>
  
    <ActionButton action={m.mutate} successMessage={"guardado"} {m} disabled={m.loading || !isFormValid}>
        <div class="p-4 bg-gray-600 text-white disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed">
            {loading ? 'Guardando...' : 'Guardar configuración'}
        </div>
    </ActionButton>
    
    {#if success}
      <div class="text-green-600 mt-2">¡Configuración guardada correctamente!</div>
    {/if}
  </form>
  
  