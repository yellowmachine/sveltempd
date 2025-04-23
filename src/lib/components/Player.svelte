<script lang="ts">
    import Icon from '@iconify/svelte';
	import { Jumper } from 'svelte-loading-spinners';
	import PlayerButton from './PlayerButton.svelte';
	import ProgressBar from './ProgressBar.svelte';
	import SongInfo from '$lib/components/SongInfo.svelte';
	import type { TRPCPlayer } from './trpcClients';
	import type { Song as TSong } from '$lib/messages';

	let { playStatus, volume, total, elapsed, trpcPlayer, currentSong }: 
		{ playStatus: 'stop' | 'play' | 'pause' | undefined, 
		volume: number, 
		elapsed?: number, 
		total?: number,
		trpcPlayer: TRPCPlayer,
		currentSong: TSong | null
	} = $props();
	
    let loading = $state(false);
	let error = $state<string | null>(null);
	
	function setVolume(volume: number) { trpcPlayer.volume(volume); }

	const width = '32'
	const height = '32'

	let showVolumeControl = $state(false);

	function correctVolume(amount: number) {
		return Math.round(100*Math.max(0, Math.min(100, amount)))
	}

	function getY(event: TouchEvent | MouseEvent) {
		if (event instanceof TouchEvent)	
			return event.touches[0].clientY;
		else
			return event.clientY;
	}

	async function handleVolumeClickOuter(event: MouseEvent) {
		const y = getY(event);
		const rect = (event.currentTarget as HTMLElement).previousElementSibling?.getBoundingClientRect();
		if(rect){
			volume = correctVolume((rect.bottom - y) / rect.height);
			await setVolume(volume);
		}	
	}

	async function handleVolumeClick(event: TouchEvent | MouseEvent) {
		const y = getY(event);
		const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
		if(rect){
			volume = correctVolume((rect.bottom - y) / rect.height);
			await setVolume(volume);
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
		onClick={() => trpcPlayer.volumeInc(-10)}
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
		onmouseleave={() => showVolumeControl = false}
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
					</button>
					<button
					 	aria-label="Cambiar volumen"
					  	class="absolute w-2 bg-gray-600 rounded-lg"
					  	onclick={handleVolumeClickOuter}
					  	style={`height: ${volume}%; bottom: 0`}
					></button>
				</div>
			</div>
		{/if}
		</span>
	<PlayerButton
		onClick={() => trpcPlayer.volumeInc(10)}
		ariaLabel="Subir volumen"
		disabled={loading}>
		<Icon icon="mdi:volume-plus" {width} {height} />
	</PlayerButton>
	{#if volume !== 0}
	<PlayerButton
		onClick={() => trpcPlayer.mute()}
		ariaLabel="Mute"
		disabled={loading}>
		<Icon icon="mdi:volume-mute" {width} {height} />
	</PlayerButton>
	{:else}
	<PlayerButton
		onClick={() => trpcPlayer.unmute()}
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