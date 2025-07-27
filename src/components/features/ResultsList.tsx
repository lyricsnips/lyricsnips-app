import { useSearchResults } from "@/contexts/SearchResultsContext";
import SongCard from "../items/SongCard";
import { useRouter } from "next/navigation";

export default function ResultsList() {
  const { results } = useSearchResults();
  const router = useRouter();

  const handlePlay = (videoId: string) => {
    router.push(`/song/${videoId}`);
  };

  return (
    <ul>
      {results.map((song: any) => {
        return (
          <li key={song.videoId}>
            <SongCard song={song} handlePlay={handlePlay}></SongCard>
          </li>
        );
      })}
    </ul>
  );
}
