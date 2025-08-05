"use client";

import { useSelectedLyrics } from "@/contexts/SelectedLyricsContext";
import { defaultButtonStyle } from "@/styles/Buttons";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Lyric from "./Lyric";
import { X } from "lucide-react";
import type YouTubePlayer from "youtube-player";

interface Lyric {
  id: string;
  text: string;
  start_time: number;
  end_time: number;
}

interface LyricsListProps {
  lyrics: Lyric[];
  currentLyric: Lyric | null;
  onUserScroll?: () => void;
  playerInstanceRef: React.RefObject<ReturnType<typeof YouTubePlayer> | null>;
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
  const [showAlert, setShowAlert] = useState(false);
  const { selectedLyrics, setSelectedLyrics } = useSelectedLyrics();
  const router = useRouter();

  useEffect(() => {
    setSelectedLyrics([]);
  }, []);

  // Auto-dismiss alert after 3 seconds
  useEffect(() => {
    if (alert && showAlert) {
      const timer = setTimeout(() => {
        setShowAlert(false);
        setAlert("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [alert, showAlert]);

  const handleSelect = (lyric: Lyric) => {
    setAlert("");

    if (selectedLyrics.length === 0) {
      setSelectedLyrics([lyric]);
      return;
    }

    const lyricIds = selectedLyrics.map((lyric: Lyric) => parseInt(lyric.id));
    const min = Math.min(...lyricIds);
    const max = Math.max(...lyricIds);

    if (
      parseInt(lyric.id) === max ||
      parseInt(lyric.id) === min ||
      selectedLyrics.some((curr: Lyric) => curr.id === lyric.id)
    ) {
      setAlert("Cannot select same lyric twice");
      setShowAlert(true);
      return;
    }

    if (parseInt(lyric.id) === max + 1 && selectedLyrics.length < 5) {
      setSelectedLyrics([...selectedLyrics, lyric]);
    } else if (parseInt(lyric.id) === min - 1 && selectedLyrics.length < 5) {
      setSelectedLyrics([lyric, ...selectedLyrics]);
    } else {
      setSelectedLyrics([lyric]);
      setAlert("Please select up to 5 contiguous lyrics");
      setShowAlert(true);
    }
  };

  const handleScroll = () => {
    if (onUserScroll) {
      onUserScroll();
    }
  };

  const dismissAlert = () => {
    setShowAlert(false);
    setAlert("");
  };

  if (lyrics === null) {
    return (
      <div className="flex flex-col items-center text-center py-8">
        <p className="text-gray-300 mb-4">No lyrics available for this song</p>
        <button
          onClick={() => router.push("/")}
          className={`px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none ${defaultButtonStyle}`}
        >
          Find Other Songs
        </button>
      </div>
    );
  }

  // Show skeleton when lyrics is undefined or empty
  if (!lyrics || lyrics.length === 0) {
    return (
      <div className="flex flex-col items-center  gap-10 w-full max-w-2xl p-4">
        {[...Array(10)].map((_, index) => (
          <div key={index} className="w-full flex flex-col items-center gap-2">
            <div className="h-6 bg-gray-700/50 rounded animate-pulse mb-2 w-full"></div>
            <div className="h-4 bg-gray-600/30 rounded animate-pulse w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  const handleClick = async (lyric: Lyric) => {
    if (playerInstanceRef.current && playerInstanceRef.current.getPlayerState) {
      try {
        // Convert milliseconds to seconds
        const seekTime = lyric.start_time / 1000;
        playerInstanceRef.current.seekTo(seekTime, true);

        // Optionally start playing if paused
        const playerState = await playerInstanceRef.current.getPlayerState();
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
      {/* Alert Box - positioned at bottom of page */}
      {showAlert && alert && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 max-w-sm">
            <div className="flex-1">
              <p className="text-sm font-medium">{alert}</p>
            </div>
            <button
              onClick={dismissAlert}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {lyrics && lyrics.length > 0 && (
        <div
          className="flex flex-col items-center text-center"
          onScroll={handleScroll}
          onWheel={handleScroll}
          onTouchMove={handleScroll}
        >
          {lyrics.map((lyric: Lyric) => (
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
