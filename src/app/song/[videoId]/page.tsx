"use client";

import { useRef, useEffect, use, useState } from "react";
import YoutubePlayer from "youtube-player";
import Player from "@/components/items/Player";
import LyricsList from "@/components/items/LyricsList";
import ShareModal from "@/components/features/ShareModal";
import LyricActionMenu from "@/components/menus/LyricActionMenu";
import { useSelectedLyrics } from "@/contexts/SelectedLyricsContext";
import { getLyrics } from "@/adapters/YTAdapter";
import { generateImage } from "@/adapters/lyricAdapter";
import { getSong } from "@/adapters/YTAdapter";

export default function SongPage({ params }: { params: any }) {
  const { videoId } = use<any>(params);
  const [songInfo, setSongInfo] = useState<any>({});
  const [lyrics, setLyrics] = useState<any>([]);
  const [currentLyric, setCurrentLyric] = useState(null);
  const [playerStatus, setPlayerStatus] = useState<number | undefined>(
    undefined
  );
  const { selectedLyrics, setSelectedLyrics } = useSelectedLyrics();
  const playerRef = useRef<HTMLDivElement>(null);
  const playerInstanceRef = useRef<any>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [sharedLyric, setSharedLyric] = useState<any>(null);

  // Effect 1: Fetch lyrics and set up YouTube player when videoId changes
  useEffect(() => {
    setSelectedLyrics([]);

    // Get song information
    const getSongInfo = async () => {
      const res = await getSong(videoId);
      setSongInfo(res.data.videoDetails);
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
        });
      }
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
        // Only update if the lyric actually changed
        setCurrentLyric((prev: any) => {
          if (foundLyric && foundLyric.id !== prev?.id) {
            return foundLyric;
          }
          return prev;
        });
      }, 50);
    }

    // Cleanup: clear the interval when effect dependencies change or component unmounts
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [playerStatus, lyrics]);

  const onShare = async () => {
    // Check if user is trying to share the same lyrics to limit amount of network requests
    for (let i = 0; i < selectedLyrics.length; i += 1) {
      const currSharedId = sharedLyric?.lyrics?.[i]?.id ?? null;
      if (selectedLyrics[i].id !== currSharedId) {
        const res: any = await generateImage({
          videoId,
          lyrics: selectedLyrics,
        });

        if (res.data) {
          setSharedLyric({
            lyrics: selectedLyrics,
            imageUrl: res.data.lyrics_preview_src,
            shareURL: `${process.env.NEXT_PUBLIC_BASE_URL}/shared-lyrics/${res.data.id}`,
          });
        }

        break;
      }
    }

    setShowShareModal(true);
  };

  const onClear = () => {
    setSelectedLyrics([]);
  };

  return (
    <div>
      {showShareModal && (
        <ShareModal
          songInfo={sharedLyric}
          onClose={() => setShowShareModal(false)}
          onShare={onShare}
        />
      )}
      <h1>{songInfo.title}</h1>
      <Player playerRef={playerRef}></Player>
      <LyricsList lyrics={lyrics} currentLyric={currentLyric} />
      {selectedLyrics.length > 0 && (
        <LyricActionMenu onClear={onClear} onShare={onShare}></LyricActionMenu>
      )}
    </div>
  );
}
