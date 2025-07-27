"use client";
import { ReactNode } from "react";
import { AuthModalProvider } from "@/contexts/AuthModalContext";
import { SessionProvider } from "next-auth/react";
import { SearchResultsProvider } from "@/contexts/SearchResultsContext";
import { TrendingResultsProvider } from "@/contexts/TrendingResultsContext";
import { SelectedLyricsProvider } from "@/contexts/SelectedLyricsContext";
import { TabContextProvider } from "@/contexts/CurrentTabContext";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthModalProvider>
        <SearchResultsProvider>
          <TrendingResultsProvider>
            <TabContextProvider>
              <SelectedLyricsProvider>{children}</SelectedLyricsProvider>
            </TabContextProvider>
          </TrendingResultsProvider>
        </SearchResultsProvider>
      </AuthModalProvider>
    </SessionProvider>
  );
}
