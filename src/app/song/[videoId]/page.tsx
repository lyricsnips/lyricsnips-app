"use client";

import {
  X,
  Share,
  Play,
  Pause,
  RotateCcw,
  Pointer,
  PointerOff,
  Sparkle,
} from "lucide-react";
import { useSession } from "next-auth/react";
import React from "react";
import { defaultButtonStyle, closeButtonStyle } from "@/styles/Buttons";
import { useRef, useEffect, useState, useCallback } from "react";
import YoutubePlayer from "youtube-player";
import LyricsList from "@/components/items/LyricsList";
import ShareModal from "@/components/features/ShareModal";
import { useSelectedLyrics } from "@/contexts/SelectedLyricsContext";
import { getLyrics } from "@/adapters/YTAdapter";
import { Special_Gothic_Expanded_One } from "next/font/google";
import { useAuthModal } from "@/contexts/AuthModalContext";
import AskChatBot from "@/components/features/AskChatbox";
import type YouTubePlayer from "youtube-player";
import { useSearchParams } from "next/navigation";

const gothic = Special_Gothic_Expanded_One({
  weight: ["400"],
  subsets: ["latin", "latin-ext"],
});

interface Lyric {
  id: string;
  text: string;
  start_time: number;
  end_time: number;
}

interface SongInfo {
  videoId: string;
  title: string;
  author: string;
  thumbnails: Array<{ url: string }>;
  duration?: string;
  isExplicit?: boolean;
  timesShared?: number;
}

// Custom hook for auto-scroll management
const useAutoScroll = (currentLyric: Lyric | null) => {
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  const [userHasScrolled, setUserHasScrolled] = useState(false);
  const [lastUserInteraction, setLastUserInteraction] = useState(0);
  const { selectedLyrics } = useSelectedLyrics();

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

export default function SongPage({
  params,
}: {
  params: Promise<{ videoId: string }>;
}) {
  const { data: session } = useSession();
  const { openModal } = useAuthModal();
  const { videoId } = React.use(params);
  const searchParams = useSearchParams();
  const [songInfo, setSongInfo] = useState<SongInfo>({} as SongInfo);
  const [lyrics, setLyrics] = useState<Lyric[] | null>(null);
  const [currentLyric, setCurrentLyric] = useState<Lyric | null>(null);
  const [playerStatus, setPlayerStatus] = useState<number | undefined>(
    undefined
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const { selectedLyrics, setSelectedLyrics } = useSelectedLyrics();
  const playerRef = useRef<HTMLDivElement>(null);
  const playerInstanceRef = useRef<ReturnType<typeof YouTubePlayer> | null>(
    null
  );
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [isAsking, setAsking] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [playerError, setPlayerError] = useState<string | null>(null);
  const [showCopyrightAlert, setShowCopyrightAlert] = useState(false);

  // Auto-scroll hook
  const { handleUserScroll } = useAutoScroll(currentLyric);

  // Effect 1: Fetch lyrics and set up YouTube player when videoId changes
  useEffect(() => {
    setIsLoading(true);
    setPlayerError(null); // Clear any previous errors
    setShowCopyrightAlert(false); // Reset copyright alert

    // Get song information from URL parameters
    const getSongInfo = () => {
      const title = searchParams.get("title");
      const author = searchParams.get("author");

      if (title && author) {
        setSongInfo({
          videoId,
          title,
          author,
          thumbnails: [],
          duration: undefined,
          isExplicit: false,
          timesShared: 0,
        });
      } else {
        setSongInfo({
          videoId,
          title: "Loading...",
          author: "Loading...",
          thumbnails: [],
          duration: undefined,
          isExplicit: false,
          timesShared: 0,
        });
      }
    };

    let isMounted = true;
    const playerDiv = playerRef.current;

    // Fetch lyrics and set up player instance
    const fetchLyricsAndSetupPlayer = async () => {
      const res = await getLyrics(videoId);

      if (!isMounted) return;

      if (!res.data) {
        setLyrics([]);
      } else {
        const allLyrics: {
          hasTimestamps: boolean;
          lyrics: Array<Lyric>;
          source: "Source: Musixmatch";
        } = res.data;

        setLyrics(allLyrics.lyrics);
      }

      if (playerDiv) {
        // Create YouTube player instance with additional parameters
        playerInstanceRef.current = YoutubePlayer(playerDiv, {
          width: "100%",
          height: "100%",
          playerVars: {
            // Add these parameters to help with domain restrictions and copyrighted content
            origin: window.location.origin,
            enablejsapi: 1,
            rel: 0,
            modestbranding: 1,
            controls: 0,
            disablekb: 1,
            fs: 0,
            iv_load_policy: 3,
            showinfo: 0,
            autoplay: 0,
            // mute: 1, // Start muted to avoid autoplay restrictions
            playsinline: 1, // Better mobile compatibility
            // Additional parameters to help with copyright restrictions
            cc_load_policy: 0, // Disable closed captions
            color: "white", // Player color
            hl: "en", // Language
            loop: 0, // Don't loop
            playlist: videoId, // Explicit playlist
            // Add these parameters for better compatibility
            widget_referrer: window.location.origin,
            enablejsapi: 1,
            version: 3,
          },
        });

        // Wait for the player to be ready before loading the video
        playerInstanceRef.current?.on("ready", () => {
          playerInstanceRef.current?.loadVideoById(videoId);
        });

        // Listen for player state changes (e.g., play, pause)
        playerInstanceRef.current?.on(
          "stateChange",
          (state: { data: number }) => {
            setPlayerStatus(state.data);
            setIsPlaying(state.data === 1); // 1 = playing
          }
        );

        // Add error handling for restricted content
        playerInstanceRef.current?.on("error", (event: { data: number }) => {
          console.error("YouTube player error:", event.data);
          // Handle different error codes
          switch (event.data) {
            case 2: // Invalid video ID
              console.error("Invalid video ID");
              setPlayerError("Invalid video ID");
              break;
            case 5: // HTML5 player error
              console.error("HTML5 player error");
              setPlayerError("Player error occurred");
              break;
            case 100: // Video not found
              console.error("Video not found");
              setPlayerError("Video not found");
              break;
            case 101: // Video not embeddable
            case 150: // Video not embeddable
              console.error(
                "Video not embeddable - likely copyrighted content"
              );
              setShowCopyrightAlert(true);
              setPlayerError(null); // Clear any other errors
              break;
            default:
              console.error("Unknown YouTube player error");
              setPlayerError("An error occurred while loading the video");
          }
        });
      }
      setIsLoading(false);
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
  }, [videoId, searchParams]);

  // Effect 2: Sync lyrics with video playback when player is playing
  useEffect(() => {
    // Clear any previous interval
    if (intervalRef.current) clearInterval(intervalRef.current);

    // Only start syncing if player is playing, lyrics are loaded, and player exists
    if (playerStatus === 1 && lyrics?.length > 0 && playerInstanceRef.current) {
      intervalRef.current = setInterval(async () => {
        const currentTime = await playerInstanceRef.current?.getCurrentTime();
        if (!currentTime) return;

        const foundLyric: Lyric | undefined = lyrics.find((lyric: Lyric) => {
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
          setCurrentLyric((prev: Lyric | null) => {
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
      playerInstanceRef.current.seekTo(0, true);
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

  const handleAskClick = () => {
    if (session) {
      setAsking(true);
    } else {
      openModal("signup");
    }
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
      <div className="h-full flex flex-col bg-black">
        <div className="flex border-b-1 overflow-hidden items-center justify-center h-fit p-2 relative">
          {/* Background Player - always show but with disabled styling */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div
              className={`${
                showCopyrightAlert
                  ? "opacity-30 grayscale blur-lg" // More faded when disabled
                  : "opacity-50 grayscale blur-lg"
              }`}
              style={{
                width: "calc(100vw + 600px)",
                height: "calc(100vh + 600px)",
              }}
              ref={playerRef}
            ></div>
          </div>

          {/* Foreground content - positioned relatively */}
          <div className="relative z-10 flex flex-col justify-center items-center gap-3">
            <div className="w-full text-nowrap">
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

            {/* Error Message Display */}
            {playerError && (
              <div className="w-full max-w-md mx-auto p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-red-400 text-sm font-medium">
                    Player Error
                  </span>
                </div>
                <p className="text-red-300 text-sm leading-relaxed">
                  {playerError}
                </p>
              </div>
            )}

            {/* Copyright Overlay - semi-transparent overlay */}
            {showCopyrightAlert && (
              <div className=" inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-2 max-w-xs pointer-events-auto">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-red-400 text-sm font-medium">
                      Copyright Restricted
                    </span>
                  </div>
                  <p className="text-red-300 text-xs leading-relaxed">
                    Audio disabled due to copyright restrictions. Lyrics
                    selection still available.
                  </p>
                </div>
              </div>
            )}

            {/* Controls Container - always show but disable when copyright restricted */}
            <div className="flex flex-row items-center">
              {/* Restart Control */}
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={handleRestart}
                  disabled={showCopyrightAlert}
                  className={`backdrop-blur-sm rounded-full p-3 transition-all duration-200 hover:scale-105 ${
                    showCopyrightAlert
                      ? "bg-gray-600/20 text-gray-400 cursor-not-allowed opacity-50"
                      : "bg-white/10 hover:bg-white/20"
                  }`}
                  title={
                    showCopyrightAlert
                      ? "Disabled - Copyright restricted"
                      : "Restart song"
                  }
                >
                  <RotateCcw size={18} />
                </button>
                <span className="text-xs text-gray-400 w-16 text-center">
                  Restart
                </span>
              </div>

              {/* Play/Pause Control */}
              <div className="flex flex-col items-center gap-2 mx-4">
                <button
                  onClick={handlePlayPause}
                  disabled={showCopyrightAlert}
                  className={`backdrop-blur-sm rounded-full p-4 transition-all duration-200 hover:scale-105 ${
                    showCopyrightAlert
                      ? "bg-gray-600/20 text-gray-400 cursor-not-allowed opacity-50"
                      : "bg-white/10 hover:bg-white/20"
                  }`}
                  title={
                    showCopyrightAlert
                      ? "Disabled - Copyright restricted"
                      : isPlaying
                      ? "Pause"
                      : "Play"
                  }
                >
                  {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </button>
                <span className="text-xs text-gray-400 w-16 text-center">
                  {isPlaying ? "Pause" : "Play"}
                </span>
              </div>

              {/* Selection Mode Control - always enabled */}
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={toggleNavigationMode}
                  className={`backdrop-blur-sm rounded-full p-3 transition-all duration-200 hover:scale-105 ${
                    isSelecting
                      ? "bg-blue-500/20 hover:bg-blue-500/30"
                      : "bg-white/10 hover:bg-white/20"
                  }`}
                  title="Toggle selection mode"
                >
                  {isSelecting ? (
                    <PointerOff size={18} />
                  ) : (
                    <Pointer size={18} />
                  )}
                </button>
                <span className="text-xs text-gray-400 w-16 text-center">
                  {isSelecting ? "Exit" : "Select"}
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
            <p className="text-gray-400 text-sm">Source: Musixmatch</p>
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
              className={`${defaultButtonStyle}`}
              onClick={handleAskClick}
            >
              <Sparkle
                size="20"
                className={session ? "white" : "text-gray-500"}
              />
              <span className={session ? "white" : "text-gray-500 "}>Ask</span>
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
