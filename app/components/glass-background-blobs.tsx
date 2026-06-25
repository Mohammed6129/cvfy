const BLOB_BASE: React.CSSProperties = {
  position: "absolute",
  borderRadius: "50%",
  filter: "blur(50px)",
  pointerEvents: "none",
  willChange: "transform",
};

const BLOBS: React.CSSProperties[] = [
  { ...BLOB_BASE, width: 240, height: 240, background: "#85B7EB", top: -80, right: -60, opacity: 0.45 },
  { ...BLOB_BASE, width: 200, height: 200, background: "#FAC775", bottom: 60, left: -70, opacity: 0.25 },
  { ...BLOB_BASE, width: 160, height: 160, background: "#C0DD97", top: 280, right: 40, opacity: 0.2 },
  { ...BLOB_BASE, width: 140, height: 140, background: "#7F77DD", top: 50, left: 30, opacity: 0.2 },
];

export default function GlassBackgroundBlobs() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      {BLOBS.map((style, i) => (
        <div key={i} style={style} />
      ))}
    </div>
  );
}
