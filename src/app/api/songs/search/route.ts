import { NextRequest, NextResponse } from "next/server";

const YT_MUSIC_API_URL = process.env.YT_MUSIC_API_URL;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter is required" },
        { status: 400 },
      );
    }

    const response = await fetch(
      `${YT_MUSIC_API_URL}/search?query=${encodeURIComponent(query)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`External API responded with status: ${response.status}`);
    }

    const data = await response.json();

    console.log(data);
    return NextResponse.json({ data: data });
  } catch (error) {
    console.error("Error in songs search proxy:", error);
    return NextResponse.json(
      { error: "Failed to fetch songs" },
      { status: 500 },
    );
  }
}
