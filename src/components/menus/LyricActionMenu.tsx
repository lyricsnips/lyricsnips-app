export default function LyricActionMenu({
  onFavorite,
  onShare,
  onClear,
}: {
  onFavorite?: () => void;
  onShare?: () => void;
  onClear?: () => void;
}) {
  return (
    <div className="flex gap-2">
      <button type="button" onClick={onClear}>
        Clear Selection
      </button>
      <button
        type="button"
        className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
        onClick={onFavorite}
      >
        Favorite
      </button>
      <button
        type="button"
        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={onShare}
      >
        Share
      </button>
    </div>
  );
}
