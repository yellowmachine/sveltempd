<script lang="ts">
	import '../app.css';
	import { onDestroy, onMount } from 'svelte';
	import { currentSong, mpdStatus, queue } from '$lib/stores.svelte';
	import type { MPDStatus } from '$lib/types/index';
	import Menu from '$lib/components/Menu.svelte';
	import { m } from '$lib/paraglide/messages';
	import type { LayoutProps } from './$types';
	import type { QueueMsg, Song } from '$lib/messages';
	import Alert from '$lib/components/Alert.svelte';
	import { trpcError } from '$lib/stores.svelte';
	import Setup from '$lib/components/Setup.svelte';

	
	let { data, children }: LayoutProps = $props();	

	let evtSource: EventSource | null = null;
	let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
	let reconnectDelay = 2000; 

	onMount(() => {
		connectEventSource();
	});

	$effect(() => {
		if (mpdStatus.value?.state === 'play') {
			currentSong.start();
		} else if (mpdStatus.value?.state === 'pause') {
			currentSong.pause();
		} else {
			currentSong.stop();
		}
	});

	function connectEventSource() {
		console.log("Conectando a EventSource...");
		if (evtSource) {
			evtSource.close();
		}
		evtSource = new EventSource('/api/events');

		evtSource.addEventListener("player", (event) => {
			const data: {player: MPDStatus, queue: QueueMsg} = JSON.parse((event as MessageEvent).data);

			mpdStatus.update(data.player);
			queue.update(data.queue);
			currentSong.update({uri: data.queue.currentSong})
		});

		evtSource.addEventListener("mixer", (event) => {
			//const data: MPDStatus = JSON.parse((event as MessageEvent).data);
			//console.log('---', data)
			//mpdStatus.update(data); 
		});

		evtSource.addEventListener("playlist", (event) => {
			const data: {queue: Song[]} = JSON.parse((event as MessageEvent).data);
			queue.update(data);
		});


		evtSource.addEventListener("error", (event) => {
			console.error("Error SSE:", event);
		});

		evtSource.onerror = (err) => {
			console.warn(m.ssereconnecting(), err);
			evtSource?.close();
			evtSource = null;

			// Evita múltiples timeouts
			if (reconnectTimeout) clearTimeout(reconnectTimeout);

			reconnectTimeout = setTimeout(() => {
				connectEventSource();
			}, reconnectDelay);

			// Opcional: puedes aumentar reconnectDelay aquí para reconexión exponencial
			// reconnectDelay = Math.min(reconnectDelay * 2, 30000);
		};
	}

	onDestroy(() => {
		if (evtSource) evtSource.close();
		if (reconnectTimeout) clearTimeout(reconnectTimeout);
	});
</script>

{#if !data.setupDone}
  <Setup />
{:else}
<Alert message={trpcError.value} clear={trpcError.clear} />
<Menu isPlaying={mpdStatus.value?.state === 'play'} />

{@render children()}
{/if}
