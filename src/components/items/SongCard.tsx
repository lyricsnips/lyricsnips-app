interface Song {
  videoId: string;
  album: { name: string };
  artists: { name: string }[];
  duration: string;
  isExplicit: boolean;
  thumbnails: { url: string }[];
  title: string;
}

export default function SongCard({
  song,
  handlePlay,
}: {
  song: Song;
  handlePlay: (videoId: string) => void;
}) {
  const thumbnail = song.thumbnails[song.thumbnails.length - 1]?.url;
  const artistNames = song.artists.map((a) => a.name).join(", ");

  return (
    <div className="flex items-center gap-4 p-4 border rounded shadow">
      <img
        src={thumbnail}
        alt={song.title}
        width={60}
        height={60}
        className="rounded"
      />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">{song.title}</h3>
          {song.isExplicit && (
            <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded">
              Explicit
            </span>
          )}
        </div>
        <div className="text-sm text-gray-600">{artistNames}</div>
        <div className="text-xs text-gray-500">Album: {song.album.name}</div>
        <div className="text-xs text-gray-500">Duration: {song.duration}</div>
      </div>
      <button onClick={() => handlePlay(song.videoId)}>Play</button>
    </div>
  );
}
