"use client";
import { createContext, useContext, useState, ReactNode } from "react";

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

interface ResultsContextType {
  results: SongData[];
  setSearchResults: (results: SongData[]) => void;
}

const SearchResultsContext = createContext<ResultsContextType | undefined>(
  undefined
);

export function SearchResultsProvider({ children }: { children: ReactNode }) {
  const [results, setResults] = useState<SongData[]>([]);

  const setSearchResults = (results: SongData[]) => {
    setResults(results);
  };

  return (
    <SearchResultsContext.Provider value={{ results, setSearchResults }}>
      {children}
    </SearchResultsContext.Provider>
  );
}

export function useSearchResults() {
  const context = useContext(SearchResultsContext);
  if (context === undefined) {
    throw new Error("useSearchResults must be used within a ModalProvider");
  }
  return context;
}
