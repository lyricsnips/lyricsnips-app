import {
  Play,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
} from "lucide-react";
import { useState } from "react";
import Image from "next/image";

interface LyricObject {
  id: string;
  text: string;
}

interface LyricData {
  id: string;
  lyricsJson: LyricObject[];
  username?: string;
}

interface Song {
  videoId: string;
  album?: { name: string };
  artists: Array<{ id: string; name: string }>;
  duration: string;
  isExplicit: boolean;
  thumbnails: { url: string }[];
  title: string;
  timesShared: number;
  lyrics?: LyricData[] | undefined;
}

export default function SongCard({
  song,
  handlePlay,
}: {
  song: Song;
  handlePlay: (videoId: string) => void;
}) {
  const [currentLyricIndex, setCurrentLyricIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  let thumbnail;
  let isStringThumbnail = false;

  if (Array.isArray(song.thumbnails)) {
    thumbnail = song.thumbnails[song.thumbnails.length - 1]?.url;
    isStringThumbnail = false;
  } else {
    thumbnail = song.thumbnails ?? "";
    isStringThumbnail = true;
  }

  let artistNames;

  if (Array.isArray(song.artists)) {
    artistNames = song.artists.map((a) => a.name).join(", ");
  } else {
    artistNames = song.artists;
  }

  const lyrics: LyricData[] = song.lyrics || [];
  const totalLyrics = lyrics.length;

  const nextLyric = () => {
    setCurrentLyricIndex((prev) => (prev + 1) % totalLyrics);
  };

  const prevLyric = () => {
    setCurrentLyricIndex((prev) => (prev - 1 + totalLyrics) % totalLyrics);
  };

  return (
    <div className="border flex flex-col items-center justify-center">
      {/* Lyrics container */}
      {totalLyrics > 0 && (
        <div className="relative w-full">
          <div className="overflow-hidden">
            <div className="flex transition-transform duration-300 ease-in-out">
              <div className="w-full flex-shrink-0">
                {lyrics[currentLyricIndex] && (
                  <div className="flex flex-col gap-1 p-5 justify-center items-center bg-white">
                    <div key={lyrics[currentLyricIndex].id}>
                      <div className="flex flex-col">
                        {lyrics[currentLyricIndex].lyricsJson.map(
                          (lyricObject: LyricObject) => {
                            return (
                              <span key={lyricObject.id} className="text-black">
                                {lyricObject.text}
                              </span>
                            );
                          }
                        )}
                      </div>
                    </div>
                    <p className="text-sm mt-2  text-gray-500 w-full text-black text-center">
                      Shared by:{" "}
                      {lyrics[currentLyricIndex].username || "Anonymous"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {totalLyrics > 1 && (
            <>
              <button
                onClick={prevLyric}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                aria-label="Previous lyric"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={nextLyric}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                aria-label="Next lyric"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}
        </div>
      )}

      <div className="flex items-center gap-4 p-4 w-full">
        {thumbnail && !imageError ? (
          <div
            className={`w-[60px] h-[60px] overflow-hidden rounded ${
              isStringThumbnail ? "flex items-center justify-center" : ""
            }`}
          >
            <Image
              src={thumbnail}
              alt={song.title}
              width={60}
              height={60}
              className={`rounded ${
                isStringThumbnail ? "object-cover w-full h-full" : ""
              }`}
              onError={() => setImageError(true)}
            />
          </div>
        ) : (
          <div className="w-[60px] h-[60px] bg-gray-800 flex items-center justify-center border border-gray-600 rounded">
            <ImageIcon className="w-8 h-8 text-gray-400" />
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">{song.title}</h3>
            {song.isExplicit && (
              <span className="text-xs bg-red-500 text-white px-2 py-0.5">
                Explicit
              </span>
            )}
          </div>
          <div className="text-sm text-gray-600">{artistNames}</div>
          {song.timesShared > 0 && (
            <div className="text-xs text-gray-500">
              Shared: {song.timesShared} times
            </div>
          )}
        </div>
        <button
          className="cursor-pointer"
          onClick={() => handlePlay(song.videoId)}
        >
          <Play />
        </button>
      </div>
    </div>
  );
}
