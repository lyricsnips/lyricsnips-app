import React, { createContext, useContext, useState } from "react";

interface TrendingResultsContextType {
  trendingResults: any[];
  setTrendingResults: any;
}

const TrendingResultsContext = createContext<
  TrendingResultsContextType | undefined
>(undefined);

export const TrendingResultsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [trendingResults, setTrendingResults] = useState<any[]>([]);
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
