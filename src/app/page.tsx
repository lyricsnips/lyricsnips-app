"use client";

import { signOut } from "next-auth/react";
import AuthModal from "@/components/features/AuthModal";
import SearchBar from "@/components/features/SearchBar";
import { useAuthModal } from "@/contexts/AuthModalContext";
import { useSession } from "next-auth/react";
import ResultsList from "@/components/features/ResultsList";

export default function Home() {
  const { data: session } = useSession();
  const { openModal } = useAuthModal();

  return (
    <>
      <h1>Lyricsnips</h1>
      <div
        style={{
          backgroundColor: "green",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h2>User Controls</h2>
        <h2>Current User: {session?.user.email || "undefined"}</h2>
        {session && (
          <button type="button" onClick={() => signOut({ redirect: false })}>
            Sign Out
          </button>
        )}
        <p></p>
        <h2>Auth</h2>
        {!session && (
          <button type="button" onClick={() => openModal("login")}>
            Log in
          </button>
        )}
        {!session && (
          <button type="button" onClick={() => openModal("signup")}>
            Sign Up
          </button>
        )}
      </div>

      <AuthModal />
      <SearchBar />
      <ResultsList />
    </>
  );
}
