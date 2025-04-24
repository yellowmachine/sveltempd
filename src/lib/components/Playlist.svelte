<script lang="ts"> 
    export let playlists: string[];
    
  </script>
  
{#each playlists as playlist} 
  <h3>{JSON.stringify(playlist)}</h3>
{/each}  