"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface SharedLyric {
  id: string;
  videoId: string;
  lyrics_preview_src: string;
  createdAt: Date;
}

export default function SharesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [shares, setShares] = useState<SharedLyric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchShares() {
      try {
        const response = await fetch("/api/shares");
        if (!response.ok) throw new Error("Failed to fetch shares");
        const data = await response.json();
        setShares(data);
      } catch (error) {
        console.error("Error fetching shares:", error);
      } finally {
        setLoading(false);
      }
    }

    if (status === "authenticated") {
      fetchShares();
    } else {
      setLoading(false);
    }
  }, [status]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your shared lyrics...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">
            You must have an account to see shared lyrics
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (shares.length === 0 && status === "authenticated") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Your Shared Lyrics</h1>
        <div className="text-center max-w-md mx-auto p-6">
          <p className="text-gray-600 mb-4">
            You haven't shared any lyrics yet!
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
          >
            Find Songs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Shared Lyrics</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shares.map((share) => (
          <div
            key={share.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <img
              src={share.lyrics_preview_src}
              alt="Lyrics preview"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <p className="text-sm text-gray-500">
                Shared on {new Date(share.createdAt).toLocaleDateString()}
              </p>
              <button
                onClick={() => router.push(`/song/${share.videoId}`)}
                className="mt-2 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
              >
                View Song
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
