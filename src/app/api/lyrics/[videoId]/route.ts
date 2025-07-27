import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  videoId: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  const videoId = params.videoId;

  if (!videoId)
    NextResponse.json({ error: "videoId must be provided" }, { status: 400 });

  try {
    const lyrics = await prisma.share.findMany({
      where: {
        videoId: videoId,
      },
      select: {
        id: true,
        videoId: true,
        lyrics_preview_src: true,
        lyricsJson: true,
        createdAt: true,
      },
    });

    return NextResponse.json(lyrics);
  } catch (error) {
    console.error("Error in GET /api/lyrics:", error);
    return NextResponse.json(
      { error: "Failed to fetch shares" },
      { status: 500 }
    );
  }
}
