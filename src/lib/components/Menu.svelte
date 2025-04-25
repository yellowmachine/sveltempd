<script lang="ts">
    import { trpcSnapclient } from '../trpcClients';
	import IsPlaying from './IsPlaying.svelte';

    export let isPlaying: boolean;
    let open = false;

    function closeMenu() { open = false; }
</script>
  
  <nav class="w-max bg-white dark:bg-orange-900 border-b border-orange-200 dark:border-orange-800 z-20 relative">
    {#if isPlaying }
      <IsPlaying />
    {/if}
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-14 items-center">
        <!-- Logo o título -->
        <a href="/" class="text-xl font-bold text-orange-600 mr-4">MyMusicApp</a>
        
        <!-- Menú horizontal en md+ -->
        <ul class="hidden md:flex space-x-6 border border-orange-400 rounded px-2 py-1">
          <li><a href="/queue" class="hover:text-orange-600 font-medium transition-colors">Cola</a></li>
          <li><a href="/playlists" class="hover:text-orange-600 font-medium transition-colors">Listas</a></li>
          <li><a href="/library" class="hover:text-orange-600 font-medium transition-colors">Biblioteca</a></li>
          <li><a href="/admin" class="hover:text-orange-600 font-medium transition-colors">Admin</a></li>
          
          <button onclick={trpcSnapclient.restart}>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="[http://www.w3.org/2000/svg">](http://www.w3.org/2000/svg">)
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
          </button>
          
        </ul>
  
        <!-- Botón hamburguesa en móvil -->
        <button class="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
          aria-label="Abrir menú"
          onclick={() => open = !open}>
          <svg class="w-7 h-7 text-orange-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </div>
  
    <!-- Menú desplegable en móvil -->
    {#if open}
      <ul class="md:hidden bg-white dark:bg-orange-900 border-t border-orange-200 dark:border-orange-800 px-4 py-2 space-y-2 animate-fade-in absolute left-0">
        <li><a href="/queue" class="block py-2 font-medium hover:text-orange-600" onclick={closeMenu}>Queue</a></li>
        <li><a href="/playlists" class="block py-2 font-medium hover:text-orange-600" onclick={closeMenu}>List Management</a></li>
        <li><a href="/library" class="block py-2 font-medium hover:text-orange-600" onclick={closeMenu}>Library</a></li>
        <li><a href="/admin" class="block py-2 font-medium hover:text-orange-600" onclick={closeMenu}>Admin</a></li>
      
      </ul>
    {/if}
  </nav>
  
  <style>
    @keyframes fade-in {
      from { opacity: 0; transform: translateY(-10px);}
      to { opacity: 1; transform: translateY(0);}
    }
    .animate-fade-in { animation: fade-in 0.2s ease; }
  </style>
  