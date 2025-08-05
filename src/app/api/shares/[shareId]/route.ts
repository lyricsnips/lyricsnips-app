import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { removeFromS3ByUrl } from "@/lib/s3";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ shareId: string }> }
) {
  const parameters = await params;
  const shareId = parameters.shareId;

  if (!shareId) {
    return NextResponse.json(
      { error: "shareId must be provided" },
      { status: 400 }
    );
  }

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    const userId = session.user.id;

    // First, get the share to find the S3 image URL
    const share = await prisma.share.findUnique({
      where: {
        id: shareId,
        userId: userId,
      },
    });

    if (!share) {
      return NextResponse.json(
        { error: "Share not found or you don't have permission to delete it" },
        { status: 404 }
      );
    }

    // Delete from S3 first (if image exists)
    if (share.lyrics_preview_src) {
      try {
        await removeFromS3ByUrl({ imageUrl: share.lyrics_preview_src });
        console.log("Successfully deleted from S3");
      } catch (s3Error) {
        console.error("Failed to delete from S3:", s3Error);
        return NextResponse.json(
          { error: "Failed to delete from S3" },
          { status: 500 }
        );
      }
    }

    // Delete from database
    const result = await prisma.share.delete({
      where: {
        id: shareId,
        userId: userId,
      },
    });

    return NextResponse.json({
      message: `Deleted share with id: ${shareId}`,
      deletedShare: result,
    });
  } catch (error: unknown) {
    const prismaError = error as { code?: string };
    if (prismaError.code === "P2025") {
      // Record not found
      return NextResponse.json(
        { error: "Share not found or you don't have permission to delete it" },
        { status: 404 }
      );
    }

    console.error("Error in DELETE /api/shares/[shareId]:", error);
    return NextResponse.json(
      { error: "Failed to delete share" },
      { status: 500 }
    );
  }
}
