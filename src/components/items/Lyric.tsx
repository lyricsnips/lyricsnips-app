export default function Lyric({
  lyric,
  active,
  selected,
  handleSelect,
}: {
  lyric: any;
  active: boolean;
  selected: any;
  handleSelect: (lyric: any) => void;
}) {
  return (
    <div className="py-1 px-2 border-b">
      <span
        style={{
          color: active ? "red" : "white",
          backgroundColor: selected ? "green" : "black",
        }}
        onClick={() => handleSelect(lyric)}
      >
        {lyric.text}
      </span>
    </div>
  );
}
