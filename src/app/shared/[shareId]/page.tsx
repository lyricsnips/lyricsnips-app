import { Metadata } from "next";
import { fetchSharedLyrics } from "@/adapters/lyricAdapter";
import { Frown, Music, ExternalLink, Image as ImageIcon } from "lucide-react";
import { Special_Gothic_Expanded_One } from "next/font/google";
import { defaultButtonStyle } from "@/styles/Buttons";
import Image from "next/image";

const gothic = Special_Gothic_Expanded_One({
  weight: ["400"],
  subsets: ["latin"],
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

interface SharedLyricsData {
  id: string;
  videoId: string;
  lyricsPreviewSrc: string;
  lyricsJson: unknown;
  createdAt: Date;
  user?: {
    id: string;
    username: string;
  } | null;
}

export default async function SharedLyricsPage({
  params,
}: {
  params: Promise<{ shareId: string }>;
}) {
  const { shareId } = await params;
  const sharedLyrics = await fetchSharedLyrics(shareId);

  const url = `/song/${sharedLyrics?.data?.videoId}?title=${sharedLyrics?.data?.title}&author=${sharedLyrics?.data?.author}&videoId=${sharedLyrics?.data?.videoId}`;

  if (!sharedLyrics.data) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <Frown className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Lyrics Not Found</h1>
          <p className="text-gray-400 mb-6">
            The shared lyrics you're looking for don't exist or have been
            removed.
          </p>
          <a
            href="/"
            className={`inline-flex items-center gap-2 ${defaultButtonStyle}`}
          >
            <Music className="h-4 w-4" />
            Find Other Songs
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-1">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className={`txt-xl font-bold mb-1 ${gothic.className}`}>
              Shared Lyrics
            </h1>
            <p className="text-sm  text-gray-400">
              Shared by {sharedLyrics.data.user.username || "Anonymous"}
            </p>
          </div>

          <div className="w-full flex flex-col  items-center">
            <div className="border w-fit h-fit border-white rounded p-4 mb-6">
              <Image
                src={sharedLyrics.data.lyricsPreviewSrc}
                alt="Shared lyrics preview"
                width={1200}
                height={600}
                className="w-full h-full"
              />
            </div>
          </div>

          <div className="text-center">
            <a
              href={url}
              className={`inline-flex items-center gap-2 ${defaultButtonStyle}`}
            >
              <ExternalLink className="h-4 w-4" />
              Listen to Song
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
