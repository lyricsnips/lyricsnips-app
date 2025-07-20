import { fetchSharedLyrics } from "@/adapters/lyricAdapter";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { shareId: string };
}): Promise<Metadata> {
  const { shareId } = params;
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

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-10">
      <h1 className="text-2xl font-bold mb-4">LyricSnips</h1>
      <p className="text-gray-500 mb-2">
        Shared by: {sharedLyrics.data.user?.username || "Anonymous"}
      </p>
      {/* Render shared lyrics here */}
      <div className="bg-gray-100 rounded p-4 mb-4">
        {/* Example placeholder */}
        <img src={sharedLyrics.data.lyricsPreviewSrc} alt="" />
      </div>
      <div className="text-xs text-gray-400">
        This page is optimized for link previews and sharing.
      </div>
    </div>
  );
}
