const NPCBubble = ({ message }: { message: string }) => {
  return (
    <div className="relative  bg-gray-200 text-black border-4 border-black px-4 py-2 w-fit max-w-sm font-mono text-base shadow-lg">
      {message}

      {/* Triangle tail using borders only */}
      <div className="absolute top-full left-10 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-black" />
    </div>
  );
};

export default NPCBubble;
