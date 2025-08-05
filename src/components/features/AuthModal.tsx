"use client";

import { useAuthModal } from "@/contexts/AuthModalContext";
import LogInForm from "@/components/features/LogInForm";
import SignUpForm from "./SignUpForm";
import { Special_Gothic_Expanded_One, Geo } from "next/font/google";

const gothic = Special_Gothic_Expanded_One({
  weight: ["400"],
  subsets: ["latin", "latin-ext"],
});

const geo = Geo({
  weight: ["400"],
  subsets: ["latin"],
});

export default function AuthModal() {
  const { isOpen, closeModal, tab, setTab } = useAuthModal();

  // Close modal when clicking the backdrop
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={handleBackdropClick}
        >
          <div className="border p-6 max-w-lg w-full bg-black shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2
                className={`text-xl font-bold ${gothic.className} text-white`}
              >
                {tab === "login" ? "Log In" : "Sign Up"}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 text-2xl font-light transition-colors"
              >
                ×
              </button>
            </div>

            {/* Tab buttons */}
            <div className="flex justify-center gap-4 mb-6">
              <button
                onClick={() => setTab("login")}
                className={`${
                  geo.className
                } px-4 py-2 font-semibold focus:outline-none transition-colors border ${
                  tab === "login"
                    ? "bg-white text-black border-white"
                    : "bg-black text-white border-white hover:bg-white hover:text-black"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setTab("signup")}
                className={`${
                  geo.className
                } px-4 py-2 font-semibold focus:outline-none transition-colors border ${
                  tab === "signup"
                    ? "bg-white text-black border-white"
                    : "bg-black text-white border-white hover:bg-white hover:text-black"
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Form content */}
            <div className="text-white">
              {tab === "login" && <LogInForm />}
              {tab === "signup" && <SignUpForm />}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
