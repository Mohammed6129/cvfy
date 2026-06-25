"use client";

export default function HomeHeroBanner() {
  return (
    <div className="w-full" style={{ margin: 0, padding: 0, lineHeight: 0 }}>
      <iframe
        src="/banner/hero-banner.html"
        title="CVfy banner"
        scrolling="no"
        className="block w-full border-0"
        style={{
          height: "480px",
          display: "block",
          margin: 0,
          padding: 0,
          background: "transparent",
        }}
        // @ts-expect-error – needed for true iframe transparency
        allowTransparency="true"
        aria-hidden
        tabIndex={-1}
      />
    </div>
  );
}
