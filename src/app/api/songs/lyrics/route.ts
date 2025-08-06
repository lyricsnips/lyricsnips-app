import { NextRequest, NextResponse } from "next/server";

const YT_MUSIC_API_URL =
  process.env.YT_MUSIC_API_URL ||
  "https://yt-music-api-548129453770.northamerica-northeast1.run.app";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const video_id = searchParams.get("video_id");

    if (!video_id) {
      return NextResponse.json(
        { error: "video_id parameter is required" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${YT_MUSIC_API_URL}/songs/lyrics?video_id=${encodeURIComponent(
        video_id
      )}`,
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
    console.error("Error in songs lyrics proxy:", error);
    return NextResponse.json(
      { error: "Failed to fetch lyrics" },
      { status: 500 }
    );
  }
}
