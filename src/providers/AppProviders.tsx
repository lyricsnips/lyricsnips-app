"use client";
import { ReactNode } from "react";
import { AuthModalProvider } from "@/contexts/AuthModalContext";
import { SessionProvider } from "next-auth/react";
import { SearchResultsProvider } from "@/contexts/SearchResultsContext";
import { SelectedLyricsProvider } from "@/contexts/SelectedLyricsContext";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthModalProvider>
        <SearchResultsProvider>
          <SelectedLyricsProvider>{children}</SelectedLyricsProvider>
        </SearchResultsProvider>
      </AuthModalProvider>
    </SessionProvider>
  );
}
