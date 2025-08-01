"use client";

import {
  X,
  Share,
  Play,
  Pause,
  RotateCcw,
  TextSelectIcon,
  Pointer,
  PointerOff,
  Sparkle,
} from "lucide-react";
import { defaultButtonStyle, closeButtonStyle } from "@/styles/Buttons";
import { useRef, useEffect, use, useState, useCallback } from "react";
import YoutubePlayer from "youtube-player";
import LyricsList from "@/components/items/LyricsList";
import ShareModal from "@/components/features/ShareModal";
import { useSelectedLyrics } from "@/contexts/SelectedLyricsContext";
import { getLyrics } from "@/adapters/YTAdapter";
import { getSong } from "@/adapters/YTAdapter";
import { Special_Gothic_Expanded_One } from "next/font/google";
import AskChatBot from "@/components/features/AskChatbox";

const gothic = Special_Gothic_Expanded_One({
  weight: ["400"],
});

// Custom hook for auto-scroll management
const useAutoScroll = (currentLyric: any) => {
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  const [userHasScrolled, setUserHasScrolled] = useState(false);
  const [lastUserInteraction, setLastUserInteraction] = useState(0);
  const { selectedLyrics, setSelectedLyrics } = useSelectedLyrics();

  // Auto-resume after 3 seconds
  useEffect(() => {
    if (userHasScrolled && selectedLyrics.length === 0) {
      const timer = setTimeout(() => {
        setUserHasScrolled(false);
        setAutoScrollEnabled(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [lastUserInteraction, userHasScrolled, selectedLyrics]);

  // Scroll to current lyric
  useEffect(() => {
    if (!autoScrollEnabled || !currentLyric) return;

    const lyricElement = document.getElementById(`lyric-${currentLyric.id}`);
    if (lyricElement) {
      lyricElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentLyric, autoScrollEnabled]);

  const handleUserScroll = useCallback(() => {
    setUserHasScrolled(true);
    setAutoScrollEnabled(false);
    setLastUserInteraction(Date.now());
  }, []);

  return { autoScrollEnabled, handleUserScroll };
};

export default function SongPage({ params }: { params: any }) {
  const { videoId } = use<any>(params);
  const [songInfo, setSongInfo] = useState<any>({});
  const [lyrics, setLyrics] = useState<any>([]);
  const [currentLyric, setCurrentLyric] = useState<any>(null);
  const [playerStatus, setPlayerStatus] = useState<number | undefined>(
    undefined
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const { selectedLyrics, setSelectedLyrics } = useSelectedLyrics();
  const playerRef = useRef<HTMLDivElement>(null);
  const playerInstanceRef = useRef<any>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [isAsking, setAsking] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  // Auto-scroll hook
  const { handleUserScroll } = useAutoScroll(currentLyric);

  // Effect 1: Fetch lyrics and set up YouTube player when videoId changes
  useEffect(() => {
    setSelectedLyrics([]);
    setIsLoading(true); // Set loading to true when starting

    // Get song information
    const getSongInfo = async () => {
      const res = await getSong(videoId);
      if (res.data) {
        setSongInfo(res.data);
      }
    };

    let isMounted = true;
    const playerDiv = playerRef.current;

    // Fetch lyrics and set up player instance
    const fetchLyricsAndSetupPlayer = async () => {
      const res = await getLyrics(videoId);
      if (!isMounted) return;

      if (!res.data) {
        setLyrics(null);
      } else {
        setLyrics(res.data.lyrics);
      }

      if (playerDiv) {
        // Create YouTube player instance
        playerInstanceRef.current = YoutubePlayer(playerDiv);

        // Wait for the player to be ready before loading the video
        playerInstanceRef.current.on("ready", () => {
          playerInstanceRef.current.loadVideoById(videoId);
        });

        // Listen for player state changes (e.g., play, pause)
        playerInstanceRef.current.on("stateChange", (state: any) => {
          setPlayerStatus(state.data);
          setIsPlaying(state.data === 1); // 1 = playing
        });
      }
      setIsLoading(false); // Set loading to false when done
    };

    fetchLyricsAndSetupPlayer();
    getSongInfo();

    // Cleanup: destroy player, clear interval, prevent state updates after unmount
    return () => {
      isMounted = false;
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (playerInstanceRef.current) {
        playerInstanceRef.current.destroy();
        playerInstanceRef.current = null;
      }
    };
  }, [videoId]);

  // Effect 2: Sync lyrics with video playback when player is playing
  useEffect(() => {
    // Clear any previous interval
    if (intervalRef.current) clearInterval(intervalRef.current);

    // Only start syncing if player is playing, lyrics are loaded, and player exists
    if (playerStatus === 1 && lyrics?.length > 0 && playerInstanceRef.current) {
      intervalRef.current = setInterval(async () => {
        const currentTime = await playerInstanceRef.current.getCurrentTime();

        const foundLyric: any = lyrics.find((lyric: any) => {
          const startTimeSeconds = lyric.start_time / 1000;
          const endTimeSeconds = lyric.end_time / 1000;
          return (
            currentTime >= startTimeSeconds && currentTime <= endTimeSeconds
          );
        });

        // Set lyric to null when last lyric is reached
        if (currentTime > lyrics[lyrics.length - 1].end_time / 1000) {
          setCurrentLyric(null);
        } else {
          // Only update if the lyric actually changed
          setCurrentLyric((prev: any) => {
            if (foundLyric && foundLyric.id !== prev?.id) {
              return foundLyric;
            }
            return prev;
          });
        }
      }, 100);
    }

    // Cleanup: clear the interval when effect dependencies change or component unmounts
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [playerStatus, lyrics]);

  const handlePlayPause = () => {
    if (playerInstanceRef.current) {
      if (isPlaying) {
        playerInstanceRef.current.pauseVideo();
      } else {
        playerInstanceRef.current.playVideo();
      }
    }
  };

  const handleRestart = () => {
    if (playerInstanceRef.current) {
      playerInstanceRef.current.seekTo(0);
      playerInstanceRef.current.playVideo();
    }
  };

  const onShare = async () => {
    setShowShareModal(true);
  };

  const onClear = () => {
    setSelectedLyrics([]);
  };

  const toggleNavigationMode = () => {
    setIsSelecting(!isSelecting);
  };

  // Skeleton component for title and author
  const TitleSkeleton = () => (
    <div className="w-full flex flex-col items-center gap-3">
      <div className="h-8 bg-gray-700/50 rounded animate-pulse w-3/4"></div>
      <div className="h-6 bg-gray-600/30 rounded animate-pulse w-1/2"></div>
    </div>
  );

  return (
    <>
      {showShareModal && (
        <ShareModal
          songInfo={songInfo}
          onClose={() => setShowShareModal(false)}
        />
      )}
      <div className="h-full flex flex-col">
        <div className="flex border-b-1 overflow-hidden items-center justify-center h-fit p-2 relative">
          {/* Background Player - positioned absolutely and centered */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div
              className="opacity-50 grayscale blur-sm scale-300"
              ref={playerRef}
            ></div>
          </div>

          {/* Foreground content - positioned relatively */}
          <div className="relative z-10 flex flex-col justify-center items-center gap-3">
            <div className="w-full">
              {isLoading ? (
                <TitleSkeleton />
              ) : (
                <>
                  <h2
                    className={`text-center ${gothic.className} text-2xl text-white`}
                  >
                    {songInfo?.title ?? "Unknown"}
                  </h2>
                  <h3
                    className={`text-center ${gothic.className} text-1xl text-gray-300`}
                  >
                    {songInfo?.author ?? "Unknown"}
                  </h3>
                </>
              )}
            </div>
            {/* Controls Container */}
            <div className="flex flex-row items-center">
              {/* Restart Control */}
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={handleRestart}
                  className="bg-white/10 backdrop-blur-sm rounded-full p-3 hover:bg-white/20 transition-all duration-200 hover:scale-105"
                  title="Restart song"
                >
                  <RotateCcw size={18} />
                </button>
                <span className="text-xs text-gray-400 w-16 text-center">
                  Restart
                </span>
              </div>

              {/* Play/Pause Control */}
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={handlePlayPause}
                  className="bg-white/20 backdrop-blur-sm rounded-full p-4 hover:bg-white/30 transition-all duration-200 hover:scale-105"
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </button>
                <span className="text-xs text-gray-400 w-16 text-center">
                  {isPlaying ? "Pause" : "Play"}
                </span>
              </div>

              {/* Lyric Selection Control */}
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={toggleNavigationMode}
                  className={`backdrop-blur-sm rounded-full p-3 transition-all duration-200 hover:scale-105 ${
                    isSelecting
                      ? "bg-red-500/20 hover:bg-red-500/30 text-red-400"
                      : "bg-white/10 hover:bg-white/20"
                  }`}
                  title={
                    isSelecting ? "Stop selecting lyrics" : "Select lyrics"
                  }
                >
                  {isSelecting ? (
                    <PointerOff size={18} />
                  ) : (
                    <Pointer size={18} />
                  )}
                </button>
                <span className="text-xs text-gray-400 w-16 text-center">
                  {isSelecting ? "Stop" : "Select"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto flex flex-col justify-start items-center gap-5 pb-20">
          <div className="w-full flex justify-center">
            <LyricsList
              lyrics={lyrics}
              currentLyric={currentLyric}
              onUserScroll={handleUserScroll}
              playerInstanceRef={playerInstanceRef}
              isSelecting={isSelecting}
            />
          </div>
          {lyrics && lyrics.length > 0 && (
            <p className="text-gray-400 text-sm">Lyrics by Youtube Music</p>
          )}
        </div>

        {selectedLyrics.length > 0 && !isAsking && (
          <div className="w-full flex gap-2 justify-center fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 ">
            <button
              type="button"
              onClick={onClear}
              className={closeButtonStyle}
            >
              <X />
              Clear
            </button>
            <button
              type="button"
              className={defaultButtonStyle}
              onClick={onShare}
            >
              <Share size="20" />
              Share
            </button>
            <button
              type="button"
              className={defaultButtonStyle}
              onClick={() => setAsking(true)}
            >
              <Sparkle size="20" />
              Ask
            </button>
          </div>
        )}
        {isAsking && (
          <AskChatBot
            setAsking={setAsking}
            songInfo={songInfo}
            lyrics={lyrics}
          />
        )}
      </div>
    </>
  );
}
