export type MPDStatus = {
  currentSong: {
    title: string,
    artist: string
  },
  volume: number;
  repeat: boolean;
  random: boolean;
  single: boolean;
  consume: boolean;
  playlist: number;
  playlistlength: number;
  mixrampdb: number;
  state: 'play' | 'stop' | 'pause';
  song: number;
  songid: number;
  time: {
    elapsed: number;
    total: number;
  };
  elapsed: number;
  bitrate: string;
  audio: {
    sampleRate: number;
    bits: number;
    channels: number;
    sample_rate_short: {
      value: number;
      unit: 'kHz';
    };
  };
  nextsong: number;
  nextsongid: number;
};
export type Playlist = Array<{
  artist: string;
  song: string;
}>;
export type PlaylistMsg = {
  playlist: Playlist;
};
export type CurrentSong = {
  artist: string;
  song: string;
};
export type CurrentSongMsg = {
  currentSong: CurrentSong;
};
