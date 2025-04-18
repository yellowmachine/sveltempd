<script lang="ts">
	import { onDestroy } from 'svelte';
	import { mpdStatus } from '$lib/stores';
	import type { MPDStatus } from '$lib/types/index';
	import Player from '$lib/components/Player.svelte';

	let { children } = $props();

	let evtSource: EventSource | null = null;
	let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
	let reconnectDelay = 2000; // ms, puedes hacerla exponencial si quieres

	function connectEventSource() {
		if (evtSource) {
			evtSource.close();
		}
		evtSource = new EventSource('/api/events');

		// Escuchar eventos de tipo 'player'
		evtSource.addEventListener("player", (event) => {
			const data: MPDStatus = JSON.parse((event as MessageEvent).data);

			if (data.state) {
				mpdStatus.update(data); 
			}
		});

		// Escuchar eventos de tipo 'playlist'
		evtSource.addEventListener("playlist", (event) => {
			const playlistData = JSON.parse(event.data);
			console.log("Playlist recibida:", playlistData);
			// ...actualiza la UI o el estado de la app
		});

		// (Opcional) Escuchar errores de conexión
		evtSource.addEventListener("error", (event) => {
			console.error("Error SSE:", event);
		});

		evtSource.onerror = (err) => {
			console.warn('SSE error, intentando reconectar...', err);
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

	connectEventSource();

	onDestroy(() => {
		if (evtSource) evtSource.close();
		if (reconnectTimeout) clearTimeout(reconnectTimeout);
	});
</script>

<Player />
{@render children()}
