"use client";
import { ObjectEncodingOptions } from "fs";
import { createContext, useContext, useState, ReactNode } from "react";

interface ResultsContextType {
  results: Object[];
  setSearchResults: (results: Object[]) => void;
}

const SearchResultsContext = createContext<ResultsContextType | undefined>(
  undefined
);

export function SearchResultsProvider({ children }: { children: ReactNode }) {
  const [results, setResults] = useState<Object[]>([]);

  const setSearchResults = (results: Object[]) => {
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
