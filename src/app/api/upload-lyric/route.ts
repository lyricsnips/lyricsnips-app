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

    console.log("Session:", session);
    console.log("User ID:", userId);
    console.log("User ID type:", typeof userId);

    const formData = await req.formData();
    const imageFile = formData.get("image") as File;
    const videoId = formData.get("videoId") as string;
    const lyrics = formData.get("lyrics") as string;
    const author = formData.get("author") as string;
    const title = formData.get("title") as string;
    // const thumbnailsRaw = formData.get("thumbnails") as string;

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
    const shareData = {
      user: userId ? { connect: { id: userId } } : undefined,
      title: title,
      author: author,
      videoId: videoId,
      lyrics_preview_src: imageUrl,
      lyricsJson: JSON.parse(lyrics),
    };

    const image = await prisma.share.create({
      data: shareData,
      select: {
        id: true,
        videoId: true,
        title: true,
        author: true,
        lyrics_preview_src: true,
      },
    });

    // Store in cache for trending tab to fetch in the future
    // Disable cache since author and title stored in url params
    // try {
    //   await prisma.cachedSong.upsert({
    //     where: {
    //       videoId: videoId,
    //     },
    //     update: {
    //       title: title,
    //       author: author,
    //       thumbnails: JSON.parse(thumbnailsRaw),
    //       updatedAt: new Date(),
    //     },
    //     create: {
    //       videoId: videoId,
    //       title: title,
    //       author: author,
    //       thumbnails: JSON.parse(thumbnailsRaw),
    //     },
    //   });
    // } catch (error) {
    //   // Log the error but don't fail the upload
    //   console.log("Failed to cache song data:", error);
    //   // Continue with the upload process
    // }

    return NextResponse.json({ ...image });
  } catch (e) {
    console.error("Upload lyric error:", e);
    return NextResponse.json({ error: e }, { status: 400 });
  }
}
