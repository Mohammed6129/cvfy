"use client";

export default function HomeHeroBanner() {
  return (
    <section
      dir="rtl"
      aria-hidden
      style={{ position: "relative", overflow: "hidden", height: "420px" }}
    >
      {/* Glow behind map */}
      <div
        style={{
          position: "absolute",
          left: "28%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: "340px",
          height: "340px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(91,163,232,0.28) 0%, rgba(91,163,232,0) 70%)",
          filter: "blur(10px)",
          pointerEvents: "none",
        }}
      />

      {/* Floating particles */}
      {[
        { w: 6, top: "15%", left: "60%", delay: "0s" },
        { w: 4, top: "70%", left: "80%", delay: "3s" },
        { w: 5, top: "40%", left: "90%", delay: "6s" },
        { w: 3, top: "25%", left: "35%", delay: "2s" },
      ].map((p, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            width: p.w,
            height: p.w,
            borderRadius: "50%",
            background: "#5BA3E8",
            opacity: 0.18,
            top: p.top,
            left: p.left,
            animation: `bannerFloat 14s ease-in-out ${p.delay} infinite`,
          }}
        />
      ))}

      {/* Content: centered container 1100px */}
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "0 24px",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "32px",
        }}
      >
        {/* Text — right side (RTL: renders first) */}
        <div
          style={{
            flex: "0 0 44%",
            maxWidth: "44%",
            textAlign: "right",
            animation: "bannerFadeUp 0.8s ease-out 0.2s both",
          }}
        >
          <h2
            style={{
              fontSize: "clamp(26px, 3.4vw, 44px)",
              lineHeight: 1.32,
              fontWeight: 700,
              color: "#ffffff",
              margin: 0,
            }}
          >
            منصة السيرة الذاتية{" "}
            <span style={{ color: "#FAC775", fontWeight: 800 }}>الأولى</span>
            <br />
            لسوق العمل السعودي
          </h2>
        </div>

        {/* Saudi map SVG — left side */}
        <div
          style={{
            flex: "0 0 38%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "92%",
            position: "relative",
          }}
        >
          <object
            data="/banner/saudi-map.svg"
            type="image/svg+xml"
            style={{
              width: "100%",
              maxWidth: "380px",
              height: "auto",
              filter: "drop-shadow(0 20px 50px rgba(0,0,0,0.25))",
            }}
            aria-hidden
          />
        </div>
      </div>

      <style>{`
        @keyframes bannerFloat {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-22px) translateX(10px); }
        }
        @keyframes bannerFadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
