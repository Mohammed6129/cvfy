"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

function randomLiveCount() {
  return Math.floor(1180 + Math.random() * (1350 - 1180 + 1));
}

export default function HeroLiveBar() {
  const [liveCount, setLiveCount] = useState(1240);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setLiveCount(randomLiveCount());
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#185FA5] bg-[#0C447C] md:static md:z-auto">
      <div className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-between gap-3 px-6 py-3.5 text-white md:px-12">
        <p className="text-sm">
          <span id="live" className="font-bold tabular-nums">
            {liveCount.toLocaleString("en-US")}
          </span>{" "}
          شخص يبني سيرته الآن على CVfy
        </p>

        <Link
          href="/login?next=/create"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-[#378ADD] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#2a6bb8]"
        >
          ابدأ الآن ←
        </Link>
      </div>
    </div>
  );
}
