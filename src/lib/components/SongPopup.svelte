<script lang="ts">
	import ActionButton from "./ActionButton.svelte";
    export let handleAddToQueue;
    export let handleRemoveFromQueue;
    export let handlePlay;
    export let isInQueue;
    export let showModal = false;

</script>
{#if showModal}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div aria-label="acciones" onblur={() => showModal = false} onmouseout={(e) => {
      if (!e.relatedTarget || !e.currentTarget.contains(e.relatedTarget as Node)) {
        showModal = false;
      }
    }} class="absolute left-0 top-full mt-2 z-50">
      <div class="bg-white rounded-lg shadow-lg p-4 w-40">
        <div class="flex flex-col gap-2">
            <ActionButton
                action={handlePlay}
            >
                    <button
              class="bg-white text-gray-600 hover:bg-gray-300 transition px-4 rounded transition"
            >
              play
            </button>
            </ActionButton>
            <ActionButton
                action={isInQueue ? handleRemoveFromQueue : handleAddToQueue}
            >
            <button
                class="bg-white text-gray-600 hover:bg-gray-300 transition px-4 rounded transition"
              >
                {isInQueue ? "remove from playlist" : "add to playlist"}
              </button>
            </ActionButton>
          </div>
        </div>
      </div>
    {/if}