export default function Lyric({
  lyric,
  active,
}: {
  lyric: Object;
  active: boolean;
}) {
  return (
    <div className="py-1 px-2 border-b">
      <span style={{ color: active ? "red" : "white" }}>{lyric.text}</span>
      <input type="checkbox" name="lyric" id={lyric.id} />
    </div>
  );
}
