import type { MPDStatus } from '$lib/types/index';
import type { Song } from './messages';

export type M = Pick<ReturnType<typeof createAsync>, 'ok' | 'error' | 'clear' | 'call' | 'loading'>

export function createAsync<T>(fn: Function) {
  let error: string | null = $state(null);
  let loading: boolean = $state(false);
  let data: T | null = $state(null);
  let ok: true | null = $state(null);

  return {
    async call(...args: any) {
      try {
        loading = true;
        data = await fn(...args);
        ok = true;
        error = null;
        //return data
      } catch (e) {
        console.log(e)
        ok = null;
        error = e instanceof Error ? e.message : String(e);
        trpcError.update(error)
      } finally {
        loading = false;
      }
    },
    get data() {
      return data;
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
    update(value: string | null, type: string | null = null) {
      error = value;
      if(type === null)
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
  let timer: ReturnType<typeof setInterval> | null = null;

  let title: string | null = $state(null);
  let total: number | null = $state(null);
  let elapsed: number = $state(0);
  let uri: string | null = $state(null);

  function clearTimer() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  // Creamos el objeto store antes del efecto para poder referenciarlo
  const store = {
    update(newValue: {title?: string, total?: number, elapsed?: number, uri?: string} | null) {
      title = newValue?.title ?? null;
      total = newValue?.total ?? null;
      elapsed = newValue?.elapsed ?? 0;
      uri = newValue?.uri ?? null;
    },
    get value() {
      return {title, total, elapsed, uri};
    },
    start(){
      clearTimer();
      timer = setInterval(() => {
        elapsed += 1;
      }, 1000);
    },
    pause(){
      clearTimer();
    },
    stop(){
      clearTimer();
      elapsed = 0;
    },
    reset() {
      clearTimer();
      title = null;
      total = null;
      elapsed = 0;
      uri = null;
    }
  };

  return store;
}

export const currentSong = createCurrentSongStore();
