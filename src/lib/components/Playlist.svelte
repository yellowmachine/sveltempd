<script lang="ts">
  import { trpcQueue } from "./trpcClients";

  export let playlists: {name: string, description: string}[];
    
</script>
  
{#each playlists as playlist} 
  <h3 class="font-bold">{JSON.stringify(playlist)}</h3>
  <button 
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" 
      onclick={() => trpcQueue.load(playlist.name)}>
    Cargar
  </button>
{/each}  