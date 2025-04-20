<!-- src/lib/components/Menu.svelte -->
<script lang="ts">
    let open = false;
    function closeMenu() { open = false; }
  </script>
  
  <nav class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm z-20 relative">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-14 items-center">
        <!-- Logo o título -->
        <a href="/" class="text-xl font-bold text-orange-600">MyMusicApp</a>
        
        <!-- Menú horizontal en md+ -->
        <ul class="hidden md:flex space-x-6">
          <li><a href="/api/queue" class="hover:text-orange-600 font-medium transition-colors">Queue</a></li>
          <li><a href="/api/playlists" class="hover:text-orange-600 font-medium transition-colors">List Management</a></li>
          <li><a href="/api/library" class="hover:text-orange-600 font-medium transition-colors">Library</a></li>
        </ul>
  
        <!-- Botón hamburguesa en móvil -->
        <button class="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
          aria-label="Abrir menú"
          on:click={() => open = !open}>
          <svg class="w-7 h-7 text-orange-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </div>
  
    <!-- Menú desplegable en móvil -->
    {#if open}
      <ul class="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-4 py-2 space-y-2 animate-fade-in absolute w-full left-0">
        <li><a href="/api/queue" class="block py-2 font-medium hover:text-orange-600" on:click={closeMenu}>Queue</a></li>
        <li><a href="/api/playlists" class="block py-2 font-medium hover:text-orange-600" on:click={closeMenu}>List Management</a></li>
        <li><a href="/api/library" class="block py-2 font-medium hover:text-orange-600" on:click={closeMenu}>Library</a></li>
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
  