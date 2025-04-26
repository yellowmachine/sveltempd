import type { MPDStatus } from '$lib/types/index';
import type { Song } from './messages';

export type M = Pick<ReturnType<typeof createMutation>, 'ok' | 'error' | 'clear' | 'mutate' | 'loading'>

export function createMutation<T>(fn: Function) {
  let error: string | null = $state(null);
  let loading: boolean = $state(false);
  let value: T | null = $state(null);
  let ok: true | null = $state(null);

  return {
    async mutate(event: Event){
      try {
        loading = true;
        value = await fn(event);
        ok = true;
        error = null;
      } catch (e) {
        console.log(e)
        ok = null;
        error = e instanceof Error ? e.message : String(e);
        trpcError.update(error)
      } finally {
        loading = false;
      }
    },
    get value() {
      return value;
    },
    get error() {
      return error;
    },
    get loading() {
      return loading;
    },
    get ok() {
      return ok;
    },
    clear() {
      error = null;
      ok = null;
    }
  }
}

function createTrpcErrorStore() {
  let error: string | null = $state(null);
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return {
    update(value: string | null) {
      error = value;
      timeout = setTimeout(() => error = null, 5000);
    },
    get value() {
      return error;
    },
    clear() {
      error = null;
      if(timeout) clearTimeout(timeout);
    }
  };
}

export const trpcError = createTrpcErrorStore();

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