"use client";

import { useRef, useEffect, use, useState } from "react";
import YoutubePlayer from "youtube-player";
import LyricsList from "@/components/items/LyricsList";
import { getLyrics } from "@/adapters/YTAdapter";

export default function SongPage({ params }: { params: any }) {
  const { videoId } = use(params);
  const [lyrics, setLyrics] = useState([]);
  const [currentLyric, setCurrentLyric] = useState(null);
  const [playerStatus, setPlayerStatus] = useState<number | undefined>(
    undefined
  );
  const playerRef = useRef<HTMLDivElement>(null);
  const playerInstanceRef = useRef<any>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch lyrics and set up player
  useEffect(() => {
    let isMounted = true;
    const playerDiv = playerRef.current;

    const fetchLyricsAndSetupPlayer = async () => {
      const res = await getLyrics(videoId);
      if (!isMounted) return;
      setLyrics(res.data.lyrics);

      if (playerDiv && res.data.lyrics.length > 0) {
        playerInstanceRef.current = YoutubePlayer(playerDiv);

        // Wait for the player to be ready before loading the video
        playerInstanceRef.current.on("ready", () => {
          playerInstanceRef.current.loadVideoById(videoId);
        });

        playerInstanceRef.current.on("stateChange", (state: any) => {
          setPlayerStatus(state.data);
        });
      }
    };

    fetchLyricsAndSetupPlayer();

    return () => {
      isMounted = false;
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (playerInstanceRef.current) {
        playerInstanceRef.current.destroy();
        playerInstanceRef.current = null;
      }
    };
  }, [videoId]);

  // Sync lyrics only when player is playing and lyrics are loaded
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    if (playerStatus === 1 && lyrics.length > 0 && playerInstanceRef.current) {
      intervalRef.current = setInterval(async () => {
        const currentTime = await playerInstanceRef.current.getCurrentTime();
        const foundLyric = lyrics.find((lyric: any) => {
          const startTimeSeconds = lyric.start_time / 1000;
          const endTimeSeconds = lyric.end_time / 1000;
          return (
            currentTime >= startTimeSeconds && currentTime <= endTimeSeconds
          );
        });
        setCurrentLyric((prev: any) => {
          if (foundLyric && foundLyric.id !== prev?.id) {
            return foundLyric;
          }
          return prev;
        });
      }, 50);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [playerStatus, lyrics]);

  return (
    <div>
      <h1>Song Page</h1>
      <p>Video ID: {videoId}</p>
      <div ref={playerRef} />
      <LyricsList lyrics={lyrics} currentLyric={currentLyric} />
    </div>
  );
}
