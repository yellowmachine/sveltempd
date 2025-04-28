<script lang="ts">
    let {volume=$bindable()}: {volume: number} = $props();
    import { correctVolume } from "$lib/utils";

    let container: HTMLElement;
    let dragging = $state(false);
    let tempVolume = $state(volume);


    function startDrag(event: MouseEvent | TouchEvent) {
        dragging = true;
        window.addEventListener('mousemove', onDrag);
        window.addEventListener('mouseup', stopDrag);
        window.addEventListener('touchmove', onDrag);
        window.addEventListener('touchend', stopDrag);
        event.preventDefault();
    }

    function onDrag(event: MouseEvent | TouchEvent) {
        if (!dragging) return;
        
        const y = getY(event);
		const rect = container.getBoundingClientRect();
        if(rect){
			tempVolume = correctVolume((rect.bottom - y) / rect.height);
		}
    }

    function stopDrag() {
        if (dragging) {
            volume = tempVolume;
            dragging = false;
            window.removeEventListener('mousemove', onDrag);
            window.removeEventListener('mouseup', stopDrag);
            window.removeEventListener('touchmove', onDrag);
            window.removeEventListener('touchend', stopDrag);
        }
    }

	function getY(event: TouchEvent | MouseEvent) {
		if (event instanceof TouchEvent)	
			return event.touches[0].clientY;
		else
			return event.clientY;
	}

	function handleVolumeClickOuter(event: MouseEvent) {
		const y = getY(event);
		const rect = (event.currentTarget as HTMLElement).previousElementSibling?.getBoundingClientRect();
		if(rect){
			volume = correctVolume((rect.bottom - y) / rect.height);
		}	
	}

	function handleVolumeClick(event: TouchEvent | MouseEvent) {
		const y = getY(event);
		const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
		if(rect){
			volume = correctVolume((rect.bottom - y) / rect.height);
		}
  	}
</script>

<div class="absolute bg-gray-200 rounded-lg p-2 shadow-md" style={`top: 100%; left: 50%; transform: translateX(-50%)`}>
    <div class="flex flex-col items-center">
        <button
            aria-label="Cambiar volumen"
            class="w-3 h-40 bg-gray-400 rounded-lg relative"
            bind:this={container}
            onclick={handleVolumeClick}
            >
        </button>
        <button
            aria-label="Cambiar volumen"
            class="absolute w-3 bg-gray-600 rounded-lg"
            onclick={handleVolumeClickOuter}
            onmousedown={startDrag}
            ontouchstart={startDrag}
            style="height: {dragging ? tempVolume : volume}%; bottom: 0;"
        ></button>
    </div>
</div>