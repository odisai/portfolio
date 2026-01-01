"use client";

import { useState, useEffect } from "react";

interface LiveTimestampProps {
  className?: string;
}

export function LiveTimestamp({ className }: LiveTimestampProps) {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "short",
      });
      setTime(formatted);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!time) return null;

  return (
    <span className={className}>
      {time}
    </span>
  );
}
