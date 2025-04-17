import { writable } from 'svelte/store';

export const volume = writable(50);
export const playlist = writable([]);
export const currentSong = writable(null);

export const sseCommandHandlers = {
    volumeUp: () => {
      volume.update(v => Math.min(v + 5, 100));
    },
    volumeDown: () => {
      volume.update(v => Math.max(v - 5, 0));
    },
    volumeSet: (data) => {
      if (typeof data.value === 'number') {
        volume.set(Math.min(Math.max(data.value, 0), 100));
      }
    },
    playlistUpdate: (data) => {
      if (Array.isArray(data.songs)) {
        playlist.set(data.songs);
      }
    },
    currentSongChange: (data) => {
      currentSong.set(data.song);
    },
    // Añade más comandos según eventos que recibas
  };