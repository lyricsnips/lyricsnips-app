import { fetcher } from "@/lib/fetcher";

const baseUrl =
  process.env.NEXT_PUBLIC_YT_MUSIC_API_URL || "http://127.0.0.1:8000/";

// Type definitions
interface SongData {
  videoId: string;
  title: string;
  author: string;
  thumbnails: Thumbnail[];
  duration?: string;
  isExplicit?: boolean;
  timesShared?: number;
}

interface Thumbnail {
  url: string;
  width?: number;
  height?: number;
}

interface LyricData {
  id: string;
  text: string;
  start_time: number;
  end_time: number;
  start?: number;
  duration?: number;
}

interface LyricResponse {
  hasTimestamps: boolean;
  lyrics: Array<LyricData>;
  source: "Source: Musixmatch";
}

interface VideoDetails {
  videoId: string;
  title: string;
  author: string;
  thumbnails: Thumbnail[];
  duration?: string;
  isExplicit?: boolean;
  timesShared?: number;
}

interface ApiResponse<T> {
  data?: T;
}

interface ErrorResponse {
  message: string;
}

export async function getSongs(query: string) {
  try {
    const res = await fetcher<ApiResponse<SongData[]>>(
      `${baseUrl}songs/search?query=${query}`,
      {
        method: "GET",
      }
    );
    return { data: res.data, error: null };
  } catch (e: unknown) {
    const error = e as ErrorResponse;
    return { data: null, error: error.message || "Unknown error" };
  }
}

export async function getLyrics(videoId: string) {
  try {
    const res = await fetcher<ApiResponse<LyricResponse>>(
      `${baseUrl}songs/lyrics?video_id=${videoId}`,
      {
        method: "GET",
      }
    );
    return { data: res.data, error: null };
  } catch (e: unknown) {
    const error = e as ErrorResponse;
    return { data: null, error: error.message || "Unknown error" };
  }
}

export async function getSong(videoId: string) {
  try {
    // Try getting from database
    interface CacheResponse {
      data?: VideoDetails;
    }

    try {
      const cache = await fetcher<CacheResponse>(`/api/cache/${videoId}`, {
        method: "GET",
      });

      if (cache.data) {
        console.log(`Song found in cache:`, cache.data);
        return { data: cache.data, error: null };
      }
    } catch (error) {
      console.error("Failed to fetch from cache:", error);
      // Continue to YouTube API fallback
    }

    // Fallback to Youtube API
    const res = await fetcher<ApiResponse<{ videoDetails: VideoDetails }>>(
      `${baseUrl}songs/${videoId}`,
      {
        method: "GET",
      }
    );

    console.log(res);

    return { data: res.data?.videoDetails, error: null };
  } catch (e: unknown) {
    const error = e as ErrorResponse;
    return { data: null, error: error.message || "Unknown error" };
  }
}

export async function getTrendingSongs() {
  try {
    const res = await fetcher<ApiResponse<SongData[]>>(`api/trending`, {
      method: "GET",
    });

    return { data: res, error: null };
  } catch (e: unknown) {
    const error = e as ErrorResponse;
    return { data: null, error: error.message || "Unknown error" };
  }
}
