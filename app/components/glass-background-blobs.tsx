import React from "react";

const BLOB_BASE: React.CSSProperties = {
  position: "absolute",
  borderRadius: "50%",
  filter: "blur(80px)",
  pointerEvents: "none",
  willChange: "transform",
};

// Global blobs — cover the entire page via fixed positioning
const GLOBAL_BLOBS: React.CSSProperties[] = [
  { ...BLOB_BASE, width: 500, height: 500, background: "#85B7EB", top: "5vh", right: "-5vw", opacity: 0.3 },
  { ...BLOB_BASE, width: 400, height: 400, background: "#378ADD", top: "40vh", left: "-8vw", opacity: 0.2 },
  { ...BLOB_BASE, width: 320, height: 320, background: "#FAC775", top: "70vh", right: "10vw", opacity: 0.12 },
  { ...BLOB_BASE, width: 260, height: 260, background: "#7F77DD", top: "20vh", left: "25vw", opacity: 0.13 },
];

export function GlobalBackgroundBlobs() {
  return (
    <div
      style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}
      aria-hidden
    >
      {GLOBAL_BLOBS.map((style, i) => (
        <div key={i} style={style} />
      ))}
    </div>
  );
}

// Legacy inline blobs — kept for any component that still needs local blobs
export default function GlassBackgroundBlobs() {
  return null;
}
