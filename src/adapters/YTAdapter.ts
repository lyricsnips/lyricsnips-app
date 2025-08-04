import { fetcher } from "@/lib/fetcher";

const baseUrl =
  process.env.NEXT_PUBLIC_YT_MUSIC_API_URL || "http://127.0.0.1:8000/";

export async function getSongs(query: string) {
  try {
    const res = await fetcher<{ data?: any }>(
      `${baseUrl}songs/search?query=${query}`,
      {
        method: "GET",
      }
    );
    return { data: res.data, error: null };
  } catch (e: any) {
    return { data: null, error: e.message || "Unknown error" };
  }
}

export async function getLyrics(videoId: string) {
  try {
    const res = await fetcher<{ data?: any }>(
      `${baseUrl}songs/lyrics?video_id=${videoId}`,
      {
        method: "GET",
      }
    );
    return { data: res.data, error: null };
  } catch (e: any) {
    return { data: null, error: e.message || "Unknown error" };
  }
}

export async function getSong(videoId: string) {
  try {
    // Try getting from database
    interface CacheResponse {
      data?: {
        videoId: string;
        thumbnails: any[];
        title: string;
        author: string;
        // ... other properties
      };
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
    const res = await fetcher<{ data?: any }>(`${baseUrl}songs/${videoId}`, {
      method: "GET",
    });
    return { data: res.data.videoDetails, error: null };
  } catch (e: any) {
    return { data: null, error: e.message || "Unknown error" };
  }
}

export async function getTrendingSongs() {
  try {
    const res = await fetcher<{ data?: any }>(`api/trending`, {
      method: "GET",
    });

    return { data: res, error: null };
  } catch (e: any) {
    return { data: null, error: e.message || "Unknown error" };
  }
}
