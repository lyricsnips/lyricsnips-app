import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/trending
export async function GET() {
  try {
    // First, get the trending videoIds with their counts
    const trendingCounts = await prisma.share.groupBy({
      by: ["videoId"],
      _count: {
        videoId: true,
      },
    });

    // Sort by count descending and get top 10
    const sortedCounts = trendingCounts
      .sort((a, b) => b._count.videoId - a._count.videoId)
      .slice(0, 10);

    // Fetch the song metadata for each trending videoId
    const trendingSongs = await Promise.all(
      sortedCounts.map(async (item) => {
        const cachedSong = await prisma.cachedSong.findUnique({
          where: { videoId: item.videoId },
          select: {
            videoId: true,
            title: true,
            author: true,
            thumbnails: true,
          },
        });

        return {
          videoId: item.videoId,
          title: cachedSong?.title || "Unknown Title",
          author: cachedSong?.author || "Unknown Artist",
          thumbnails: cachedSong?.thumbnails || [],
          count: item._count.videoId,
        };
      })
    );

    return NextResponse.json(trendingSongs);
  } catch (error) {
    console.error("Error in GET /api/trending:", error);
    return NextResponse.json(
      { error: "Failed to fetch trending songs" },
      { status: 500 }
    );
  }
}
