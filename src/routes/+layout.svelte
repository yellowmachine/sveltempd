<script lang="ts">
	import { onDestroy } from 'svelte';
	import '../app.css';

	let { children } = $props();

	let events = [];

  	const evtSource = new EventSource('/api/events');

	evtSource.addEventListener('mpd-event', (e) => {
		const data = JSON.parse(e.data);
		events = [...events, data];
		// Aquí actualizas tu estado, por ejemplo, refrescar UI
	});

  	onDestroy(() => {
    	evtSource.close();
  	});
</script>

{@render children()}
