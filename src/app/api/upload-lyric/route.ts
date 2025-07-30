import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadToS3 } from "@/lib/s3";
import { randomUUID } from "crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    const formData = await req.formData();
    const imageFile = formData.get("image") as File;
    const videoId = formData.get("videoId") as string;
    const lyrics = formData.get("lyrics") as string;
    const author = formData.get("author") as string;
    const title = formData.get("title") as string;
    const thumbnailsRaw = formData.get("thumbnails") as string;

    // Validate required fields
    if (!imageFile || !videoId || !lyrics) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const key = `shared-lyrics/${randomUUID()}.png`;

    // Convert File to Buffer
    const buffer = Buffer.from(await imageFile.arrayBuffer());

    // Upload to S3 and get the URL
    const imageUrl = await uploadToS3({ buffer, key });

    // Store in database
    const image = await prisma.share.create({
      data: {
        userId: userId,
        videoId: videoId,
        lyrics_preview_src: imageUrl,
        lyricsJson: JSON.parse(lyrics),
      },
      select: {
        id: true,
        videoId: true,
        lyrics_preview_src: true,
      },
    });

    // Store in cache for trending tab to fetch in the future
    await prisma.cachedSong.create({
      data: {
        videoId,
        thumbnails: JSON.parse(thumbnailsRaw),
        title,
        author,
      },
    });

    return NextResponse.json({ ...image });
  } catch (e) {
    console.error("Upload lyric error:", e);
    return NextResponse.json({ error: e }, { status: 400 });
  }
}
