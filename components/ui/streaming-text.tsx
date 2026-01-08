
import { useEffect, useState, useRef } from "react";

interface StreamingTextProps {
  content: string;
  speed?: number;
  className?: string;
}

export function StreamingText({ content, speed = 10, className = "" }: StreamingTextProps) {
  const [displayedContent, setDisplayedContent] = useState("");
  const index = useRef(0);

  useEffect(() => {
    // If content was reset or changed significantly downwards, reset
    if (content.length < index.current) {
      index.current = content.length;
      setDisplayedContent(content);
      return;
    }

    const interval = setInterval(() => {
      if (index.current < content.length) {
        setDisplayedContent((prev) => prev + content.charAt(index.current));
        index.current++;
      } else {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [content, speed]);

  // If content matches displayed, we are synced (or initial render)
  // But we want to ensure we don't flash empty if content is provided immediately (SSR/hydration edge cases)
  // For streaming, starting empty and growing is fine.

  return (
    <div className={`whitespace-pre-wrap break-words leading-relaxed ${className}`}>
      {displayedContent}
    </div>
  );
}
