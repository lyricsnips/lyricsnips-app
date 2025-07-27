"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface TabContextType {
  currentTab: "search" | "trending";
  setTab: (results: "search" | "trending") => void;
}

const CurrentTabContext = createContext<TabContextType | undefined>(undefined);

export function TabContextProvider({ children }: { children: ReactNode }) {
  const [currentTab, setCurrentTab] = useState<"search" | "trending">(
    "trending"
  );

  const setTab = (results: "search" | "trending") => {
    setCurrentTab(results);
  };

  return (
    <CurrentTabContext.Provider value={{ currentTab, setTab }}>
      {children}
    </CurrentTabContext.Provider>
  );
}

export function useTabContext() {
  const context = useContext(CurrentTabContext);
  if (context === undefined) {
    throw new Error("useTabContext must be used within a TabContextProvider");
  }
  return context;
}
