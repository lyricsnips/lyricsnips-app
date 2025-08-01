import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  videoId: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const parameters = await params;
    const videoId = parameters.videoId;

    if (!videoId) {
      return NextResponse.json(
        { error: "videoId parameter is required" },
        { status: 400 }
      );
    }

    // Query the cachedSongs table for the given videoId
    const cachedSong = await prisma.cachedSong.findUnique({
      where: {
        videoId: videoId,
      },
      select: {
        id: true,
        videoId: true,
        title: true,
        author: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!cachedSong) {
      return NextResponse.json(
        { error: "Song not found in cache" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: cachedSong,
    });
  } catch (error) {
    console.error("Error fetching cached song:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
