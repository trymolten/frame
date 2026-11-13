import { useState, useEffect } from "react";
import Image from "next/image";

const ShimmerMessage = () => {
  const messages = [
    "Thinking...",
    "Loading...",
    "Generating...",
    "Analyzing your request...",
    "Building your website...",
    "Crafting components...",
    "Optimizing layout...",
    "Adding final touches...",
    "Almost ready...",
  ];

  const [currentMessageIndex, setCurrentMessageIndex] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="flex items-center gap-2">
      <span className="text-base text-muted-foreground animate-pulse">
        {messages[currentMessageIndex]}
      </span>
    </div>
  );
};

const ProjectMessageLoading = () => {
  return (
    <div className="flex flex-col group px-2 mb-2">
      <div className="flex items-center gap-2 pl-2 mb-2">
        <Image
          src="/logo.png"
          alt="Molten"
          width={32}
          height={32}
          className="shrink-0"
        />
        <span className="text-sm font-medium">Molten</span>
      </div>
      <div className="pl-8.5 flex flex-col gap-y-4">
        <ShimmerMessage />
      </div>
    </div>
  );
};

export default ProjectMessageLoading;
