import React, { useEffect, useState } from "react";
import { getSongs } from "@/adapters/YTAdapter";
import { useSearchResults } from "@/contexts/SearchResultsContext";
import { useTabContext } from "@/contexts/CurrentTabContext";
import { Geo } from "next/font/google";
import { getSharedLyrics } from "@/adapters/lyricAdapter";
import Tabs from "./Tabs";

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
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search song or lyric..."
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className={`${geo.className} px-3 py-1 bg-black text-white-700 font-semibold border-white border hover:bg-white hover:text-black cursor-pointer transition`}
          >
            Search
          </button>
        </form>
      </div>
      <Tabs />
    </>
  );
}
