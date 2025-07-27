export default function LyricCard({ lyricInfo }: { lyricInfo: any }) {
  return (
    <div>
      <img src={lyricInfo.lyrics_preview_src} alt="Lyrics Preview" />
    </div>
  );
}
