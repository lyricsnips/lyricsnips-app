import { fetchSharedLyrics } from "@/adapters/lyricAdapter";
import { Metadata } from "next";
import { Frown, Music, ExternalLink } from "lucide-react";
import { Geo } from "next/font/google";
import { defaultButtonStyle } from "@/styles/Buttons";

const geo = Geo({
  weight: ["400"],
});

export async function generateMetadata({
  params,
}: {
  params: { shareId: string };
}): Promise<Metadata> {
  const { shareId } = await params;
  const { data: sharedLyrics } = await fetchSharedLyrics(shareId);

  if (!sharedLyrics) {
    return {
      title: "Shared Lyrics - LyricsNips",
    };
  }

  const username = sharedLyrics.user?.username || "Anonymous";

  return {
    title: `Lyrics shared by ${username} - LyricSnips`,
    description: "Check out these shared lyrics from LyricSnips",
    openGraph: {
      title: `Lyrics shared by ${username}`,
      description: "Check out these shared lyrics from LyricSnips",
      images: [sharedLyrics.lyricsPreviewSrc],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Lyrics shared by ${username}`,
      images: [sharedLyrics.lyricsPreviewSrc],
    },
  };
}

export default async function SharedLyricsPage({
  params,
}: {
  params: { shareId: string };
}) {
  const { shareId } = await params;

  const sharedLyrics: any = await fetchSharedLyrics(shareId);

  if (!sharedLyrics.data)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="max-w-xl mx-auto p-6 bg-black border border-white rounded-lg shadow-lg">
          <div className="text-center">
            <Frown size="100" className="text-white mx-auto mb-4" />
            <p className={`text-gray-400 mb-4 ${geo.className}`}>
              This link is no longer available
            </p>
            <a
              href={"/"}
              className={`inline-flex items-center gap-2 ${defaultButtonStyle} ${geo.className}`}
            >
              Go Home
            </a>
          </div>
        </div>
      </div>
    );

  const videoId = sharedLyrics.data.videoId;
  const lyricsPageUrl = `/song/${videoId}`;
  const youtubeMusicUrl = `https://music.youtube.com/watch?v=${videoId}`;

  return (
    <div className="min-h-screen">
      <div className="max-w-xl mx-auto p-6 rounded-lg shadow-lg">
        <div className="border border-white rounded p-4 mb-6">
          <img
            src={sharedLyrics.data.lyricsPreviewSrc}
            alt="Shared lyrics preview"
            className="w-full h-auto"
          />
        </div>

        <p className={`text-gray-400 mb-6 ${geo.className}`}>
          Shared by: {sharedLyrics.data.user?.username || "Anonymous"}
        </p>

        <div className="flex flex-col gap-3 mb-6">
          <a
            href={youtubeMusicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full flex items-center justify-center gap-2 px-4 py-2 border border-red-500 bg-black text-red-500 font-semibold hover:bg-red-500 hover:text-white transition ${geo.className}`}
          >
            <Music size={16} />
            Listen on YouTube Music
          </a>

          <a
            href={lyricsPageUrl}
            className={`w-full flex items-center justify-center gap-2 ${defaultButtonStyle} ${geo.className}`}
          >
            <ExternalLink size={16} />
            See on LyricSnips
          </a>
        </div>

        <div className={`text-xs text-gray-500 ${geo.className}`}>
          This page is optimized for link previews and sharing.
        </div>
      </div>
    </div>
  );
}
