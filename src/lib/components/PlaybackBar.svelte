<script lang="ts">
    import { mpdState } from "$lib/stores";
	
    let loading = $state(false);
	let error = $state<string | null>(null);

	async function sendCommand(command: string) {
		loading = true;
		error = null;
		try {
			const res = await fetch('/api/command', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ command })
			});
			if (!res.ok) {
				const { error: msg } = await res.json();
				throw new Error(msg || 'Error en el servidor');
			}
		} catch (e) {
			error = e instanceof Error ? e.message : 'Error desconocido';
		} finally {
			loading = false;
		}
	}

	function play() { sendCommand('play'); }
	function pause() { sendCommand('pause'); }
	function next() { sendCommand('next'); }
	function previous() { sendCommand('previous'); }
	function volumeUp() { sendCommand('volume_up'); }
	function volumeDown() { sendCommand('volume_down'); }
</script>

<style>
	.playback-bar {
		display: flex;
		gap: 1rem;
		align-items: center;
		justify-content: center;
		margin: 1rem 0;
	}
	button {
		font-size: 1.5rem;
		padding: 0.5rem 1rem;
		cursor: pointer;
	}
	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	.error {
		color: red;
		margin-top: 0.5rem;
	}
</style>

<div class="playback-bar">
	<button onclick={previous} aria-label="Anterior" disabled={loading}>⏮️</button>
	<button onclick={play} aria-label="Play" disabled={loading}>▶️</button>
	<button onclick={pause} aria-label="Pause" disabled={loading}>⏸️</button>
	<button onclick={next} aria-label="Siguiente" disabled={loading}>⏭️</button>
	<button onclick={volumeDown} aria-label="Bajar volumen" disabled={loading}>🔉</button>
	<span>Volumen: {mpdState.value?.volume}</span>
    <button onclick={volumeUp} aria-label="Subir volumen" disabled={loading}>🔊</button>
</div>

{#if loading}
	<div>Cargando…</div>
{/if}
{#if error}
	<div class="error">{error}</div>
{/if}
