import { fetcher } from "@/lib/fetcher";
import { prisma } from "@/lib/prisma";

interface LyricData {
  id: string;
  text: string;
  start_time: number;
  end_time: number;
  start?: number;
  duration?: number;
}

interface SongInfo {
  videoId: string;
  title: string;
  author: string;
  thumbnails: Array<{ url: string }>;
  duration?: string;
  isExplicit?: boolean;
  timesShared?: number;
}

interface AskGeminiTypes {
  query: string;
  context: LyricData[];
  songInfo: SongInfo;
}

interface ApiResponse<T> {
  data?: T;
}

interface ErrorResponse {
  message: string;
}

// Returns a png (white canvas and lyrics for now)
export async function generateImage({
  videoId,
  lyrics,
}: {
  videoId: string;
  lyrics: LyricData[];
}) {
  try {
    const res = await fetcher("/api/image-gen", {
      method: "POST",
      body: { videoId, lyrics },
      responseType: "json",
    });
    return { data: res, error: null }; // res is the Blob
  } catch (e: unknown) {
    const error = e as ErrorResponse;
    return { data: null, error: error.message || "Unknown error" };
  }
}

export async function fetchSharedLyrics(shareId: string) {
  try {
    console.log("Fetching shared lyrics for shareId:", shareId);

    const share = await prisma.share.findUnique({
      where: { id: shareId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    if (!share) {
      return { data: null, error: "Share not found" };
    }

    return {
      data: {
        id: share.id,
        videoId: share.videoId,
        title: share.title,
        author: share.author,
        lyricsPreviewSrc: share.lyrics_preview_src,
        lyricsJson: share.lyricsJson,
        createdAt: share.createdAt,
        user: share.user
          ? {
              id: share.user.id,
              username: share.user.username,
            }
          : null,
      },
      error: null,
    };
  } catch (e: unknown) {
    console.error("Error in fetchSharedLyrics:", e);
    const error = e as ErrorResponse;
    return { data: null, error: error.message || "Unknown error" };
  }
}

export async function getSharedLyrics(videoId: string) {
  try {
    const res = await fetcher<ApiResponse<LyricData[]>>(
      `api/lyrics/${videoId}`,
      {
        method: "GET",
      }
    );
    return { data: res, error: null };
  } catch (e: unknown) {
    const error = e as ErrorResponse;
    return { data: null, error: error.message || "Unknown error" };
  }
}

export async function askGemini(body: AskGeminiTypes) {
  try {
    const res = await fetcher<ApiResponse<{ answer: string }>>(
      "/api/askgemini",
      {
        method: "POST",
        body: body,
      }
    );
    return { data: res, error: null };
  } catch (e: unknown) {
    const error = e as ErrorResponse;
    return { data: null, error: error.message || "Unknown error" };
  }
}
