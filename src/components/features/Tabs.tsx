import { useTabContext } from "@/contexts/CurrentTabContext";
import { useSearchResults } from "@/contexts/SearchResultsContext";
import { Geo } from "next/font/google";
import { Search, FlameIcon } from "lucide-react";

const geo = Geo({
  weight: ["400"],
  subsets: ["latin"],
});

export default function Tabs() {
  const { currentTab, setTab } = useTabContext();
  const { results } = useSearchResults();

  return (
    <div className="mt-2 mb-2 flex gap-4 w-full">
      {results.length > 0 && (
        <button
          onClick={() => setTab("search")}
          className={`${geo.className} ${
            currentTab === "search"
              ? "border-black bg-white text-black"
              : "border-white bg-black text-white-700 hover:bg-white hover:text-black hover:border-black"
          } px-3 py-1 font-semibold border cursor-pointer transition w-full flex items-center justify-center gap-1`}
        >
          <Search size="18" />
          Search Results
        </button>
      )}
      <button
        onClick={() => setTab("trending")}
        className={`${geo.className} ${
          currentTab === "trending"
            ? "border-black bg-white text-black"
            : "border-white bg-black text-white-700 hover:bg-white hover:text-black hover:border-black"
        } px-3 py-1 font-semibold border cursor-pointer transition w-full flex items-center justify-center gap-1`}
      >
        <FlameIcon size="18" />
        Trending
      </button>
    </div>
  );
}
