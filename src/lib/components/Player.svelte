<script lang="ts">
    import Icon from '@iconify/svelte';
	import { Jumper } from 'svelte-loading-spinners';
	import { page } from '$app/state';
  	import { trpc } from '$lib/trpc/client';

	let { playing, volume }: {playing: boolean, volume: number | undefined} = $props();
	
    let loading = $state(false);
	let error = $state<string | null>(null);

	function play() { trpc(page).play.mutate(); }
	function pause() { trpc(page).pause.mutate(); }
	function next() { trpc(page).next.mutate(); }
	function previous() { trpc(page).prev.mutate(); }
	function volumeUp() { trpc(page).volume.mutate({ amount: 10 }); }
	function volumeDown() { trpc(page).volume.mutate({ amount: -10 }); }
	
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
