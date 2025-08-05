"use client";

import { signIn } from "next-auth/react";
import { createUser } from "@/adapters/userAdapter";
import { useState } from "react";
import { useAuthModal } from "@/contexts/AuthModalContext";
import { Geo } from "next/font/google";
import { defaultButtonStyle } from "@/styles/Buttons";

const geo = Geo({
  weight: ["400"],
  subsets: ["latin"],
});

export default function SignUpForm() {
  const [username, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const { closeModal } = useAuthModal();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    const res = await createUser({ username, password });
    setLoading(false);

    if (res.error) {
      setError(res.error);
    } else {
      signIn("credentials", {
        username: username,
        password: password,
        redirect: false,
      });
      setSuccess("User created successfully!");
      setName("");
      setPassword("");
      setConfirmPassword("");
      closeModal();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className={`text-red-400 text-sm ${geo.className}`}>{error}</div>
      )}
      {success && (
        <div className={`text-green-400 text-sm ${geo.className}`}>
          {success}
        </div>
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
          onChange={(e) => setName(e.target.value)}
          required
          className={`mt-1 block w-full px-3 py-2 border border-white bg-black text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-white focus:border-white placeholder-gray-400 ${geo.className}`}
          placeholder="Enter username"
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
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className={`mt-1 block w-full px-3 py-2 border border-white bg-black text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-white focus:border-white placeholder-gray-400 ${geo.className}`}
          placeholder="Enter your password"
        />
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className={`block text-sm font-medium text-white ${geo.className}`}
        >
          Confirm Password
        </label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={6}
          className={`mt-1 block w-full px-3 py-2 border border-white bg-black text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-white focus:border-white placeholder-gray-400 ${geo.className}`}
          placeholder="Confirm your password"
        />
      </div>

      <button
        type="submit"
        className={`w-full ${defaultButtonStyle} ${geo.className} mt-10`}
        disabled={loading}
      >
        {loading ? "Signing Up..." : "Sign Up"}
      </button>
    </form>
  );
}
