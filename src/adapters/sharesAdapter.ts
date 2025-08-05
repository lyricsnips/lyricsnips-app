import { fetcher } from "@/lib/fetcher";

interface ShareData {
  id: string;
  videoId: string;
  lyrics_preview_src: string;
  lyricsJson: unknown;
  createdAt: Date;
  userId: string;
}

interface ApiResponse<T> {
  data?: T;
}

interface ErrorResponse {
  message: string;
}

export async function getShares() {
  try {
    const res = await fetcher<ApiResponse<ShareData[]>>(`api/shares`, {
      method: "GET",
    });
    return { data: res, error: null };
  } catch (e: unknown) {
    const error = e as ErrorResponse;
    return { data: null, error: error.message || "Unknown error" };
  }
}

export async function deleteShare(shareId: string) {
  try {
    const res = await fetcher<ApiResponse<{ success: boolean }>>(
      `api/shares/${shareId}`,
      {
        method: "DELETE",
      }
    );
    return { data: res, error: null };
  } catch (e: unknown) {
    const error = e as ErrorResponse;
    return { data: null, error: error.message || "Unknown error" };
  }
}
