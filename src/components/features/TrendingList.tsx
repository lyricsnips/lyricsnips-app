import { useEffect, useCallback } from "react";
import SongCard from "../items/SongCard";
import { useRouter } from "next/navigation";
import { getTrendingSongs } from "@/adapters/YTAdapter";
import { useTabContext } from "@/contexts/CurrentTabContext";
import { useTrendingResultsContext } from "@/contexts/TrendingResultsContext";
import { getSharedLyrics } from "@/adapters/lyricAdapter";

interface SongData {
  videoId: string;
  title: string;
  author: string;
  thumbnails: Array<{ url: string }>;
  duration?: string;
  isExplicit?: boolean;
  timesShared?: number;
  lyrics?: unknown;
}

export default function TrendingList() {
  const { currentTab } = useTabContext();
  const { trendingResults, setTrendingResults } = useTrendingResultsContext();
  const router = useRouter();

  const fetchTrendingSongs = useCallback(async () => {
    try {
      const res = await getTrendingSongs();

      if (!res.data) return;

      const cleanResults = res.data.map((song: SongData) => {
        return {
          videoId: song.videoId,
          title: song.title,
          thumbnails: `https://img.youtube.com/vi/${song.videoId}/maxresdefault.jpg`,
          artists: song.author,
          timesShared: song.count,
        };
      });

      setTrendingResults(cleanResults);

      const resultsMap: Map<string, SongData> = new Map(
        cleanResults.map((song: SongData) => [song.videoId, song])
      );

      cleanResults.forEach(async (song: SongData) => {
        try {
          const lyrics = await getSharedLyrics(song.videoId);

          const updatedSong =
            Array.isArray(lyrics.data) && lyrics.data.length > 0
              ? { ...song, lyrics: lyrics.data }
              : song;

          // Update the map and state immediately
          resultsMap.set(song.videoId, updatedSong);
          setTrendingResults([...resultsMap.values()]);
        } catch (error) {
          console.warn(`Failed to fetch lyrics for ${song.videoId}:`, error);
        }
      });
    } catch (error) {
      console.error("Error fetching songs or lyrics:", error);
    }
  }, [setTrendingResults]);

  useEffect(() => {
    if (currentTab === "trending" && trendingResults.length === 0) {
      fetchTrendingSongs();
    }
  }, [currentTab, trendingResults.length, fetchTrendingSongs]);

  const handlePlay = (songData: string) => {
    const params = new URLSearchParams({
      title: songData.title,
      author: songData.artists,
      videoId: songData.videoId,
    });
    router.push(`/song/${songData.videoId}?${params.toString()}`);
  };

  return (
    <>
      <ul className="flex flex-col gap-4">
        {trendingResults.map((song: SongData) => {
          return (
            <li key={song.videoId}>
              <SongCard
                song={song}
                handlePlay={() => handlePlay(song)}
              ></SongCard>
            </li>
          );
        })}
      </ul>
    </>
  );
}
