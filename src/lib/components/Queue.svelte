<script lang="ts">
  	import SongList from './SongList.svelte';
    import type { Song as TSong } from '$lib/messages';
    import { trpcQueue } from './trpcClients'
    
    export let songs: TSong[];
    export let currentSongId: number | undefined;
    export let elapsed: number | undefined;
    export let total: number | undefined;

    async function clear() {
        await trpcQueue.clear();
    }
</script>

<div class="queue">
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
      <SongList {trpcQueue} {songs} {currentSongId} {elapsed} {total} />
    </div>
</div>
  