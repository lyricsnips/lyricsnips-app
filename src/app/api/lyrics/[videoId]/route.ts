import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  videoId: string;
}

interface ShareData {
  id: string;
  userId: string | null;
  videoId: string;
  lyrics_preview_src: string;
  lyricsJson: unknown;
  createdAt: Date;
  username?: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  const parameters = await params;
  const videoId = parameters.videoId;

  if (!videoId)
    NextResponse.json({ error: "videoId must be provided" }, { status: 400 });

  try {
    const lyrics = await prisma.share.findMany({
      where: {
        videoId: videoId,
      },
      select: {
        id: true,
        userId: true,
        videoId: true,
        lyrics_preview_src: true,
        lyricsJson: true,
        createdAt: true,
      },
    });

    const result = await Promise.all(
      lyrics.map(async (share: ShareData) => {
        if (!share.userId) return { ...share };
        const user = await prisma.user.findUnique({
          where: {
            id: share.userId,
          },
          select: {
            username: true,
          },
        });

        return { ...share, username: user?.username };
      })
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in GET /api/lyrics:", error);
    return NextResponse.json(
      { error: "Failed to fetch shares" },
      { status: 500 }
    );
  }
}
