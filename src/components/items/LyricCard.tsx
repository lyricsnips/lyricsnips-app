import { useSelectedLyrics } from "@/contexts/SelectedLyricsContext";
import { Special_Gothic_Expanded_One } from "next/font/google";

const gothic = Special_Gothic_Expanded_One({
  weight: ["400"],
  subsets: ["latin", "latin-ext"],
});

interface SongInfo {
  videoId: string;
  title: string;
  author: string;
  thumbnails: Array<{ url: string }>;
  duration?: string;
  isExplicit?: boolean;
  timesShared?: number;
}

interface CustomizeSettings {
  backgroundColor: string;
  fontFamily: string;
  textColor: string;
}

interface LyricCardProps {
  songInfo: SongInfo;
  settings: CustomizeSettings;
  lyricCardRef: React.RefObject<HTMLDivElement>;
}

export default function LyriCard({
  songInfo,
  settings,
  lyricCardRef,
}: LyricCardProps) {
  const { selectedLyrics } = useSelectedLyrics();

  // Dynamic font size based on number of lyrics and total words
  const getFontSize = () => {
    const lyricCount = selectedLyrics.length;
    const totalWords = selectedLyrics.reduce((total, lyric) => {
      return total + lyric.text.split(" ").length;
    }, 0);

    // Consider both lyric count and word count
    const complexity = lyricCount * totalWords;

    switch (true) {
      case complexity <= 10: // 1-2 short lyrics
        return "36px";
      case complexity <= 20: // 2-3 short lyrics or 1 long lyric
        return "32px";
      case complexity <= 35: // 3-4 short lyrics or 2 medium lyrics
        return "28px";
      case complexity <= 50: // 4-5 short lyrics or 3 medium lyrics
        return "24px";
      case complexity <= 70: // 5+ short lyrics or 4+ medium lyrics
        return "20px";
      default: // Very complex content
        return "18px";
    }
  };

  return (
    <div
      className="flex flex-col gap-4 p-6 w-[600px] h-[400px]"
      ref={lyricCardRef}
      style={{
        backgroundColor: settings.backgroundColor,
      }}
    >
      {/* Lyric Container - Takes up most of the space */}
      <div className="lyric-container flex flex-col gap-3 flex-1 justify-center">
        {selectedLyrics.map((lyric, index) => {
          return (
            <span
              key={index}
              style={{
                color: settings.textColor,
                fontFamily: settings.fontFamily,
                fontSize: getFontSize(), // Use dynamic font size
                lineHeight: "1.3",
                fontWeight: "500",
                textAlign: "left",
                wordWrap: "break-word",
                overflowWrap: "break-word",
              }}
            >
              {lyric.text}
            </span>
          );
        })}
      </div>

      {/* Footer - Fixed at bottom */}
      <div>
        {/* Author and song title */}
        <p
          className={`font-bold text-lg ${gothic.className}`}
          style={{
            color: settings.textColor,
          }}
        >
          {songInfo.title}
        </p>
        <p
          className="opacity-70 text-sm"
          style={{
            color: settings.textColor,
          }}
        >
          {songInfo.author}
        </p>
      </div>
    </div>
  );
}
