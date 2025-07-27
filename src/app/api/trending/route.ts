import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/trending
export async function GET() {
  // Example: return a list of songs (empty for now)
  try {
    const trending = await prisma.share.groupBy({
      by: ["videoId"],
      _count: {
        videoId: true,
      },
    });

    const formatted = trending.map((item) => ({
      videoId: item.videoId,
      count: item._count.videoId,
    }));

    // Sort by count descending
    const sorted = formatted.sort((a, b) => b.count - a.count);

    return NextResponse.json(sorted.slice(0, 10));
  } catch (error) {
    console.error("Error in GET /api/shares:", error);
    return NextResponse.json(
      { error: "Failed to fetch shares" },
      { status: 500 }
    );
  }
}
