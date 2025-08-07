"use client";
import { useEffect, useState } from "react";

const CHUNK_WORD_COUNT = 14;

const NPCBubble = ({ message }: { message: string }) => {
  const [chunks, setChunks] = useState<string[]>([]);
  const [chunkIndex, setChunkIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [typingDone, setTypingDone] = useState(false);

  useEffect(() => {
    const words = message.split(" ");
    const splitChunks: string[] = [];
    for (let i = 0; i < words.length; i += CHUNK_WORD_COUNT) {
      splitChunks.push(words.slice(i, i + CHUNK_WORD_COUNT).join(" "));
    }

    setChunks(splitChunks);
    setChunkIndex(0);
  }, [message]);

  useEffect(() => {
    if (!chunks.length) return;
    const currentChunk = chunks[chunkIndex];
    let index = 0;

    setDisplayedText("");
    setTypingDone(false);

    const interval = setInterval(() => {
      if (index <= currentChunk.length) {
        setDisplayedText(currentChunk.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
        setTypingDone(true);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [chunks, chunkIndex]);

  const handleNext = () => {
    if (chunkIndex < chunks.length - 1) {
      setChunkIndex(chunkIndex + 1);
    }
  };

  return (
    <div className="relative bg-gray-200 text-black border-4 border-black px-4 py-2 w-fit max-w-md font-mono text-lg shadow-lg leading-relaxed space-y-2">
      <p>{displayedText}</p>

      {typingDone && chunkIndex < chunks.length - 1 && (
        <div className="flex justify-end">
          <button
            onClick={handleNext}
            className="mt-2 px-3 py-1 bg-black text-white border border-white font-mono text-sm hover:bg-gray-800 transition rounded"
          >
            Next
          </button>
        </div>
      )}

      <div className="absolute top-full left-10 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-black" />
    </div>
  );
};

export default NPCBubble;
