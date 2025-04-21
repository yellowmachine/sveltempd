<script lang="ts">
  	import { trpc } from '$lib/trpc/client';
    import { page } from '$app/state';
    import SongList from './SongList.svelte';
    
    export let songs: any[];
    export let currentSongId: number | undefined;
    export let elapsed: number | undefined;

    async function clear() {
        await trpc(page).queue.clear.mutate();
    }

</script>

<div class="queue">
    <h2>Queue</h2>
    <button
      onclick={clear}
      class="px-5 py-2.5 rounded-md font-semibold text-white bg-gradient-to-r from-orange-500 via-orange-600 to-red-600
            hover:from-red-500 hover:via-orange-600 hover:to-orange-500
            focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2
            transition-colors duration-200 shadow hover:shadow-lg"
    >
        Clear Queue
  </button>

    <div class="queue-content">
      <SongList {songs} {currentSongId} {elapsed} />
    </div>
</div>
  