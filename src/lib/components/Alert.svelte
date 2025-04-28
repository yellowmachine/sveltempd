<script lang="ts">
    export let message: string | null = null;
    export let clear: () => void = () => {};
</script>

{#if message}
  <div class="transition duration-300 opacity-0" class:opacity-100={message}>
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
      {message}
      <button class="cursor-pointer mr-4 absolute top-1/2 right-0 p-2 text-red-700 hover:text-red-900 transform -translate-y-1/2" onclick={clear}>
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="[http://www.w3.org/2000/svg">](http://www.w3.org/2000/svg">)
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
  </div>
{/if}