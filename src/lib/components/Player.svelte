<script lang="ts">
    import Icon from '@iconify/svelte';
	import { Jumper } from 'svelte-loading-spinners';
	import { page } from '$app/state';
  	import { trpc } from '$lib/trpc/client';
	import PlayerButton from './PlayerButton.svelte';
	import ProgressBar from './ProgressBar.svelte';
	import SongInfo from '$lib/components/SongInfo.svelte';
	import { getCurrentSongInfo } from '$lib/stores.svelte';

	let { isPlaying, volume, total, elapsed }: 
		{isPlaying: boolean, volume: number | undefined, elapsed?: number, total?: number} = $props();
	
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

	const width = '24'
	const height = '24'

	const currentSong = getCurrentSongInfo()
	
</script>

<div class="flex items-center gap-4 border-2 rounded-md p-4 w-full max-w-md bg-white text-orange-500 dark:bg-orange-500 dark:text-white">
	<PlayerButton
		onClick={previous}
		ariaLabel="Anterior"
		disabled={loading}>
		<Icon icon="mdi:skip-previous" {width} {height} />
	</PlayerButton>
	{#if isPlaying}
	<PlayerButton
		onClick={pause}
		ariaLabel="Pausar"
		disabled={loading}>
		<Icon icon="mdi:pause" {width} {height} />
	</PlayerButton>
	{:else}
	<PlayerButton
		onClick={play}
		ariaLabel="Reproducir"
		disabled={loading}>
		<Icon icon="mdi:play" {width} {height} />
	</PlayerButton>
	{/if}
	<PlayerButton
		onClick={next}
		ariaLabel="Siguiente"
		disabled={loading}>
		<Icon icon="mdi:skip-next" {width} {height} />
	</PlayerButton>
	<PlayerButton
		onClick={volumeDown}
		ariaLabel="Bajar volumen"
		disabled={loading}>
		<Icon icon="mdi:volume-minus" {width} {height} />
	</PlayerButton>
	<span class="text-2xl">{volume}</span>
	<PlayerButton
		onClick={volumeUp}
		ariaLabel="Subir volumen"
		disabled={loading}>
		<Icon icon="mdi:volume-plus" {width} {height} />
	</PlayerButton>
	{#if volume !== 0}
	<PlayerButton
		onClick={mute}
		ariaLabel="Mute"
		disabled={loading}>
		<Icon icon="mdi:volume-mute" {width} {height} />
	</PlayerButton>
	{:else}
	<PlayerButton
		onClick={unmute}
		ariaLabel="Deshacer mute"
		disabled={loading}>
		<Icon icon="mdi:volume-high" {width} {height} />
	</PlayerButton>
	{/if}
</div>
<ProgressBar {isPlaying} {total} {elapsed} />  
<SongInfo song={currentSong} />

{#if loading}
<Jumper size="60" color="#FF3E00" unit="px" duration="1s" />
{/if}

{#if error}
	<div class="error">{error}</div>
{/if}
