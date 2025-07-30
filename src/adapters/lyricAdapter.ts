import { fetcher } from "@/lib/fetcher";
import { prisma } from "@/lib/prisma";

interface askGeminiTypes {
  query: string;
  context: any[];
  songInfo: any;
}

// Returns a png (white canvas and lyrics for now)
export async function generateImage({
  videoId,
  lyrics,
}: {
  videoId: string;
  lyrics: Object[];
}) {
  try {
    const res = await fetcher("/api/image-gen", {
      method: "POST",
      body: { videoId, lyrics },
      responseType: "json",
    });
    return { data: res, error: null }; // res is the Blob
  } catch (e: any) {
    return { data: null, error: e.message || "Unknown error" };
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
  } catch (e: any) {
    console.error("Error in fetchSharedLyrics:", e);
    return { data: null, error: e.message || "Unknown error" };
  }
}

export async function getSharedLyrics(videoId: string) {
  try {
    const res = await fetcher<{ data?: any }>(`api/lyrics/${videoId}`, {
      method: "GET",
    });
    return { data: res, error: null };
  } catch (e: any) {
    return { data: null, error: e.message || "Unknown error" };
  }
}

export async function askGemini(body: askGeminiTypes) {
  try {
    const res = await fetcher<{ data?: any }>("/api/askgemini", {
      method: "POST",
      body: body,
    });
    return { data: res, error: null };
  } catch (e: any) {
    return { data: null, error: e.message || "Unknown error" };
  }
}

