"use client";

import { useEffect, useRef, useState } from "react";
import * as htmlToImage from "html-to-image";
import { useSession } from "next-auth/react";
import { useSelectedLyrics } from "@/contexts/SelectedLyricsContext";
import CustomizeMenu, { CustomizeSettings } from "../menus/CustomizeMenu";
import { Special_Gothic_Expanded_One, Geo } from "next/font/google";

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
    fontSize: `${CARD_CONFIG.lyricFontSize}px`,
    textColor: CARD_CONFIG.textColor,
  });

  const handleShare = async () => {
    console.log(`Trying to share song ${songInfo.title}`);
    if (!lyricCardRef.current) return;

    // Convert element (div) to PNG and download
    try {
      const blob = await htmlToImage.toBlob(lyricCardRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: settings.backgroundColor,
        skipFonts: true,
        width: CARD_CONFIG.width,
        height: CARD_CONFIG.height,
      });

      if (!blob) {
        throw new Error("Failed to generate image blob");
      }

      // Create FormData to send to backend
      const formData = new FormData();
      formData.append("image", blob, "component-image.png");
      formData.append("videoId", songInfo.videoId); // videoId
      formData.append("lyrics", JSON.stringify(selectedLyrics)); // Convert array to JSON string
      formData.append("filename", `image-${Date.now()}.png`); // Custom filename

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
          shareURL: `${process.env.NEXT_PUBLIC_BASE_URL}/shared/${result.id}`,
        });
      console.log("Image uploaded successfully:", result);
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      // setIsLoading(false);
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

  // Calculate font size based on text length and settings
  const getFontSize = (textLength: number, baseSize?: string) => {
    // Parse the base font size from settings (remove 'px' and convert to number)
    const baseFontSize = baseSize
      ? parseInt(baseSize.replace("px", ""))
      : CARD_CONFIG.lyricFontSize;

    // For lyrics, always use the base font size from settings
    // Only adjust for very short or very long text
    if (textLength < 50) return Math.max(baseFontSize * 1.2, 36); // Short text slightly larger
    if (textLength > 500) return Math.max(baseFontSize * 0.8, 20); // Very long text smaller
    return baseFontSize; // Most lyrics use the base size from settings
  };

  // Parse font size from settings for consistent scaling
  const parseFontSize = (fontSize: string) => {
    return parseInt(fontSize.replace("px", ""));
  };

  const baseFontSize = parseFontSize(settings.fontSize);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="rounded-xl p-6 max-w-lg w-full bg-white shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-light transition-colors"
        >
          ×
        </button>

        <h2 className="text-xl font-bold mb-6 text-gray-800">Share Lyrics</h2>

        {/* Preview container with fixed dimensions */}
        <div className="mb-4 flex justify-center">
          <div
            className="relative overflow-hidden rounded-lg shadow-lg"
            style={{
              width: `${CARD_CONFIG.width / 2.5}px`, // Increased preview size
              height: `${CARD_CONFIG.height / 2.5}px`,
            }}
          >
            <div
              className="w-full h-full p-4 flex flex-col justify-between"
              style={{
                background: settings.backgroundColor, // Use dynamic background color
                fontFamily: settings.fontFamily,
                color: settings.textColor,
              }}
              ref={lyricCardRef}
            >
              {/* Lyrics content */}
              <div className="flex-1 flex flex-col justify-center">
                <div className="text-center space-y-2">
                  {selectedLyrics
                    .slice(0, 3)
                    .map((lyric: any, index: number) => {
                      const fontSize = getFontSize(
                        lyric.text.length,
                        settings.fontSize
                      );
                      return (
                        <p
                          key={index}
                          style={{
                            fontSize: `${fontSize / 2}px`, // Scale down for preview
                            lineHeight: 1.2,
                            fontWeight: "500",
                            color: settings.textColor, // Ensure text color is applied
                          }}
                          className="leading-tight"
                        >
                          {lyric.text}
                        </p>
                      );
                    })}
                  {selectedLyrics.length > 3 && (
                    <p
                      style={{
                        fontSize: `${baseFontSize / 2.5}px`,
                        opacity: 0.8,
                        color: settings.textColor,
                      }}
                    >
                      ...
                    </p>
                  )}
                </div>
              </div>

              {/* Song info footer */}
              <div className="flex items-center gap-3 mt-4 bg-black p-2">
                {/* Album cover */}
                {songInfo.thumbnail &&
                  Array.isArray(songInfo.thumbnail.thumbnails) && (
                    <img
                      src={
                        songInfo.thumbnail.thumbnails[
                          songInfo.thumbnail.thumbnails.length - 1
                        ].url ?? "Missing picture here"
                      }
                      alt="Cover image"
                      className="w-10 h-10 object-cover" // Slightly larger
                    />
                  )}

                <div className="flex-1 min-w-0">
                  {/* Song title */}
                  <p
                    className={`truncate text-xl ${gothic.className} text-white`}
                  >
                    {songInfo.title}
                  </p>
                  {/* Artist name */}
                  <p className="truncate text-xs font-sans ">
                    {songInfo.author}
                  </p>
                </div>

                {/* Brand */}
                <div
                  className={`text-xs px-2 py-1 bg-opacity-20 text-white ${gothic.className}`}
                >
                  LyricSnips
                </div>
              </div>
            </div>
          </div>
        </div>

        <CustomizeMenu settings={settings} setSettings={setSettings} />

        {!shareData && (
          <button
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors font-medium"
            onClick={handleShare}
          >
            Save and Share
          </button>
        )}

        {/* URL input and copy button */}
        {shareData && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Share this link:
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={shareData.shareURL}
                readOnly
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleCopy}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-colors ${
                  copied
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
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
