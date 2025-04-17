<script lang="ts">
	import { onDestroy } from 'svelte';
	import { mpdState } from '$lib/stores';

	let { children } = $props();

	let evtSource: EventSource | null = null;
	let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
	let reconnectDelay = 2000; // ms, puedes hacerla exponencial si quieres

	function connectEventSource() {
		if (evtSource) {
			evtSource.close();
		}
		evtSource = new EventSource('/api/events');

		evtSource.addEventListener('mpd-event', (e) => {
			const data = JSON.parse((e as MessageEvent).data);

			// ACTUALIZA EL STORE GLOBAL CON EL NUEVO ESTADO
			if (data.state) {
				mpdState.update(data.state); // <-- Aquí actualizas el store
			}
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

{@render children()}
