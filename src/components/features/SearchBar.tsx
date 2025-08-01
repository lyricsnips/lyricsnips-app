import React, { useEffect, useState } from "react";
import { getSongs } from "@/adapters/YTAdapter";
import { useSearchResults } from "@/contexts/SearchResultsContext";
import { useTabContext } from "@/contexts/CurrentTabContext";
import { Geo } from "next/font/google";
import { getSharedLyrics } from "@/adapters/lyricAdapter";
import Tabs from "./Tabs";
import { Search } from "lucide-react";

const geo = Geo({
  weight: ["400"],
});

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const { setSearchResults } = useSearchResults();
  const { setTab } = useTabContext();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      // Fetch from external YT python API
      const res = await getSongs(query);
      if (!res.data) return;

      setSearchResults(res.data);
      setQuery("");
      setTab("search");

      // Create a map to track updates
      const resultsMap: any = new Map(
        res.data.map((song: any) => [song.videoId, song])
      );

      // Fetch lyrics and update immediately when each resolves
      res.data.forEach(async (song: any) => {
        try {
          const lyrics = await getSharedLyrics(song.videoId);
          const updatedSong =
            Array.isArray(lyrics.data) && lyrics.data.length > 0
              ? { ...song, lyrics: lyrics.data }
              : song;
          // Update the map and state immediately
          resultsMap.set(song.videoId, updatedSong);
          setSearchResults([...resultsMap.values()]);
        } catch (error) {
          console.warn(`Failed to fetch lyrics for ${song.videoId}:`, error);
        }
      });
    } catch (error) {
      console.error("Error fetching songs or lyrics:", error);
    }
  };

  return (
    <>
      <div className="flex justify-center mt-3 mb-3">
        <form onSubmit={handleSubmit} className="relative w-full max-w-md">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search song or lyric..."
              className={`w-full px-4 py-3 pr-12 border border-white bg-black text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-white placeholder-gray-400 ${geo.className}`}
            />
            <button
              type="submit"
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 flex items-center gap-2   bg-black text-white border border-white hover:bg-white hover:text-black transition ${geo.className}`}
            >
              <Search size={16} />
              Search
            </button>
          </div>
        </form>
      </div>
      <Tabs />
    </>
  );
}
