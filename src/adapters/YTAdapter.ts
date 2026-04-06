import { fetcher } from "@/lib/fetcher";
import {
  SongData,
  ApiResponse,
  LyricResponse,
  SongInfo,
} from "../../types/SongTypes/Song";

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

export async function getSong(videoId: string) {
  try {
    const res = await fetcher(`/api/songs/${videoId}`, {
      method: "GET",
    });

    return { data: res as SongInfo, error: null };
  } catch (e: unknown) {
    const error = e as ErrorResponse;
    return { data: null, error: error.message || "Unknown error" };
  }
}

export async function getTrendingSongs() {
  try {
    const res = await fetcher<ApiResponse<SongData[]>>(`/api/trending`, {
      method: "GET",
    });

    return { data: res.data, error: null };
  } catch (e: unknown) {
    const error = e as ErrorResponse;
    return { data: null, error: error.message || "Unknown error" };
  }
}
