"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useAuthModal } from "@/contexts/AuthModalContext";
import { Special_Gothic_Expanded_One, Geo } from "next/font/google";
import { User, LibraryBig } from "lucide-react";
import { useState, useEffect } from "react";

const gothic = Special_Gothic_Expanded_One({
  weight: ["400"],
});

const geo = Geo({
  weight: ["400"],
});

export default function Navbar() {
  const { data: session } = useSession();
  const { openModal } = useAuthModal();
  const router = useRouter();
  const [flickeringLetters, setFlickeringLetters] = useState<number[]>([]);

  // Trigger random letter flickering periodically
  useEffect(() => {
    const interval = setInterval(() => {
      // Pick 2-3 random letters to flicker
      const randomCount = Math.floor(Math.random() * 2) + 2; // 2 or 3 letters
      const randomLetters: number[] = [];

      while (randomLetters.length < randomCount) {
        const randomIndex = Math.floor(Math.random() * 9); // "LyricSnips" has 9 letters
        if (!randomLetters.includes(randomIndex)) {
          randomLetters.push(randomIndex);
        }
      }

      setFlickeringLetters(randomLetters);

      // Stop flickering after 1 second
      setTimeout(() => setFlickeringLetters([]), 10);
    }, 6000); // Every 6 seconds

    return () => clearInterval(interval);
  }, []);

  const title = "LyricSnips";

  return (
    <div className="w-full text-white px-6 py-3 relative flex items-center justify-center pt-5 pb-5  border-b-1">
      {/* Centered Title */}
      <div
        className={`text-2xl ${gothic.className} cursor-pointer`}
        onClick={() => router.push("/")}
      >
        <h1 className="flex justify-center">
          {title.split("").map((letter, index) => (
            <span
              key={index}
              className={`inline-block transition-all duration-1  ${
                flickeringLetters.includes(index) ? "opacity-0" : "opacity-100"
              }`}
            >
              {letter}
            </span>
          ))}
        </h1>
      </div>
      {/* Right-aligned Button */}
      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          onClick={() => router.push("/shares")}
          className={`${geo.className} px-1 py-1 bg-black text-white-700 font-semibold border-white border hover:bg-white hover:text-black transition`}
        >
          <LibraryBig />
        </button>
        <button
          type="button"
          onClick={() =>
            session ? signOut({ redirect: false }) : openModal("signup")
          }
          className={`${geo.className} px-1 py-1 bg-black text-white-700 font-semibold border-white border hover:bg-white hover:text-black transition`}
        >
          <User />
        </button>
      </div>
    </div>
  );
}
