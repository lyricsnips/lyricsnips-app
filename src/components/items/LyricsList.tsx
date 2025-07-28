"use client";

import { useSelectedLyrics } from "../../contexts/SelectedLyricsContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Lyric from "./Lyric";

interface LyricsListProps {
  lyrics: any;
  currentLyric: any;
  onUserScroll?: () => void;
  playerInstanceRef: any;
  isSelecting: boolean;
}

export default function LyricsList({
  lyrics,
  currentLyric,
  onUserScroll,
  playerInstanceRef,
  isSelecting,
}: LyricsListProps) {
  const [alert, setAlert] = useState("");
  const { selectedLyrics, setSelectedLyrics } = useSelectedLyrics();
  const router = useRouter();

  const handleSelect = (lyric: any) => {
    setAlert("");

    if (selectedLyrics.length === 0) {
      setSelectedLyrics([lyric]);
      return;
    }

    const lyricIds = selectedLyrics.map((lyric: any) => lyric.id);
    let min, max;

    min = Math.min(...lyricIds);
    max = Math.max(...lyricIds);

    if (
      lyric.id === max ||
      lyric.id === min ||
      selectedLyrics.some((curr: any) => curr.id === lyric.id)
    ) {
      setAlert("Cannot select same lyric twice");
      return;
    }

    if (lyric.id === max + 1 && selectedLyrics.length < 5) {
      setSelectedLyrics([...selectedLyrics, lyric]);
    } else if (lyric.id === min - 1 && selectedLyrics.length < 5) {
      setSelectedLyrics([lyric, ...selectedLyrics]);
    } else {
      setSelectedLyrics([lyric]);
      setAlert("Please select up to 5 contiguous lyrics");
    }
  };

  const handleScroll = () => {
    if (onUserScroll) {
      onUserScroll();
    }
  };

  if (lyrics?.length === 0) {
    return <div className="text-gray-500">Loading...</div>;
  }

  if (lyrics === null) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">No lyrics available for this song</p>
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
        >
          Go Home
        </button>
      </div>
    );
  }

  const handleClick = (lyric: any) => {
    if (playerInstanceRef.current && playerInstanceRef.current.getPlayerState) {
      try {
        // Convert milliseconds to seconds
        const seekTime = lyric.start_time / 1000;
        playerInstanceRef.current.seekTo(seekTime);

        // Optionally start playing if paused
        const playerState = playerInstanceRef.current.getPlayerState();
        if (playerState !== 1) {
          // 1 = playing
          playerInstanceRef.current.playVideo();
        }
      } catch (error) {
        console.error("Error seeking to lyric:", error);
      }
    }
  };

  return (
    <>
      {selectedLyrics.length > 0 && <p>{alert}</p>}
      {lyrics && (
        <div
          className="flex flex-col items-center text-center px-4 pb-20"
          onScroll={handleScroll}
          onWheel={handleScroll}
          onTouchMove={handleScroll}
        >
          {lyrics.map((lyric: any) => (
            <div
              key={lyric.id}
              id={`lyric-${lyric.id}`}
              className={`lyric-item ${
                currentLyric?.id === lyric.id ? "active" : ""
              }`}
            >
              <Lyric
                lyric={lyric}
                active={currentLyric?.id === lyric.id}
                selected={selectedLyrics.some(
                  (curr: any) => curr.id === lyric.id
                )}
                handleSelect={handleSelect}
                handleClick={handleClick}
                isSelecting={isSelecting}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
