"use client";

import SearchBar from "@/components/features/SearchBar";
import ResultsList from "@/components/features/ResultsList";
import TrendingList from "@/components/features/TrendingList";
import { useTabContext } from "@/contexts/CurrentTabContext";

export default function Home() {
  const { currentTab } = useTabContext();

  return (
    <div className="h-full flex flex-col bg-black">
      <div className="w-full flex justify-center flex-1 overflow-hidden">
        <div className="ml-3 mr-3 w-full max-w-4xl flex flex-col">
          <SearchBar />
          <div className="flex-1 overflow-y-auto">
            {currentTab === "search" && <ResultsList />}
            {currentTab === "trending" && <TrendingList />}
          </div>
        </div>
      </div>
    </div>
  );
}
