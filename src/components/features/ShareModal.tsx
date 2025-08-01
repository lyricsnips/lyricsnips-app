"use client";

import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import { useSession } from "next-auth/react";
import { useSelectedLyrics } from "@/contexts/SelectedLyricsContext";
import CustomizeMenu, { CustomizeSettings } from "../menus/CustomizeMenu";
import { Special_Gothic_Expanded_One, Geo } from "next/font/google";
import LyriCard from "../items/LyricCard";
import { defaultButtonStyle } from "@/styles/Buttons";

const gothic = Special_Gothic_Expanded_One({
  weight: ["400"],
});

interface ShareModalProps {
  songInfo: any;
  onClose: () => void;
}

// Ideal card dimensions for social media sharing
const CARD_CONFIG = {
  width: 1200,
  height: 630,
  padding: 60,
  titleFontSize: 48,
  lyricFontSize: 28,
  authorFontSize: 24,
  backgroundColor: "#1f2937", // Dark background
  textColor: "#ffffff",
  accentColor: "#3b82f6", // Blue accent
  gradientStart: "#667eea",
  gradientEnd: "#764ba2",
};

export default function ShareModal({ songInfo, onClose }: ShareModalProps) {
  const { data: session } = useSession();
  const lyricCardRef = useRef(null);
  const [shareData, setShareData] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const { selectedLyrics, setSelectedLyrics } = useSelectedLyrics();
  const [settings, setSettings] = useState<CustomizeSettings>({
    backgroundColor: CARD_CONFIG.backgroundColor,
    fontFamily: "Inter, Arial, sans-serif",
    textColor: CARD_CONFIG.textColor,
  });

  const handleShare = async () => {
    console.log(`Trying to share song ${songInfo.title}`);
    if (!lyricCardRef.current) return;

    // Convert element (div) to PNG using html2canvas
    try {
      // Pre-load fonts before conversion
      await document.fonts.ready;

      const canvas = await html2canvas(lyricCardRef.current, {
        background: settings.backgroundColor,
        useCORS: true,
        allowTaint: true,
        logging: false,
      });

      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else throw new Error("Failed to generate blob");
          },
          "image/png",
          1.0
        );
      });

      if (!blob) {
        throw new Error("Failed to generate image blob");
      }

      // Create FormData to send to backend
      const formData = new FormData();
      formData.append("image", blob, "component-image.png");
      formData.append("videoId", songInfo.videoId);
      formData.append("lyrics", JSON.stringify(selectedLyrics));
      formData.append(
        "thumbnails",
        JSON.stringify(
          songInfo?.thumbnail?.thumbnails || songInfo?.thumbnails || []
        )
      );
      formData.append("title", songInfo.title);
      formData.append("author", songInfo.author);
      formData.append("filename", `image-${Date.now()}.png`);

      // Upload to S3 and return link to image
      const response = await fetch("/api/upload-lyric", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();

      if (result)
        setShareData({
          ...result,
          shareURL: `${window.location.origin}/shared/${result.id}`,
        });
      console.log("Image uploaded successfully:", result);
    } catch (error) {
      console.error("Error generating image:", error);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareData.shareURL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy: ", err);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = songInfo.shareURL;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Close modal when clicking the backdrop
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
      setSelectedLyrics([]); // Clear selected lyrics
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="border p-6 max-w-lg w-full bg-black shadow-2xl">
        <div className="flex justify-between">
          <h2 className={`text-xl font-bold ${gothic.className}  text-white`}>
            Share Lyric
          </h2>
          <button
            type="button"
            onClick={onClose}
            className=" text-gray-400 hover:text-gray-600 text-2xl font-light transition-colors"
          >
            ×
          </button>
        </div>

        {/* Preview container with fixed dimensions */}
        <div className="flex justify-center m-4 pointer-events-none select-none">
          <LyriCard
            songInfo={songInfo}
            settings={settings}
            lyricCardRef={lyricCardRef}
          />
        </div>

        {!shareData && (
          <CustomizeMenu settings={settings} setSettings={setSettings} />
        )}

        {!shareData && (
          <div className="flex justify-center w-full">
            <button className={defaultButtonStyle} onClick={handleShare}>
              Save and Share
            </button>
          </div>
        )}

        {/* URL input and copy button */}
        {shareData && (
          <div>
            <span>Share this link:</span>
            <div className="flex gap-3">
              <input
                type="text"
                value={shareData.shareURL}
                readOnly
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button onClick={handleCopy} className={` ${defaultButtonStyle}`}>
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        )}

        {/* Share options placeholder */}
        {!session && (
          <div className="text-sm text-red-500 text-left">
            This link will expire in 24 hours. Make an account to remove link
            expiration.
          </div>
        )}
      </div>
    </div>
  );
}
