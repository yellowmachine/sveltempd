import type { MPDStatus } from '$lib/types/index';
import type { Song } from './messages';

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
  let playlist: Array<Song> = $state([]);

  return {
    update(newPlaylist: Array<Song>) {
      playlist = [...newPlaylist];
    },
    get value() {
      return playlist;
    }
  };
}

export const playlist = createPlaylistStore();

const currentSongInfo = $derived.by( () => {
  const current = mpdStatus.value?.song;

  if(current === undefined) return null;
  if (!playlist.value) return null;
  if (!playlist.value[current]) return null;
  return playlist.value[current];
});


export function getCurrentSongInfo() {
  return currentSongInfo;
}


function createQueueStore() {
  let queue: Array<Song> = $state([]);

  return {
    update(newQueue: {queue: Array<Song>}) {
      queue = [...newQueue.queue];
    },
    get uriList() {
      return queue.map((song) => song.uri);
    },
    get value() {
      return queue;
    }
  };
}

export const queue = createQueueStore();

function createCurrentSongStore() {
  let currentSong: string | null = $state(null);

  return {
    update(newValue: string | null) {
      currentSong = newValue
    },
    get value() {
      return currentSong;
    }
  };
}
export const currentSong = createCurrentSongStore();