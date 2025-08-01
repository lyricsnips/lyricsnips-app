import LyricCard from "./LyricCard";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface Song {
  videoId: string;
  album: { name: string };
  artists: { name: string }[];
  duration: string;
  isExplicit: boolean;
  thumbnails: { url: string }[];
  title: string;
  timesShared: number;
  lyrics: undefined | [];
}

export default function SongCard({
  song,
  handlePlay,
}: {
  song: Song;
  handlePlay: (videoId: string) => void;
}) {
  const [currentLyricIndex, setCurrentLyricIndex] = useState(0);

  const thumbnail =
    song.thumbnails && Array.isArray(song.thumbnails)
      ? song.thumbnails[song.thumbnails.length - 1]?.url
      : "";

  let artistNames;

  if (Array.isArray(song.artists)) {
    artistNames = song.artists.map((a) => a.name).join(", ");
  } else {
    artistNames = song.artists;
  }

  const lyrics: any = song.lyrics || [];
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
                          (lyricObject: any) => {
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
        <img
          src={thumbnail}
          alt={song.title}
          width={60}
          height={60}
          className="rounded"
        />
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
