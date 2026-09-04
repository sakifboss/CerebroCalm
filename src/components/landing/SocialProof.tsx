"use client";

import React, { useEffect, useState } from "react";
import { Users } from "lucide-react";

interface SocialProofProps {
  initialCount?: number;
}

export const SocialProof: React.FC<SocialProofProps> = ({ initialCount = 524 }) => {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    // Optionally sync with backend registration count
    fetch("/api/register")
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.count === "number") {
          setCount(data.count);
        }
      })
      .catch(() => {});
  }, []);

  const avatars = [
    { initials: "AT", bg: "bg-emerald-900/60 text-emerald-300 border-emerald-700/50" },
    { initials: "RK", bg: "bg-amber-900/60 text-amber-300 border-amber-700/50" },
    { initials: "SL", bg: "bg-blue-900/60 text-blue-300 border-blue-700/50" },
    { initials: "MD", bg: "bg-purple-900/60 text-purple-300 border-purple-700/50" },
  ];

  return (
    <section className="flex flex-col sm:flex-row items-center justify-center gap-3 py-4 text-xs text-calm-text-muted">
      {/* Overlapping circular avatar badges */}
      <div className="flex items-center -space-x-2">
        {avatars.map((av, idx) => (
          <div
            key={idx}
            className={`w-7 h-7 rounded-full border flex items-center justify-center text-[10px] font-bold shadow-xs ${av.bg}`}
          >
            {av.initials}
          </div>
        ))}
        <div className="w-7 h-7 rounded-full border border-calm-border bg-calm-bg-card flex items-center justify-center text-[10px] font-bold text-calm-text shadow-xs">
          +{count - avatars.length}
        </div>
      </div>

      {/* Social proof text */}
      <div className="flex items-center gap-1.5">
        <span className="font-semibold text-calm-text">
          Join {count}+ people
        </span>
        <span>already registered</span>
      </div>
    </section>
  );
};
