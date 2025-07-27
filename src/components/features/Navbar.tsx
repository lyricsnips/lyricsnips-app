"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useAuthModal } from "@/contexts/AuthModalContext";
import { Special_Gothic_Expanded_One, Geo } from "next/font/google";
import { User, LibraryBig } from "lucide-react";

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

  return (
    <div className="w-full text-white px-6 py-3 relative flex items-center justify-center pt-5 pb-5  border-b-1">
      {/* Centered Title */}
      <div
        className={`text-2xl ${gothic.className} cursor-pointer`}
        onClick={() => router.push("/")}
      >
        <h1>LyricSnips</h1>
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
