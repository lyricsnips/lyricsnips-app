"use client";

import { useAuthModal } from "@/contexts/AuthModalContext";
import LogInForm from "@/components/features/LogInForm";
import SignUpForm from "./SignUpForm";

export default function AuthModal() {
  const { isOpen, closeModal, tab, setTab } = useAuthModal();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={closeModal}
        >
          <div
            className="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-4 p-8 animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none"
              aria-label="Close"
            >
              &times;
            </button>
            <h1 className="text-xl font-bold mb-6 text-center">
              Log In or Sign Up
            </h1>
            <div className="flex justify-center gap-4 mb-6">
              <button
                onClick={() => setTab("login")}
                className={`px-4 py-2 rounded-md font-semibold focus:outline-none transition-colors ${
                  tab === "login"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setTab("signup")}
                className={`px-4 py-2 rounded-md font-semibold focus:outline-none transition-colors ${
                  tab === "signup"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Sign Up
              </button>
            </div>
            {tab === "login" && <LogInForm />}
            {tab === "signup" && <SignUpForm />}
          </div>
        </div>
      )}
    </>
  );
}
