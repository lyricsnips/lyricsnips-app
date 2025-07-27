import LyricCard from "./LyricCard";
import { Play } from "lucide-react";

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
  return (
    <div className="border-b-1">
      <div className="overflow-hidden whitespace-nowrap w-full">
        <ul className="inline-flex animate-scroll list-none m-0 p-0">
          {song.lyrics &&
            song.lyrics.length !== 0 &&
            song.lyrics.map((lyricInfo: any) => {
              return (
                <li key={lyricInfo.id} className="flex-shrink-0 mr-4">
                  <LyricCard lyricInfo={lyricInfo} />
                </li>
              );
            })}
          {song.lyrics &&
            song.lyrics.length !== 0 &&
            song.lyrics.map((lyricInfo: any) => {
              return (
                <li key={lyricInfo.id} className="flex-shrink-0 mr-4">
                  <LyricCard lyricInfo={lyricInfo} />
                </li>
              );
            })}
        </ul>
      </div>
      <div className="flex items-center gap-4 p-4">
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
