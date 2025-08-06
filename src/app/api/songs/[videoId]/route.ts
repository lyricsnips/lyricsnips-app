import { NextRequest, NextResponse } from "next/server";

const YT_MUSIC_API_URL =
  process.env.YT_MUSIC_API_URL ||
  "https://yt-music-api-548129453770.northamerica-northeast1.run.app";

export async function GET(
  request: NextRequest,
  { params }: { params: { videoId: string } }
) {
  try {
    const { videoId } = params;

    if (!videoId) {
      return NextResponse.json(
        { error: "videoId is required" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${YT_MUSIC_API_URL}/songs/${encodeURIComponent(videoId)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`External API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in songs videoId proxy:", error);
    return NextResponse.json(
      { error: "Failed to fetch song details" },
      { status: 500 }
    );
  }
}
