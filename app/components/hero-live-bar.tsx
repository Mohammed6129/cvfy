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
    <div className="glass-surface-nav fixed bottom-0 left-0 right-0 z-50 border-t-0 md:static md:z-auto">
      <div className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-between gap-3 px-6 py-3.5 text-white md:px-12">
        <p className="text-sm text-white/85">
          <span id="live" className="font-bold tabular-nums text-white">
            {liveCount.toLocaleString("en-US")}
          </span>{" "}
          شخص يبني سيرته الآن على CVfy
        </p>

        <Link
          href="/login?next=/create"
          className="glass-surface-cta inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90"
        >
          ابدأ الآن ←
        </Link>
      </div>
    </div>
  );
}
