"use client";

import { signIn } from "next-auth/react";
import { useAuthModal } from "@/contexts/AuthModalContext";
import { useState } from "react";
import { Geo } from "next/font/google";
import { defaultButtonStyle } from "@/styles/Buttons";

const geo = Geo({
  weight: ["400"],
  subsets: ["latin"],
});

export default function LogInForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { closeModal } = useAuthModal();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        username: username,
        password: password,
        redirect: false,
      });

      if (result?.error) {
        // Handle different error cases
        if (result.error === "CredentialsSignin") {
          setError("Invalid username or password");
        } else if (result.error === "UserNotFound") {
          setError("User not found");
        } else {
          setError("Login failed. Please try again.");
        }
      } else if (result?.ok) {
        // Successful login
        setUsername("");
        setPassword("");
        closeModal();
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className={`text-red-400 text-sm ${geo.className}`}>{error}</div>
      )}

      <div>
        <label
          htmlFor="username"
          className={`block text-sm font-medium text-white ${geo.className}`}
        >
          Username
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setError(""); // Clear error when user starts typing
          }}
          required
          className={`mt-1 block w-full px-3 py-2 border border-white bg-black text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-white focus:border-white placeholder-gray-400 ${geo.className}`}
          placeholder="Enter your username"
          disabled={loading}
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className={`block text-sm font-medium text-white ${geo.className}`}
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError(""); // Clear error when user starts typing
          }}
          required
          className={`mt-1 block w-full px-3 py-2 border border-white bg-black text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-white focus:border-white placeholder-gray-400 ${geo.className}`}
          placeholder="Enter your password"
          disabled={loading}
        />
      </div>

      <button
        type="submit"
        className={`w-full ${defaultButtonStyle} ${geo.className} mt-10`}
        disabled={loading}
      >
        {loading ? "Logging In..." : "Log In"}
      </button>
    </form>
  );
}
