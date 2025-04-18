<script lang="ts">
    import Icon from '@iconify/svelte';
	import { Jumper } from 'svelte-loading-spinners';

	let { playing, volume }: {playing: boolean, volume: number | undefined} = $props();
	
    let loading = $state(false);
	let error = $state<string | null>(null);

	async function sendCommand(command: string) {
		loading = true;
		error = null;
		try {
			//const res = 
			await fetch('/api/command', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ command })
			});
			//if (!res.ok) {
			//	const { error: msg } = await res.json();
			//	throw new Error(msg || 'Error en el servidor');
			//}
		} catch (e) {
			error = e instanceof Error ? e.message : 'Error desconocido';
		} finally {
			loading = false;
		}
	}

	function play() { sendCommand('play'); }
	function pause() { sendCommand('pause'); }
	function next() { sendCommand('next'); }
	function previous() { sendCommand('previous'); }
	function volumeUp() { sendCommand('volume_up'); }
	function volumeDown() { sendCommand('volume_down'); }
</script>

<div class="flex items-center gap-4 border-2 rounded-md p-4 w-max">
	<button onclick={previous} aria-label="Anterior" disabled={loading} class="h-16 flex items-center justify-center">
	  <Icon icon="mdi:skip-previous" width="32" height="32" />
	</button>
	{#if playing}
	  <button onclick={pause} aria-label="Pausar" disabled={loading} class="h-16 flex items-center justify-center">
		<Icon icon="mdi:pause" width="64" height="64" />
	  </button>
	{:else}
	  <button onclick={play} aria-label="Reproducir" disabled={loading} class="h-16 flex items-center justify-center">
		<Icon icon="mdi:play" width="64" height="64" />
	  </button>
	{/if}
	<button onclick={next} aria-label="Siguiente" disabled={loading} class="h-16 flex items-center justify-center">
	  <Icon icon="mdi:skip-next" width="32" height="32" />
	</button>
	<button onclick={volumeDown} aria-label="Bajar volumen" disabled={loading} class="h-16 flex items-center justify-center">
	  <Icon icon="mdi:volume-minus" width="32" height="32" />
	</button>
	<span class="mx-2">{volume}</span>
	<button onclick={volumeUp} aria-label="Subir volumen" disabled={loading} class="h-16 flex items-center justify-center">
	  <Icon icon="mdi:volume-plus" width="32" height="32" />
	</button>
  </div>
  

{#if loading}
<Jumper size="60" color="#FF3E00" unit="px" duration="1s" />
{/if}

{#if error}
	<div class="error">{error}</div>
{/if}
