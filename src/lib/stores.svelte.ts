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
  let playlist: Array<{ artist: string; song: string }> = $state([]);

  return {
    update(newPlaylist: Array<{ artist: string; song: string }>) {
      playlist = [...newPlaylist];
    },
    get value() {
      return playlist;
    }
  };
}

export const playlist = createPlaylistStore();

export const currentSong = $derived.by( () => {
  const current = mpdStatus.value?.songid;
  if (!current) return null;
  if (!playlist.value) return null;
  if (!playlist.value[current]) return null;
  const song = playlist.value[current];
  return {
    title: song.song,
    artist: song.artist
  };
});