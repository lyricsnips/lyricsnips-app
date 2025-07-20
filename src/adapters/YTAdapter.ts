import { fetcher } from "@/lib/fetcher";

interface Song {
  videoId: "your_video_id_here";
  lyricsJson: Object[];
}

const baseUrl = "http://127.0.0.1:5000/songs/";

export async function getSongs(query: string) {
  try {
    const res = await fetcher<{ data?: any }>(
      `${baseUrl}search?query=${query}`,
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
      `${baseUrl}lyrics?video_id=${videoId}`,
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
    const res = await fetcher<{ data?: any }>(`${baseUrl}${videoId}`, {
      method: "GET",
    });
    return { data: res.data, error: null };
  } catch (e: any) {
    return { data: null, error: e.message || "Unknown error" };
  }
}
