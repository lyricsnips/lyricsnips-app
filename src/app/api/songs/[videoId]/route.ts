import { NextRequest, NextResponse } from "next/server";

const YT_MUSIC_API_URL = process.env.YT_MUSIC_API_URL;

export async function GET(
  request: NextRequest,
  { params }: { params: { videoId: string } },
) {
  try {
    const parameters = await params;
    const videoId = parameters.videoId;

    if (!videoId) {
      return NextResponse.json(
        { error: "videoId is required" },
        { status: 400 },
      );
    }

    const response = await fetch(
      `https://serpapi.com/search.json\?engine\=youtube_video\&v\=${videoId}\&api_key\=${process.env.SERP_API_KEY}`,
      {
        method: "GET",
      },
    );

    if (!response.ok) {
      throw new Error(`External API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Error in songs videoId proxy:", error);
    return NextResponse.json(
      { error: "Failed to fetch song details" },
      { status: 500 },
    );
  }
}
