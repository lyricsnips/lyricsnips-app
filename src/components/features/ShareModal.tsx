import { useState } from "react";

interface ShareModalProps {
  songInfo: any;
  onClose: () => void;
  onShare: () => void;
}

export default function ShareModal({
  songInfo,
  onClose,
  onShare,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(songInfo.shareURL);
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

        {/* Generated image preview */}
        <div className="mb-6">
          <img
            src={songInfo.imageUrl}
            alt="Shared lyrics preview"
            className="w-full rounded-lg shadow-md border border-gray-200"
          />
        </div>

        {/* URL input and copy button */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Share this link:
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={songInfo.shareURL}
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

        {/* Share options placeholder */}
        <div className="text-sm text-gray-500 text-center">
          More sharing options coming soon...
        </div>
      </div>
    </div>
  );
}
