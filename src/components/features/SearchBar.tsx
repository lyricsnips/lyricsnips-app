import React, { useState } from "react";
import { getSongs } from "@/adapters/YTAdapter";
import { useSearchResults } from "@/contexts/SearchResultsContext";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const { setSearchResults } = useSearchResults();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    // Fetch from external YT python API
    const results = await getSongs(query);

    if (results.data) {
      setSearchResults(results.data);
      setQuery("");
    }
  };

  return (
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
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
      >
        Search
      </button>
    </form>
  );
}
