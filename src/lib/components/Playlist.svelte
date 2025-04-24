<script lang="ts">
  import { trpcQueue } from "./trpcClients";

  export let playlist: {name: string, songs: {name: string, file: string, time: number, duration: number}[]};
    
</script>
  
<button 
  class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200 ease-in-out"
  onclick={() => trpcQueue.load(playlist.name)}>
  Cargar
</button>

<ul class="list-none p-0 m-0">
  {#each playlist.songs as song} 
    <li class="py-2">
      <h3 class="font-bold text-lg">{song.name}</h3>
    </li>
  {/each}  
</ul>