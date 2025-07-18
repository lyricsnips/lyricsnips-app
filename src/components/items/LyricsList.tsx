"use client";

import Lyric from "./Lyric";

export default function LyricsList({
  lyrics,
  currentLyric,
}: {
  lyrics: any;
  currentLyric: any;
}) {
  if (!lyrics || lyrics.length === 0) {
    return <div className="text-gray-500">No lyrics found.</div>;
  }
  return (
    <div className="border rounded divide-y">
      {lyrics.map((lyric: any) =>
        currentLyric?.id === lyric.id ? (
          <Lyric key={lyric.id} lyric={lyric} active={true} />
        ) : (
          <Lyric key={lyric.id} lyric={lyric} active={false} />
        )
      )}
    </div>
  );
}
