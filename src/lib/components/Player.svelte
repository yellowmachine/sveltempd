<script lang="ts">
    import Icon from '@iconify/svelte';
	import { Jumper } from 'svelte-loading-spinners';
	import { page } from '$app/state';
  	import { trpc } from '$lib/trpc/client';
	import PlayerButton from './PlayerButton.svelte';
	import ProgressBar from './ProgressBar.svelte';
	import SongInfo from '$lib/components/SongInfo.svelte';
	import { getCurrentSongInfo } from '$lib/stores.svelte';

	let { playStatus, volume, total, elapsed }: 
		{ playStatus: 'stop' | 'play' | 'pause' | undefined, volume: number, elapsed?: number, total?: number} = $props();
	
    let loading = $state(false);
	let error = $state<string | null>(null);

	function play() { trpc(page).player.play.mutate(); }
	function pause() { trpc(page).player.pause.mutate(); }
	function next() { trpc(page).player.next.mutate(); }
	function previous() { trpc(page).player.prev.mutate(); }
	function volumeUp() { trpc(page).player.volumeInc.mutate({ amount: 10 }); }
	function volumeDown() { trpc(page).player.volumeInc.mutate({ amount: -10 }); }
	function mute() { trpc(page).player.mute.mutate(); }
	function unmute() { trpc(page).player.unmute.mutate(); }

	const width = '32'
	const height = '32'

	const currentSong = getCurrentSongInfo()

	let showVolumeControl = $state(false);

	async function handleVolumeClick(event: TouchEvent | MouseEvent) {
		if (event instanceof TouchEvent && event.type === 'touchmove') {
			const rect = (event.target as HTMLDivElement).getBoundingClientRect();
			const height = rect.height;
			const touchY = event.touches[0].clientY - rect.top;
			const newVolume = touchY / height;
			volume = Math.max(0, Math.min(1, newVolume));		
		} else if (event instanceof TouchEvent && event.type === 'touchend') {
			await trpc(page).player.volume.mutate({ amount: volume });
		}
		else if (event instanceof MouseEvent && event.type === 'click') {
			const rect = (event.target as HTMLDivElement).getBoundingClientRect();
			const height = rect.height;
			const clickY = event.clientY - rect.top;
			const newVolume = clickY / height;
			volume = Math.max(0, Math.min(1, newVolume));
			await trpc(page).player.volume.mutate({ amount: volume });
		} else if(event instanceof MouseEvent && event.type === 'mousemove') {
			const rect = (event.target as HTMLDivElement).getBoundingClientRect();
			const height = rect.height;
			const clickY = event.clientY - rect.top;
			const newVolume = clickY / height;
			volume = Math.max(0, Math.min(1, newVolume));
		} else if(event instanceof MouseEvent && event.type === 'mouseout') {
			await trpc(page).player.volume.mutate({ amount: volume });
		}
  	}

	function handleShowVolumeControl() {
		showVolumeControl = true;
	}

	function handleHideVolumeControl() {
		showVolumeControl = false;
	}
	
</script>

{#if playStatus === 'play' || playStatus === 'pause'}
<div class="flex items-center gap-4 border-2 rounded-md p-4 w-max bg-white text-orange-500 dark:bg-orange-500 dark:text-white">
	<PlayerButton
		onClick={previous}
		ariaLabel="Anterior"
		disabled={loading}>
		<Icon icon="mdi:skip-previous" {width} {height} />
	</PlayerButton>
	{#if playStatus === 'pause'}
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
	<span
		class="text-2xl relative"
		role="button" 
		tabindex="0"
		onmouseover={() => showVolumeControl = true}
		onfocus={() => showVolumeControl = true}
		onmouseout={() => showVolumeControl = false}
		onblur={() => showVolumeControl = false}
		ontouchstart={handleShowVolumeControl}
		ontouchend={handleHideVolumeControl}
		>
		{volume}
		{#if showVolumeControl}
			<div class="absolute bg-gray-200 rounded-lg p-2 shadow-md" style={`top: 100%; left: 50%; transform: translateX(-50%)`}>
			<div class="flex flex-col items-center">
				<button
					aria-label="Cambiar volumen"
					class="w-2 h-20 bg-gray-400 rounded-lg relative"
					onclick={handleVolumeClick}
					>
					<div class="absolute w-2 h-2 bg-gray-500 rounded-full" style={`top: ${volume * 100}%`}></div>
				</button>
			</div>
			</div>
		{/if}
		</span>
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
<ProgressBar isPlaying={playStatus === 'play'} {total} {elapsed} />  
<SongInfo song={currentSong} />

{#if loading}
<Jumper size="60" color="#FF3E00" unit="px" duration="1s" />
{/if}

{#if error}
	<div class="error">{error}</div>
{/if}
{/if}