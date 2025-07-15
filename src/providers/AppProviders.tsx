"use client";
import { ReactNode } from "react";
import { AuthModalProvider } from "@/contexts/AuthModalContext";

export function AppProviders({ children }: { children: ReactNode }) {
  return <AuthModalProvider>{children}</AuthModalProvider>;
}
