import { useSearchResults } from "@/contexts/SearchResultsContext";
import SongCard from "../items/SongCard";
import { useRouter } from "next/navigation";

interface SongData {
  videoId: string;
  title: string;
  author: string;
  artists: Array<{ id: string; name: string }>;
  thumbnails: Array<{ url: string }>;
  duration?: string;
  isExplicit?: boolean;
  timesShared?: number;
  lyrics?: unknown;
}

export default function ResultsList() {
  const { results } = useSearchResults();
  const router = useRouter();

  const handlePlay = (videoId: string, songData: SongData) => {
    console.log(songData);
    const params = new URLSearchParams({
      title: songData.title,
      author: songData.artists[0].name,
      videoId: videoId,
    });
    router.push(`/song/${videoId}?${params.toString()}`);
  };

  return (
    <ul className="flex flex-col gap-4">
      {results.map((song: SongData) => {
        // Transform SongData to Song type
        const songForCard = {
          ...song,
          artists: song.artists,
          duration: song.duration || "",
          isExplicit: song.isExplicit || false,
          timesShared: song.timesShared || 0,
          lyrics: undefined,
        };

        return (
          <li key={song.videoId}>
            <SongCard
              song={songForCard}
              handlePlay={() => handlePlay(song.videoId, song)}
            ></SongCard>
          </li>
        );
      })}
    </ul>
  );
}
