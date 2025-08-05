"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useAuthModal } from "@/contexts/AuthModalContext";
import { Special_Gothic_Expanded_One, Geo } from "next/font/google";
import { User, LibraryBig, LogOut } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const gothic = Special_Gothic_Expanded_One({
  weight: ["400"],
  subsets: ["latin", "latin-ext"],
});

const geo = Geo({
  weight: ["400"],
  subsets: ["latin"],
});

export default function Navbar() {
  const { data: session } = useSession();
  const { openModal } = useAuthModal();
  const router = useRouter();
  const [flickeringLetters, setFlickeringLetters] = useState<number[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleUserClick = () => {
    if (session) {
      setIsDropdownOpen(!isDropdownOpen);
    } else {
      openModal("signup");
    }
  };

  const handleLibraryClick = () => {
    if (session) {
      router.push("/shares");
    } else {
      openModal("signup");
    }
  };

  const handleSignOut = () => {
    signOut({ redirect: false });
    setIsDropdownOpen(false);
  };

  const title = "LyricSnips";

  return (
    <div className="w-full text-white px-3 py-2 relative flex items-center justify-center border-b-1">
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
      <div className="ml-auto flex items-center gap-3">
        <button
          type="button"
          onClick={handleLibraryClick}
          className={`${geo.className} w-10 h-10 bg-black text-white-700 font-semibold border-white border hover:bg-white hover:text-black transition flex items-center justify-center`}
        >
          <LibraryBig size={20} />
        </button>
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={handleUserClick}
            className={`${geo.className} w-10 h-10 bg-black text-white-700 font-semibold border-white border hover:bg-white hover:text-black transition flex items-center justify-center`}
          >
            <User size={20} />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && session && (
            <div className="absolute right-0 top-full mt-1 bg-black border border-white z-50 min-w-[200px]">
              {/* Username */}
              <div className="px-3 py-2 border-b border-white">
                <span className={`${geo.className} text-white text-sm`}>
                  {session.user.username || "User"}
                </span>
              </div>

              {/* Sign Out Option */}
              <button
                onClick={handleSignOut}
                className={`${geo.className} w-full px-3 py-2 text-white hover:bg-white hover:text-black transition flex items-center gap-2 text-sm`}
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
