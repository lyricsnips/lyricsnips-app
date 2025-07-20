import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import sharp from "sharp";
import { uploadToS3 } from "@/lib/s3";
import { randomUUID } from "crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: NextRequest) {
  const { videoId, lyrics } = await req.json();
  const session = await getServerSession(authOptions);

  // Allow anonymous sharing - userId is optional now
  const userId = session?.user?.id || undefined;

  // Join lyrics into a single string
  const text = Array.isArray(lyrics)
    ? lyrics.map((l: any) => l.text).join("\n")
    : String(lyrics);

  // Create a white canvas with gradient background
  const width = 800;
  const height = 400;

  // Function to wrap text to fit within maxWidth
  const wrapText = (text: string, maxWidth: number, fontSize: number) => {
    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = "";

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      // Approximate character width (rough estimate: 0.6 * fontSize per character)
      const testWidth = testLine.length * fontSize * 0.6;

      if (testWidth > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
  };

  // Wrap each lyric line to fit the canvas
  const wrappedLines: string[] = [];
  const maxLineWidth = width - 100; // Leave 50px margin on each side
  const fontSize = 28;

  const originalLines = text.split("\n");
  for (const line of originalLines) {
    const wrapped = wrapText(line, maxLineWidth, fontSize);
    wrappedLines.push(...wrapped);
  }

  // Limit to reasonable number of lines to fit in canvas
  const maxLines = Math.min(wrappedLines.length, 8);
  const displayLines = wrappedLines.slice(0, maxLines);

  const lineHeight = 1.4;
  const totalHeight = displayLines.length * fontSize * lineHeight;
  const startY = (height - totalHeight) / 2 + fontSize;

  const tspanLines = displayLines
    .map(
      (line, i) =>
        `<tspan x="50%" y="${
          startY + i * fontSize * lineHeight
        }" text-anchor="middle" fill="#1f2937" font-weight="500">${line}</tspan>`
    )
    .join("");

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#f8fafc;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#e2e8f0;stop-opacity:1" />
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000000" flood-opacity="0.1"/>
        </filter>
      </defs>
      
      <!-- Background with gradient -->
      <rect width="100%" height="100%" fill="url(#bg)"/>
      
      <!-- Decorative elements -->
      <circle cx="50" cy="50" r="30" fill="#3b82f6" opacity="0.1"/>
      <circle cx="${width - 50}" cy="${
    height - 50
  }" r="40" fill="#8b5cf6" opacity="0.1"/>
      
      <!-- Main text with shadow -->
      <text 
        x="50%" 
        y="50%" 
        font-size="${fontSize}" 
        font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        text-anchor="middle" 
        dominant-baseline="middle"
        filter="url(#shadow)"
      >
        ${tspanLines}
      </text>
      
      <!-- Subtle border -->
      <rect width="100%" height="100%" fill="none" stroke="#e2e8f0" stroke-width="1"/>
    </svg>
  `;

  const buffer = await sharp(Buffer.from(svg)).png().toBuffer();

  // Generate a unique key for the image
  const key = `shared-lyrics/${randomUUID()}.png`;

  // Upload to S3 and get the URL
  const imageUrl = await uploadToS3({ buffer, key });

  // Store in database
  const image = await prisma.share.create({
    data: {
      userId: userId,
      videoId: videoId,
      lyrics_preview_src: imageUrl,
      lyricsJson: lyrics,
    },
    select: {
      id: true,
      videoId: true,
      lyrics_preview_src: true,
    },
  });

  return NextResponse.json({ ...image });
}
