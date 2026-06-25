"use client";

import { useEffect, useRef } from "react";

export default function HomeHeroBanner() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const resize = () => {
      try {
        const doc = iframe.contentDocument;
        if (!doc) return;
        const body = doc.body;
        const html = doc.documentElement;
        const h = Math.max(
          body.scrollHeight,
          body.offsetHeight,
          html.scrollHeight,
          html.offsetHeight,
        );
        if (h > 0) iframe.style.height = `${h}px`;
      } catch {
        // cross-origin guard
      }
    };

    iframe.addEventListener("load", () => {
      resize();
      // recheck after animations settle
      window.setTimeout(resize, 500);
      window.setTimeout(resize, 1500);
    });
  }, []);

  return (
    <div className="w-full overflow-hidden">
      <iframe
        ref={iframeRef}
        src="/banner/hero-banner.html"
        title="CVfy banner"
        scrolling="no"
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore — non-standard but needed for bg transparency in some browsers
        allowTransparency="true"
        className="block w-full border-0"
        style={{
          height: "min(56vw, 700px)",
          minHeight: "460px",
          background: "transparent",
        }}
        aria-hidden
        tabIndex={-1}
      />
    </div>
  );
}
