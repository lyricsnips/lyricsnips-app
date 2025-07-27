import { useEffect } from "react";
import SongCard from "../items/SongCard";
import { useRouter } from "next/navigation";
import { getTrendingSongs } from "@/adapters/YTAdapter";
import { useTabContext } from "@/contexts/CurrentTabContext";
import { getSong } from "@/adapters/YTAdapter";
import { useTrendingResultsContext } from "@/contexts/TrendingResultsContext";
import { getSharedLyrics } from "@/adapters/lyricAdapter";

export default function TrendingList() {
  const { currentTab } = useTabContext();
  const { trendingResults, setTrendingResults } = useTrendingResultsContext();
  const router = useRouter();

  const fetchTrendingSongs = async () => {
    try {
      const res: any = await getTrendingSongs();

      if (!res.data) return;

      const songPromises = res.data.map(async (song: any) => {
        const res: any = await getSong(song.videoId);
        if (res.data) {
          return {
            videoId: res.data.videoDetails.videoId,
            thumbnails: res.data.videoDetails.thumbnail.thumbnails,
            title: res.data.videoDetails.title,
            artists: res.data.videoDetails.author,
            timesShared: song.count,
          };
        }
      });

      const songs = await Promise.all(songPromises);

      setTrendingResults(songs);

      const resultsMap: any = new Map(
        songs.map((song: any) => [song.videoId, song])
      );

      songs.forEach(async (song: any) => {
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
  };

  useEffect(() => {
    if (currentTab === "trending" && trendingResults.length === 0) {
      fetchTrendingSongs();
    }
  }, []);

  const handlePlay = (videoId: string) => {
    router.push(`/song/${videoId}`);
  };

  return (
    <>
      <ul className="flex flex-col gap-5">
        {trendingResults.map((song: any) => {
          return (
            <li key={song.videoId}>
              <SongCard song={song} handlePlay={handlePlay}></SongCard>
            </li>
          );
        })}
      </ul>
    </>
  );
}
