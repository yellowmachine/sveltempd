<script lang="ts">
    import Icon from '@iconify/svelte';
	import { Jumper } from 'svelte-loading-spinners';
	import PlayerButton from './PlayerButton.svelte';
	import ProgressBar from './ProgressBar.svelte';
	import SongInfo from '$lib/components/SongInfo.svelte';
	import type { TRPCPlayer } from '../trpcClients';
	import type { Song as TSong } from '$lib/messages';
	import VolumeBar from './VolumeBar.svelte';
	import Volume from './Volume.svelte';


	let { playStatus, volume, total, elapsed, trpcPlayer, currentSong }: 
		{ playStatus: 'stop' | 'play' | 'pause' | undefined, 
		volume: number, 
		elapsed?: number, 
		total?: number,
		trpcPlayer: TRPCPlayer,
		currentSong: TSong | null
	} = $props();
	
	const width = '32'
	const height = '32'
    
	let loading = $state(false);
	let error = $state<string | null>(null);
	let lastVolume = volume;
	let showVolumeControl = $state(false);

	function setVolume(volume: number) { trpcPlayer.volume(volume); }

	$effect(() => {
		lastVolume = volume;
		setVolume(volume);
	})
	
</script>

{#if playStatus === 'play' || playStatus === 'pause'}
<div class="flex items-center gap-4 border-2 rounded-md p-4 w-max bg-white text-orange-500 dark:bg-orange-500 dark:text-white">
	<PlayerButton
		onClick={() => trpcPlayer.prev()}
		ariaLabel="Anterior"
		disabled={loading}>
		<Icon icon="mdi:skip-previous" {width} {height} />
	</PlayerButton>
	{#if playStatus === 'pause'}
	<PlayerButton
		onClick={() => trpcPlayer.pause()}
		ariaLabel="Pausar"
		disabled={loading}>
		<Icon icon="mdi:pause" {width} {height} />
	</PlayerButton>
	{:else}
	<PlayerButton
		onClick={() => trpcPlayer.play()}
		ariaLabel="Reproducir"
		disabled={loading}>
		<Icon icon="mdi:play" {width} {height} />
	</PlayerButton>
	{/if}
	<PlayerButton
		onClick={() => trpcPlayer.next()}
		ariaLabel="Siguiente"
		disabled={loading}>
		<Icon icon="mdi:skip-next" {width} {height} />
	</PlayerButton>
	<PlayerButton
		onClick={() => volume -= 10}
		ariaLabel="Bajar volumen"
		disabled={loading}>
		<Icon icon="mdi:volume-minus" {width} {height} />
	</PlayerButton>
	<Volume bind:volume />
	<PlayerButton
		onClick={() => volume += 10}
		ariaLabel="Subir volumen"
		disabled={loading}>
		<Icon icon="mdi:volume-plus" {width} {height} />
	</PlayerButton>
	{#if volume !== 0}
	<PlayerButton
		onClick={() => volume = 0}
		ariaLabel="Mute"
		disabled={loading}>
		<Icon icon="mdi:volume-mute" {width} {height} />
	</PlayerButton>
	{:else}
	<PlayerButton
		onClick={() => volume = lastVolume}
		ariaLabel="Deshacer mute"
		disabled={loading}>
		<Icon icon="mdi:volume-high" {width} {height} />
	</PlayerButton>
	{/if}
</div>
<ProgressBar isPlaying={playStatus === 'play'} {total} {elapsed} />  
<SongInfo song={currentSong} />

{#if loading}
<Jumper size="60" color="#FF3E00" unit="px" duration="1s" />
{/if}

{#if error}
	<div class="error">{error}</div>
{/if}
{/if}