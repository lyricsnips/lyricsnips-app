"use client";
import { ReactNode } from "react";
import { AuthModalProvider } from "@/contexts/AuthModalContext";
import { SessionProvider } from "next-auth/react";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthModalProvider>{children}</AuthModalProvider>;
    </SessionProvider>
  );
}
