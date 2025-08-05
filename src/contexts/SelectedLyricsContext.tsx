"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface LyricData {
  id: string;
  text: string;
  start_time: number;
  end_time: number;
  start?: number;
  duration?: number;
}

interface SelectedLyricsContextType {
  selectedLyrics: LyricData[];
  setSelectedLyrics: (lyrics: LyricData[]) => void;
}

const SelectedLyricsContext = createContext<
  SelectedLyricsContextType | undefined
>(undefined);

export function SelectedLyricsProvider({ children }: { children: ReactNode }) {
  const [selectedLyrics, setSelectedLyrics] = useState<LyricData[]>([]);

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
