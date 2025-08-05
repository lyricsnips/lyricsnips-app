import { Sparkle, X, Send } from "lucide-react";
import { askGemini } from "@/adapters/lyricAdapter";
import { useSelectedLyrics } from "@/contexts/SelectedLyricsContext";
import { useState } from "react";

interface LyricData {
  id: string;
  text: string;
  start_time: number;
  end_time: number;
  start?: number;
  duration?: number;
}

interface SongInfo {
  videoId: string;
  title: string;
  author: string;
  thumbnails: Array<{ url: string }>;
  duration?: string;
  isExplicit?: boolean;
  timesShared?: number;
}

interface AskChatBotProps {
  setAsking: (asking: boolean) => void;
  songInfo: SongInfo;
  lyrics: LyricData[];
}

export default function AskChatBot({
  setAsking,
  songInfo,
  lyrics,
}: AskChatBotProps) {
  const [query, setQuery] = useState<string>("");
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { selectedLyrics } = useSelectedLyrics();

  const onAsk = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    setAnswer("");

    const body = {
      query: query,
      context: lyrics,
      selectedLyrics: selectedLyrics,
      songInfo: songInfo,
    };

    try {
      const res = await askGemini(body);
      if (res.data) {
        setAnswer(res.data.answer);
      }
    } catch {
      setAnswer("Sorry, I couldn't process your question. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      onAsk();
    }
  };

  const clearAnswer = () => {
    setAnswer("");
    setQuery("");
  };

  return (
    <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-3 w-full max-w-md px-4">
      {/* Answer Popup Box */}
      {answer && (
        <div className="bg-black border border-gray-700  p-4 w-full shadow-lg">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              <Sparkle size="16" color="white" />
              <span className="text-sm font-medium">AI Response</span>
            </div>
            <button
              onClick={clearAnswer}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size="16" />
            </button>
          </div>
          <div className="text-white text-sm leading-relaxed overflow-x-auto max-h-screen">
            {answer}
          </div>
        </div>
      )}

      {/* Loading Indicator */}
      {isLoading && (
        <div className="bg-black border border-gray-700  p-3 w-full shadow-lg">
          <div className="flex items-center gap-2 text-white text-sm">
            <Sparkle size="16" className="animate-spin" />
            <span>Thinking...</span>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="w-full flex gap-2 justify-center items-center px-4 py-2 bg-black border border-white ">
        <Sparkle size="20" />
        <input
          type="text"
          className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-400"
          placeholder="Ask about the lyrics..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />
        <Send
          size="18"
          onClick={onAsk}
          className={`cursor-pointer ${
            isLoading ? "opacity-50" : "hover:text-blue-400"
          } transition-colors`}
        />
        <X
          color="red"
          onClick={() => setAsking(false)}
          className="cursor-pointer hover:opacity-80 transition-opacity"
        />
      </div>
    </div>
  );
}
