import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

interface LyricData {
  id: string;
  text: string;
  start_time: number;
  end_time: number;
  start?: number;
  duration?: number;
}

interface SongInfo {
  videoId: string;
  title: string;
  author: string;
  thumbnails: Array<{ url: string }>;
  duration?: string;
  isExplicit?: boolean;
  timesShared?: number;
}

interface RequestBody {
  query: string;
  context: LyricData[];
  selectedLyrics: LyricData[];
  songInfo: SongInfo;
}

export async function POST(req: NextRequest) {
  try {
    const { query, context, selectedLyrics, songInfo } =
      (await req.json()) as RequestBody;

    // Initialize the model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Improved prompt with better structure and clarity
    const prompt = `
You are a music expert assistant. Answer questions about lyrics and songs concisely.

Song: "${songInfo?.title || "Unknown"}" by ${songInfo?.author || "Unknown"}

Full Lyrics Context: ${
      context
        ? context.map((lyric: LyricData) => lyric.text).join(" ")
        : "Not available"
    }

Selected Lyrics (User's focus): ${
      selectedLyrics
        ? selectedLyrics.map((lyric: LyricData) => lyric.text).join(" ")
        : "None selected"
    }

User Question: ${query}

Instructions:
- Answer in 2-4 sentences maximum
- Focus on the selected lyrics if provided
- If the question is unrelated to the song/lyrics, politely decline
- Be helpful but concise
- Use simple, clear language
`;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({
      answer: text,
      success: true,
    });
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json(
      {
        error: "Failed to generate response",
        success: false,
      },
      { status: 500 }
    );
  }
}
