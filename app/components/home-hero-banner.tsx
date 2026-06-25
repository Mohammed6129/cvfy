"use client";

import { useEffect, useRef } from "react";

export default function HomeHeroBanner() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Sync iframe height to its content after load
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const onLoad = () => {
      try {
        const doc = iframe.contentDocument;
        if (doc) {
          const h = doc.documentElement.scrollHeight;
          if (h > 0) iframe.style.height = `${h}px`;
        }
      } catch {
        // cross-origin — leave height as CSS
      }
    };
    iframe.addEventListener("load", onLoad);
    return () => iframe.removeEventListener("load", onLoad);
  }, []);

  return (
    <div className="w-full overflow-hidden">
      <iframe
        ref={iframeRef}
        src="/banner/hero-banner.html"
        title="CVfy banner"
        className="block w-full border-0"
        style={{ height: "clamp(420px, 50vw, 680px)", display: "block" }}
        scrolling="no"
        aria-hidden
        tabIndex={-1}
      />
    </div>
  );
}
