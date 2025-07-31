import { Golos_Text } from "next/font/google";

const golos = Golos_Text({ weight: ["400"] });

export default function Lyric({
  lyric,
  active,
  selected,
  handleSelect,
  handleClick,
  isSelecting,
}: {
  lyric: any;
  active: boolean;
  selected: boolean;
  handleSelect: (lyric: any) => void;
  handleClick: (lyric: any) => void;
  isSelecting: boolean;
}) {
  return (
    <div
      className={`${golos.className} 
        
        ${active && selected ? "bg-white text-black border-1" : "text-gray-500"}

        ${!selected && active ? "text-white" : "text-gray-500"}  ${
        selected && !active ? "bg-gray-1000 text-white border" : "text-gray-500"
      }
        cursor-pointer
        p-2
        text-xl
        `}
      onClick={() => {
        if (isSelecting) {
          handleSelect(lyric);
        } else {
          handleClick(lyric);
        }
      }}
    >
      {lyric.text}
    </div>
  );
}
