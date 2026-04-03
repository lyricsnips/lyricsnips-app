export interface SongData {
  videoId: string;
  title: string;
  author: string;
  artists: Array<{ id: string; name: string }>;
  thumbnails: string;
  duration?: string;
  isExplicit?: boolean;
  timesShared?: number;
  lyrics?: LyricData[] | undefined;
  count?: number;
  album?: { name: string };
}

export interface Lyric {
  id: string;
  text: string;
  start_time: number;
  end_time: number;
}

export interface LyricObject {
  id: string;
  text: string;
}

export interface LyricData {
  id: string;
  lyricsJson: LyricObject[];
  username?: string;
}

export interface LyricResponse {
  hasTimestamps: boolean;
  lyrics: Lyric[];
  source: string;
}

export interface ApiResponse<T> {
  data: T;
}
