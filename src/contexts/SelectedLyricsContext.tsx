"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface SelectedLyricsContextType {
  selectedLyrics: any[];
  setSelectedLyrics: (lyrics: any[]) => void;
}

const SelectedLyricsContext = createContext<
  SelectedLyricsContextType | undefined
>(undefined);

export function SelectedLyricsProvider({ children }: { children: ReactNode }) {
  const [selectedLyrics, setSelectedLyrics] = useState<any[]>([]);

  return (
    <SelectedLyricsContext.Provider
      value={{ selectedLyrics, setSelectedLyrics }}
    >
      {children}
    </SelectedLyricsContext.Provider>
  );
}

export function useSelectedLyrics() {
  const context = useContext(SelectedLyricsContext);
  if (context === undefined) {
    throw new Error(
      "useSelectedLyrics must be used within a SelectedLyricsProvider"
    );
  }
  return context;
}
