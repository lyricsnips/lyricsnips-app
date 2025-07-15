"use client";

import AuthModal from "@/components/features/AuthModal";
import { useAuthModal } from "@/contexts/AuthModalContext";

export default function Home() {
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
        <h2>Auth</h2>
        <button type="button" onClick={() => openModal("login")}>
          Log in
        </button>
        <button type="button" onClick={() => openModal("signup")}>
          Sign Up
        </button>
      </div>
      <AuthModal />
    </>
  );
}
