<script lang="ts">
	import Queue from "$lib/components/Queue.svelte";
    import { mpdStatus } from "$lib/stores.svelte";
    import { queue, currentSong } from "$lib/stores.svelte";
    import type { PageProps } from './$types';
    import { trpcPlayer } from '$lib/trpcClients';
    import Player from '$lib/components/Player.svelte';
    import { getCurrentSongInfo } from '$lib/stores.svelte';

    let { data }: PageProps = $props();	

    const currentSongInfo = getCurrentSongInfo()

    if(data.player)
		mpdStatus.update(data.player);

	queue.update(data.queue);
	currentSong.update(data.queue.currentSong)
    
</script>

<Player 
	currentSong={currentSongInfo}
	total={mpdStatus.value?.time?.total} 
	elapsed={mpdStatus.value?.time?.elapsed} 
	volume={mpdStatus.value?.volume || 0} 
	playStatus={ mpdStatus.value?.state }
	{trpcPlayer}
/>
<Queue 
    songs={ queue.value } 
    currentSong={ 
      {uri: currentSong.value, elapsed: mpdStatus.value?.time?.elapsed, total: mpdStatus.value?.time?.total }
    } 
/>