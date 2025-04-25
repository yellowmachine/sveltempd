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
      <div class="bg-white rounded-lg shadow-lg p-4 w-80">
        <div class="flex flex-col gap-2">
            <ActionButton
                text="play"
                action={handlePlay}
            />
            <ActionButton
                text={isInQueue ? "remove from playlist" : "add to playlist"}
                action={isInQueue ? handleRemoveFromQueue : handleAddToQueue}
            />
          </div>
        </div>
      </div>
    {/if}