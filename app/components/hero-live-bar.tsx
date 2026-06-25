"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const BASE = 200;

// Realistic tiny drift: ±1 every 10–18 seconds, never goes below 195 or above 206
function nextCount(current: number): number {
  const delta = Math.random() < 0.5 ? -1 : 1;
  const next = current + delta;
  return Math.min(206, Math.max(195, next));
}

export default function HeroLiveBar() {
  const [liveCount, setLiveCount] = useState(BASE);

  useEffect(() => {
    const tick = () => {
      setLiveCount((prev) => nextCount(prev));
      // Next tick in 10–18 seconds
      const delay = 10_000 + Math.random() * 8_000;
      timer = window.setTimeout(tick, delay);
    };

    let timer = window.setTimeout(tick, 12_000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="glass-surface-nav fixed bottom-0 left-0 right-0 z-50 border-t-0 md:static md:z-auto">
      <div className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-between gap-3 px-6 py-3.5 text-white md:px-12">
        <p className="text-sm text-white/85">
          <span
            id="live"
            className="font-bold tabular-nums text-white"
            aria-live="polite"
            aria-atomic="true"
          >
            {liveCount}
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
