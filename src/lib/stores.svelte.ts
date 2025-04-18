import type { MPDStatus } from '$lib/types/index';

function createMPDStore() {
  let state: MPDStatus | null = $state(null);

  return {
    update(newState: MPDStatus) {
      state = { ...newState };
    },
    get value() {
      return state;
    }
  };
}

export const mpdStatus = createMPDStore();

function createPlaylistStore() {
  let playlist: Array<{ artist: string; title: string }> = $state([]);

  return {
    update(newPlaylist: Array<{ artist: string; title: string }>) {
      playlist = [...newPlaylist];
    },
    get value() {
      return playlist;
    }
  };
}

export const playlist = createPlaylistStore();

const currentSong = $derived.by( () => {
  const current = mpdStatus.value?.song;

  if (!current) return null;
  if (!playlist.value) return null;
  if (!playlist.value[current]) return null;
  return playlist.value[current];
});

export function getCurrentSong() {
  return currentSong;
}