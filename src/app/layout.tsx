import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
// AppProvider combines multiple context providers for easy integration within the entire app
import { AppProviders } from "@/providers/AppProviders";
import Navbar from "@/components/features/Navbar";
import AuthModal from "@/components/features/AuthModal";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LyricSnips",
  description: "For the lyric enthusiasts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen flex flex-col`}
      >
        <AppProviders>
          <AuthModal></AuthModal>
          <Navbar></Navbar>
          <main className="flex-1 overflow-hidden">{children}</main>
        </AppProviders>
      </body>
    </html>
  );
}
