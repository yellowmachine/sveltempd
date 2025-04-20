<script lang="ts">
	import '../app.css';
	import { onDestroy, onMount } from 'svelte';
	import { mpdStatus, getCurrentSong, playlist } from '$lib/stores.svelte';
	import type { MPDStatus } from '$lib/types/index';
	import Player from '$lib/components/Player.svelte';
	import SongInfo from '$lib/components/SongInfo.svelte';
	import { m } from '$lib/paraglide/messages';
	import type { LayoutProps } from './$types';
	
	let { data, children }: LayoutProps = $props();	

	mpdStatus.update(data.status);
	playlist.update(data.playlist);

	let evtSource: EventSource | null = null;
	let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
	let reconnectDelay = 2000; 

	const currentSong = getCurrentSong();

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
			const data: MPDStatus = JSON.parse((event as MessageEvent).data);

			if (data.state) {
				mpdStatus.update(data); 
			}
		});

		evtSource.addEventListener("mixer", (event) => {
			const data: MPDStatus = JSON.parse((event as MessageEvent).data);

			if (data.state) {
				mpdStatus.update(data); 
			}
		});

		evtSource.addEventListener("playlist", (event) => {
			const playlistData = JSON.parse(event.data);
			console.log("Playlist recibida:", playlistData);
			// ...actualiza la UI o el estado de la app
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

<Player total={mpdStatus.value?.time.total} elapsed={mpdStatus.value?.time.elapsed} volume={mpdStatus.value?.volume} isPlaying={ mpdStatus.value?.state === 'play' }/>
<!-- <SongInfo song={currentSong} /> -->
{@render children()}
