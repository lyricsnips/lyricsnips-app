import React, { createContext, useContext, useState } from "react";

interface SongData {
  videoId: string;
  title: string;
  author: string;
  thumbnails: Array<{ url: string }>;
  duration?: string;
  isExplicit?: boolean;
  timesShared?: number;
}

interface TrendingResultsContextType {
  trendingResults: SongData[];
  setTrendingResults: (results: SongData[]) => void;
}

const TrendingResultsContext = createContext<
  TrendingResultsContextType | undefined
>(undefined);

export const TrendingResultsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [trendingResults, setTrendingResults] = useState<SongData[]>([]);
  return (
    <TrendingResultsContext.Provider
      value={{ trendingResults, setTrendingResults }}
    >
      {children}
    </TrendingResultsContext.Provider>
  );
};

export function useTrendingResultsContext() {
  const context = useContext(TrendingResultsContext);
  if (!context) {
    throw new Error(
      "useTrendingResultsContext must be used within a TrendingResultsProvider"
    );
  }
  return context;
}
