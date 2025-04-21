<script lang="ts">
	import '../app.css';
	import { onDestroy, onMount } from 'svelte';
	import { mpdStatus, playlist, queue } from '$lib/stores.svelte';
	import type { MPDStatus } from '$lib/types/index';
	import Player from '$lib/components/Player.svelte';
	import Menu from '$lib/components/Menu.svelte';
	import { m } from '$lib/paraglide/messages';
	import type { LayoutProps } from './$types';
	
	let { data, children }: LayoutProps = $props();	

	if(data.player)
		mpdStatus.update(data.player);

	queue.update(data.queue);
	//playlist.update(data.playlist);

	let evtSource: EventSource | null = null;
	let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
	let reconnectDelay = 2000; 

	onMount(() => {
		connectEventSource();
	});

	function connectEventSource() {
		console.log("Conectando a EventSource...");
		if (evtSource) {
			evtSource.close();
		}
		evtSource = new EventSource('/api/events');

		evtSource.addEventListener("player", (event) => {
			const data: {player: MPDStatus, queue: Array<{artist: string, title: string}>} = JSON.parse((event as MessageEvent).data);

			mpdStatus.update(data.player);
			queue.update(data.queue);
		});

		evtSource.addEventListener("mixer", (event) => {
			const data: MPDStatus = JSON.parse((event as MessageEvent).data);
			//if (data.state) {
			mpdStatus.update(data); 
			//}
		});

		evtSource.addEventListener("playlist", (event) => {
			const playlistData = JSON.parse(event.data);
			playlist.update(playlistData);
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

<Menu isPlaying={mpdStatus.value?.state === 'play'} />
<Player total={mpdStatus.value?.time.total} elapsed={mpdStatus.value?.time.elapsed} volume={mpdStatus.value?.volume} isPlaying={ mpdStatus.value?.state === 'play' }/>

{@render children()}
