"use client";

import { useEffect, useRef, useState } from "react";
import * as htmlToImage from "html-to-image";
import { useSession } from "next-auth/react";
import { useSelectedLyrics } from "@/contexts/SelectedLyricsContext";
import CustomizeMenu, { CustomizeSettings } from "../menus/CustomizeMenu";

interface ShareModalProps {
  songInfo: any;
  onClose: () => void;
}

export default function ShareModal({ songInfo, onClose }: ShareModalProps) {
  const { data: session } = useSession();
  const lyricCardRef = useRef(null);
  const [shareData, setShareData] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const { selectedLyrics } = useSelectedLyrics();
  const [settings, setSettings] = useState<CustomizeSettings>({
    backgroundColor: "#f8f9fa",
    fontFamily: "Arial, sans-serif",
    fontSize: "24px",
    textColor: "#424242",
  });

  const handleShare = async () => {
    console.log(`Trying to share song ${songInfo.title}`);
    if (!lyricCardRef.current) return;

    // Convert element (div) to PNG and download
    try {
      const blob = await htmlToImage.toBlob(lyricCardRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        // DO NOT set backgroundColor - this makes it transparent
        backgroundColor: settings.backgroundColor,
        skipFonts: true,
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
    }
  };

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

        <div
          className="p-5 rounded-lg mb-4 flex flex-col"
          style={{ backgroundColor: settings.backgroundColor }}
          ref={lyricCardRef}
        >
          <ul>
            {selectedLyrics.map((lyric: any, index: number) => {
              return (
                <li
                  key={index}
                  style={{
                    fontFamily: settings.fontFamily,
                    fontSize: settings.fontSize,
                    color: settings.textColor,
                  }}
                  className="mb-2"
                >
                  {lyric.text}
                </li>
              );
            })}
          </ul>
          <div className=" flex flex-row gap-2 items-center">
            {/* Thumbnail (album cover) if any */}
            {songInfo.thumbnail &&
              Array.isArray(songInfo.thumbnail.thumbnails) && (
                <img
                  src={
                    songInfo.thumbnail.thumbnails[
                      songInfo.thumbnail.thumbnails.length - 1
                    ].url ?? "Missing picture here"
                  }
                  alt="Cover image"
                  className=" size-15  object-cover"
                ></img>
              )}
            <div className=" flex flex-col">
              {/* Song Name */}
              <span
                className="text-l"
                style={{
                  fontFamily: settings.fontFamily,
                  color: settings.textColor,
                }}
              >
                {songInfo.title}
              </span>
              {/* Author Name */}
              <span
                className="text-l"
                style={{
                  fontFamily: settings.fontFamily,
                  color: settings.textColor,
                }}
              >
                {songInfo.author}
              </span>
            </div>
          </div>
        </div>

        <CustomizeMenu settings={settings} setSettings={setSettings} />

        {!shareData && (
          <button className="text-black border" onClick={handleShare}>
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
