"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { deleteShare, getShares } from "@/adapters/sharesAdapter";
import { Special_Gothic_Expanded_One, Geo } from "next/font/google";
import { defaultButtonStyle } from "@/styles/Buttons";
import { Copy, Trash2, Eye, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

const gothic = Special_Gothic_Expanded_One({
  weight: ["400"],
  subsets: ["latin", "latin-ext"],
});

const geo = Geo({
  weight: ["400"],
  subsets: ["latin"],
});

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
        const response = await getShares();
        if (response.data) {
          setShares(response.data);
        } else {
          throw Error("Failed to get shares from api/shares");
        }
      } catch {
        console.error("Error fetching shares");
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
      const shareUrl = `${window.location.origin}/shared/${shareId}`;

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

  if (status === "unauthenticated") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-white mb-4">
            You must have an account to see shared lyrics
          </p>
          <button
            onClick={() => router.push("/")}
            className={`${defaultButtonStyle} ${geo.className}`}
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen ">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="bg-black border border-white rounded-lg shadow-md overflow-hidden"
              >
                {/* Image skeleton */}
                <div className="w-full h-48 bg-gray-700/50 rounded animate-pulse"></div>

                <div className="p-4">
                  {/* Date skeleton */}
                  <div className="h-4 bg-gray-600/30 rounded animate-pulse mb-4"></div>

                  {/* Button skeletons */}
                  <div className="space-y-2">
                    <div className="h-10 bg-gray-700/50 rounded animate-pulse"></div>
                    <div className="h-10 bg-gray-600/30 rounded animate-pulse"></div>
                    <div className="h-10 bg-gray-700/50 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (shares.length === 0 && status === "authenticated") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen ">
        <div className="text-center max-w-md mx-auto p-6">
          <p className="text-white mb-4">
            You haven&apos;t shared any lyrics yet!
          </p>
          <button
            onClick={() => router.push("/")}
            className={`${defaultButtonStyle} ${geo.className}`}
          >
            Find Songs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1
          className={`text-2xl font-bold mb-6 text-white ${gothic.className}`}
        >
          Your Shared Lyrics
        </h1>

        <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
            {shares.map((share) => (
              <div
                key={share.id}
                className="bg-black border border-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <ImageWithFallback
                  src={share.lyrics_preview_src}
                  alt="Lyrics preview"
                  width={400}
                  height={300}
                  className="w-full h-fit"
                />
                <div className="p-4">
                  <p className={`text-sm text-gray-400 ${geo.className}`}>
                    Shared on {new Date(share.createdAt).toLocaleDateString()}
                  </p>

                  <div className="flex flex-col gap-2 mt-4">
                    <button
                      onClick={() => router.push(`/shared/${share.id}`)}
                      className={`w-full flex items-center justify-center gap-2 ${defaultButtonStyle} ${geo.className}`}
                    >
                      <Eye size={16} />
                      View Snippet
                    </button>

                    <button
                      onClick={() => handleCopyLink(share.id)}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-2 border border-white font-semibold transition ${
                        geo.className
                      } ${
                        copiedId === share.id
                          ? "bg-green-600 text-white border-green-600"
                          : "bg-black text-white border-white hover:bg-white hover:text-black"
                      }`}
                    >
                      <Copy size={16} />
                      {copiedId === share.id ? "Copied!" : "Copy Link"}
                    </button>

                    <button
                      onClick={() => handleRemove(share.id)}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-2 border border-red-500 bg-black text-red-500 font-semibold hover:bg-red-500 hover:text-white transition ${geo.className}`}
                    >
                      <Trash2 size={16} />
                      Remove Share
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Image component with fallback
function ImageWithFallback({
  src,
  alt,
  width,
  height,
  className,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className: string;
}) {
  const [imageError, setImageError] = useState(false);

  // Check for valid src before rendering Image component
  if (!src || imageError) {
    return (
      <div className="w-full h-48 bg-gray-800 flex items-center justify-center border border-gray-600">
        <div className="text-gray-400 text-center">
          <ImageIcon className="w-12 h-12 mx-auto mb-2" />
          <p className="text-sm">Image not available</p>
        </div>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setImageError(true)}
    />
  );
}
