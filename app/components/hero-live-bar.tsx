"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LogoIcon } from "./brand-logo";

function randomLiveCount() {
  return Math.floor(1180 + Math.random() * (1350 - 1180));
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
    <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-wrap items-center justify-center gap-3 bg-[#0C447C] px-6 py-3.5 text-white sm:justify-between md:static md:z-auto md:px-8">
      <div className="flex items-center gap-2.5 text-sm">
        <LogoIcon className="[&_rect]:fill-[#1a3d6b]" />
        <span>
          <span id="live" className="font-bold tabular-nums">
            {liveCount.toLocaleString("en-US")}
          </span>{" "}
          شخص يبني سيرته الآن على CVfy
        </span>
      </div>

      <Link
        href="/login?next=/create"
        className="inline-flex items-center gap-1.5 rounded-lg bg-[#378ADD] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#2a6bb8]"
      >
        ابدأ الآن ←
      </Link>
    </div>
  );
}
