<script lang="ts">  
    let { data } = $props();
</script>

{#each data.playlists as playlist} 
  <a href="/playlists/{playlist.name}" class="text-lg font-bold text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out">
    <h3 class="">{playlist.name}</h3>
  </a>
{/each}  