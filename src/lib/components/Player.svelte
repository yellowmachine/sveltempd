<script lang="ts">
    import Icon from '@iconify/svelte';
	import { Jumper } from 'svelte-loading-spinners';
	import { page } from '$app/state';
  	import { trpc } from '$lib/trpc/client';
	import PlayerButton from './PlayerButton.svelte';

	let { playing, volume }: {playing: boolean, volume: number | undefined} = $props();
	
    let loading = $state(false);
	let error = $state<string | null>(null);

	function play() { trpc(page).player.play.mutate(); }
	function pause() { trpc(page).player.pause.mutate(); }
	function next() { trpc(page).player.next.mutate(); }
	function previous() { trpc(page).player.prev.mutate(); }
	function volumeUp() { trpc(page).player.volume.mutate({ amount: 10 }); }
	function volumeDown() { trpc(page).player.volume.mutate({ amount: -10 }); }
	function mute() { trpc(page).player.mute.mutate(); }
	function unmute() { trpc(page).player.unmute.mutate(); }
	
</script>

<div class="flex items-center gap-4 border-2 rounded-md p-4 w-max">
	<PlayerButton
		onClick={previous}
		ariaLabel="Anterior"
		disabled={loading}>
		<Icon icon="mdi:skip-previous" width="32" height="32" />
	</PlayerButton>
	{#if playing}
	<PlayerButton
		onClick={pause}
		ariaLabel="Pausar"
		disabled={loading}>
		<Icon icon="mdi:pause" width="32" height="32" />
	</PlayerButton>
	{:else}
	<PlayerButton
		onClick={play}
		ariaLabel="Reproducir"
		disabled={loading}>
		<Icon icon="mdi:play" width="32" height="32" />
	</PlayerButton>
	{/if}
	<PlayerButton
		onClick={next}
		ariaLabel="Siguiente"
		disabled={loading}>
		<Icon icon="mdi:skip-next" width="32" height="32" />
	</PlayerButton>
	<PlayerButton
		onClick={volumeDown}
		ariaLabel="Bajar volumen"
		disabled={loading}>
		<Icon icon="mdi:volume-minus" width="32" height="32" />
	</PlayerButton>
	<PlayerButton
		onClick={volumeUp}
		ariaLabel="Subir volumen"
		disabled={loading}>
		<Icon icon="mdi:volume-plus" width="32" height="32" />
	</PlayerButton>
	{#if volume !== 0}
	<PlayerButton
		onClick={mute}
		ariaLabel="Mute"
		disabled={loading}>
		<Icon icon="mdi:volume-mute" width="32" height="32" />
	</PlayerButton>
	{:else}
	<PlayerButton
		onClick={unmute}
		ariaLabel="Deshacer mute"
		disabled={loading}>
		<Icon icon="mdi:volume-high" width="32" height="32" />
	</PlayerButton>
	{/if}
  </div>
  

{#if loading}
<Jumper size="60" color="#FF3E00" unit="px" duration="1s" />
{/if}

{#if error}
	<div class="error">{error}</div>
{/if}
