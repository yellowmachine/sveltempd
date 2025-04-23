<script lang="ts">
    export let options: { title: string; description: string; value: string }[] = [];
    export let selected: string = '';
    export let onSelect: (value: string) => void = () => {};

    let open = false;
  
    function selectOption(value: string) {
      onSelect(value);
      selected = value
      open = false;
    }
  
    function getSelectedOption() {
      return options.find((o) => o.value === selected);
    }
  </script>
  
  <div class="relative w-72">
    <button
      type="button"
      class="w-full bg-white border border-gray-300 rounded-lg shadow-sm px-4 py-3 text-left cursor-pointer flex justify-between items-center hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
      onclick={() => (open = !open)}
    >
      <div>
        <div class="font-bold">
          {getSelectedOption()?.title ?? 'Select an option'}
        </div>
        <div class="text-gray-500 text-sm">
          {getSelectedOption()?.description ?? ''}
        </div>
      </div>
      <svg class="w-5 h-5 ml-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  
    {#if open}
      <ul
        class="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto"
        tabindex="-1"
      >
        {#each options as option}
          <li
            class="px-4 py-3 cursor-pointer hover:bg-blue-50"
            onclick={() => selectOption(option.value)}
          >
            <div class="font-bold">{option.title}</div>
            <div class="text-gray-500 text-sm">{option.description}</div>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
  