"use client";

import { useSelectedLyrics } from "../../contexts/SelectedLyricsContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Lyric from "./Lyric";

export default function LyricsList({
  lyrics,
  currentLyric,
}: {
  lyrics: any;
  currentLyric: any;
}) {
  const [alert, setAlert] = useState("");
  const { selectedLyrics, setSelectedLyrics } = useSelectedLyrics();
  const router = useRouter();

  const handleSelect = (lyric: any) => {
    setAlert("");

    if (selectedLyrics.length === 0) {
      setSelectedLyrics([lyric]);
      return;
    }

    const lyricIds = selectedLyrics.map((lyric: any) => lyric.id);
    let min, max;

    min = Math.min(...lyricIds);
    max = Math.max(...lyricIds);

    if (
      lyric.id === max ||
      lyric.id === min ||
      selectedLyrics.some((curr: any) => curr.id === lyric.id)
    ) {
      setAlert("Cannot select same lyric twice");
      return;
    }

    if (lyric.id === max + 1 && selectedLyrics.length < 5) {
      setSelectedLyrics([...selectedLyrics, lyric]);
    } else if (lyric.id === min - 1 && selectedLyrics.length < 5) {
      setSelectedLyrics([lyric, ...selectedLyrics]);
    } else {
      setSelectedLyrics([lyric]);
      setAlert("Please select up to 5 contiguous lyrics");
    }
  };

  if (lyrics?.length === 0) {
    return <div className="text-gray-500">Loading...</div>;
  }

  if (lyrics === null) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">No lyrics available for this song</p>
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <>
      {selectedLyrics.length > 0 && <p>{alert}</p>}
      {lyrics && (
        <div className="border rounded divide-y">
          {lyrics.map((lyric: any) => (
            <Lyric
              key={lyric.id}
              lyric={lyric}
              active={currentLyric?.id === lyric.id}
              selected={selectedLyrics.some(
                (curr: any) => curr.id === lyric.id
              )}
              handleSelect={handleSelect}
            />
          ))}
        </div>
      )}
    </>
  );
}
