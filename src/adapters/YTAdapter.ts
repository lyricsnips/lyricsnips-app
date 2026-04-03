import { fetcher } from "@/lib/fetcher";
import {
  SongData,
  ApiResponse,
  LyricResponse,
  Lyric,
} from "../../types/SongTypes/Song";

interface Thumbnail {
  url: string;
  width?: number;
  height?: number;
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

interface ErrorResponse {
  message: string;
}

export async function getSongs(query: string) {
  try {
    const res = await fetcher<ApiResponse<SongData[]>>(
      `/api/songs/search?query=${encodeURIComponent(query)}`,
      {
        method: "GET",
      },
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
      `/api/songs/lyrics?video_id=${encodeURIComponent(videoId)}`,
      {
        method: "GET",
      },
    );

    return { data: res.data, error: null };
  } catch (e: unknown) {
    const error = e as ErrorResponse;
    return { data: null, error: error.message || "Unknown error" };
  }
}

// export async function getSong(videoId: string) {
//   try {
//     // Try getting from database
//     interface CacheResponse {
//       data?: VideoDetails;
//     }

//     try {
//       const cache = await fetcher<CacheResponse>(`/api/cache/${videoId}`, {
//         method: "GET",
//       });

//       if (cache.data) {
//         console.log(`Song found in cache:`, cache.data);
//         return { data: cache.data, error: null };
//       }
//     } catch (error) {
//       console.error("Failed to fetch from cache:", error);
//       // Continue to YouTube API fallback
//     }

//     // Fallback to Youtube API
//     const res = await fetcher<ApiResponse<{ videoDetails: VideoDetails }>>(
//       `/api/songs/${encodeURIComponent(videoId)}`,
//       {
//         method: "GET",
//       },
//     );

//     console.log(res);

//     return { data: res.data?.videoDetails, error: null };
//   } catch (e: unknown) {
//     const error = e as ErrorResponse;
//     return { data: null, error: error.message || "Unknown error" };
//   }
// }

export async function getTrendingSongs() {
  try {
    const res = await fetcher<ApiResponse<SongData[]>>(`api/trending`, {
      method: "GET",
    });

    return { data: res.data, error: null };
  } catch (e: unknown) {
    const error = e as ErrorResponse;
    return { data: null, error: error.message || "Unknown error" };
  }
}
