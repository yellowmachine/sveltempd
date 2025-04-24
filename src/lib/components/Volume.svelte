<script lang="ts">  
    import VolumeBar from './VolumeBar.svelte';     
    export let volume: number;
    let showVolumeControl = false;
</script>

<span
    class="text-2xl relative"
    role="button" 
    tabindex="0"
    onmouseover={() => showVolumeControl = true}
    onfocus={() => showVolumeControl = true}
    onmouseleave={() => showVolumeControl = false}
    onblur={() => showVolumeControl = false}
    ontouchstart={() => showVolumeControl = true}
    ontouchend={() => showVolumeControl = false}
    >
    {volume}
    {#if showVolumeControl}
        <VolumeBar bind:volume />
    {/if}
</span>