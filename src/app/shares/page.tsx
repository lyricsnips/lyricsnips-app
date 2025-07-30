"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { deleteShare, getShares } from "@/adapters/sharesAdapter";

interface SharedLyric {
  id: string;
  videoId: string;
  lyrics_preview_src: string;
  createdAt: Date;
}

export default function SharesPage() {
  const { status } = useSession();
  const router = useRouter();
  const [shares, setShares] = useState<SharedLyric[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchShares() {
      try {
        const response: any = await getShares();
        if (response.data) {
          setShares(response.data);
        } else {
          throw Error("Failed to get shares from api/shares");
        }
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

  const handleRemove = async (shareId: string) => {
    try {
      const res = await deleteShare(shareId);
      if (res.data) {
        console.log(res.data);
        const updatedhares = shares.filter((share) => share.id !== shareId);
        setShares(updatedhares);
      }
    } catch (e) {
      console.log(`An error occurred while trying to delete share: ${shareId}`);
    }
  };

  const handleCopyLink = async (shareId: string) => {
    try {
      // Create the share URL
      const shareUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/shared/${shareId}`;

      // Copy to clipboard
      await navigator.clipboard.writeText(shareUrl);

      // Show feedback
      setCopiedId(shareId);
      setTimeout(() => setCopiedId(null), 2000); // Reset after 2 seconds
    } catch (error) {
      console.error("Failed to copy link:", error);
      // Fallback for older browsers
      const shareUrl = `${window.location.origin}/shared/${shareId}`;
      const textArea = document.createElement("textarea");
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);

      setCopiedId(shareId);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

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
    <div className="min-h-scree">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-white-800">
          Your Shared Lyrics
        </h1>

        <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
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
                    onClick={() => router.push(`/shared/${share.id}`)}
                    className="mt-2 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
                  >
                    View Snippet
                  </button>
                  <button
                    onClick={() => handleCopyLink(share.id)}
                    className={`mt-2 w-full px-4 py-2 rounded-md focus:outline-none transition-colors ${
                      copiedId === share.id
                        ? "bg-green-600 text-white"
                        : "bg-gray-600 text-white hover:bg-gray-700"
                    }`}
                  >
                    {copiedId === share.id ? "Copied!" : "Copy Link"}
                  </button>
                  <button
                    onClick={() => handleRemove(share.id)}
                    className="mt-2 w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none"
                  >
                    Remove Share
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
