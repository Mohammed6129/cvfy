"use client";

function SaudiPerson({
  id,
  x,
  y,
  scale = 1,
  flip = false,
  variant,
}: {
  id: string;
  x: number;
  y: number;
  scale?: number;
  flip?: boolean;
  variant: "writer" | "organizer";
}) {
  const transform = `translate(${x} ${y}) scale(${flip ? -scale : scale}, ${scale})`;

  return (
    <g className={`cv-gen-person cv-gen-person-${variant}`} transform={transform}>
      <g className="cv-gen-walk-bob">
        {/* legs */}
        <rect x="-3" y="14" width="2.5" height="7" rx="1" fill="#e2e8f0" className="cv-gen-leg-left" />
        <rect x="0.5" y="14" width="2.5" height="7" rx="1" fill="#e2e8f0" className="cv-gen-leg-right" />

        {/* thobe */}
        <path d="M-6 8 L6 8 L5 16 L-5 16 Z" fill="#ffffff" stroke="#378ADD" strokeWidth="0.4" />
        <line x1="-4" y1="10" x2="4" y2="10" stroke="#378ADD" strokeWidth="0.3" opacity="0.35" />

        {/* head + shemagh */}
        <circle cx="0" cy="5" r="3.2" fill={`url(#shemagh-${id})`} stroke="#378ADD" strokeWidth="0.3" />
        {/* agal */}
        <ellipse cx="0" cy="4.2" rx="3.6" ry="1.1" fill="none" stroke="#1e293b" strokeWidth="0.7" />
        <ellipse cx="0" cy="5.2" rx="3.6" ry="1.1" fill="none" stroke="#1e293b" strokeWidth="0.7" />
        {/* flowing shemagh ends */}
        <path
          d="M-3.2 5 Q-6 6 -5.5 9 Q-4.5 8 -3.5 6.5 Z"
          fill={`url(#shemagh-${id})`}
          className="cv-gen-shemagh-tail"
        />
        <path
          d="M3.2 5 Q6 6 5.5 9 Q4.5 8 3.5 6.5 Z"
          fill={`url(#shemagh-${id})`}
          className="cv-gen-shemagh-tail cv-gen-shemagh-tail-right"
        />

        {variant === "writer" && (
          <g className="cv-gen-pen-arm">
            <line x1="4" y1="9" x2="9" y2="6" stroke="#378ADD" strokeWidth="0.6" strokeLinecap="round" />
            <line x1="9" y1="6" x2="11" y2="5" stroke="#1e293b" strokeWidth="0.5" strokeLinecap="round" className="cv-gen-pen-tip" />
          </g>
        )}

        {variant === "organizer" && (
          <g className="cv-gen-ruler-arm">
            <rect x="3" y="7.5" width="12" height="1.8" rx="0.4" fill="#ffffff" stroke="#378ADD" strokeWidth="0.4" />
            <line x1="5" y1="8.4" x2="13" y2="8.4" stroke="#378ADD" strokeWidth="0.25" opacity="0.6" />
            <line x1="6" y1="7.8" x2="6" y2="9" stroke="#378ADD" strokeWidth="0.3" />
            <line x1="9" y1="7.8" x2="9" y2="9" stroke="#378ADD" strokeWidth="0.3" />
            <line x1="12" y1="7.8" x2="12" y2="9" stroke="#378ADD" strokeWidth="0.3" />
          </g>
        )}
      </g>
    </g>
  );
}

function RegularPerson({
  x,
  y,
  scale = 1,
  flip = false,
  variant,
}: {
  x: number;
  y: number;
  scale?: number;
  flip?: boolean;
  variant: "papers" | "climber";
}) {
  const transform = `translate(${x} ${y}) scale(${flip ? -scale : scale}, ${scale})`;

  return (
    <g className={`cv-gen-person cv-gen-person-${variant}`} transform={transform}>
      <g className={variant === "papers" ? "cv-gen-walk-bob cv-gen-walker-papers" : "cv-gen-climber-body"}>
        <rect x="-3" y="14" width="2.5" height="7" rx="1" fill="#334155" className="cv-gen-leg-left" />
        <rect x="0.5" y="14" width="2.5" height="7" rx="1" fill="#334155" className="cv-gen-leg-right" />
        <rect x="-5" y="8" width="10" height="8" rx="1.5" fill="#378ADD" opacity="0.85" />
        <rect x="-4" y="9" width="8" height="1" rx="0.3" fill="#ffffff" opacity="0.5" />
        <circle cx="0" cy="5" r="3" fill="#fcd9b6" stroke="#378ADD" strokeWidth="0.3" />

        {variant === "papers" && (
          <g className="cv-gen-paper-stack">
            <rect x="4" y="6" width="5" height="7" rx="0.4" fill="#ffffff" stroke="#378ADD" strokeWidth="0.35" transform="rotate(8 6.5 9.5)" />
            <rect x="5.5" y="5" width="5" height="7" rx="0.4" fill="#e8f2fc" stroke="#378ADD" strokeWidth="0.35" transform="rotate(-4 8 8.5)" />
            <line x1="6" y1="7" x2="9" y2="7" stroke="#378ADD" strokeWidth="0.3" opacity="0.5" />
            <line x1="6" y1="8.5" x2="9" y2="8.5" stroke="#378ADD" strokeWidth="0.3" opacity="0.5" />
          </g>
        )}

        {variant === "climber" && (
          <g>
            <rect x="-4" y="7" width="3" height="2" rx="0.5" fill="#fcd9b6" />
            <rect x="1" y="9" width="3" height="2" rx="0.5" fill="#fcd9b6" />
          </g>
        )}
      </g>
    </g>
  );
}

export default function CvGenerationLoader() {
  return (
    <div
      className="cv-gen-loader animate-fade-in rounded-2xl border border-slate-100 bg-white px-4 py-8 text-center shadow-lg sm:px-8 sm:py-10"
      role="status"
      aria-live="polite"
      aria-label="جاري إنشاء سيرتك الذاتية"
    >
      <svg
        viewBox="0 0 500 300"
        className="mx-auto h-auto w-full max-w-xl"
        aria-hidden="true"
      >
        <defs>
          <pattern id="shemagh-sa1" patternUnits="userSpaceOnUse" width="3" height="3">
            <rect width="1.5" height="3" fill="#c41e3a" />
            <rect x="1.5" width="1.5" height="3" fill="#ffffff" />
          </pattern>
          <pattern id="shemagh-sa2" patternUnits="userSpaceOnUse" width="3" height="3">
            <rect width="1.5" height="3" fill="#c41e3a" />
            <rect x="1.5" width="1.5" height="3" fill="#ffffff" />
          </pattern>
          <linearGradient id="cv-shadow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#378ADD" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#378ADD" stopOpacity="0.02" />
          </linearGradient>
          <filter id="cv-soft-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#378ADD" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* floor hint */}
        <ellipse cx="250" cy="278" rx="190" ry="10" fill="#378ADD" opacity="0.06" />

        {/* CV paper */}
        <g transform="translate(250 155)">
          <g className="cv-gen-paper" filter="url(#cv-soft-shadow)">
            <rect
              x="-140"
              y="-105"
              width="280"
              height="210"
              rx="8"
              fill="#ffffff"
              stroke="#378ADD"
              strokeWidth="2"
            />
            <rect x="-140" y="-105" width="280" height="210" rx="8" fill="url(#cv-shadow)" />

            {/* header bar */}
            <rect x="-130" y="-95" width="120" height="14" rx="3" fill="#378ADD" opacity="0.12" className="cv-gen-line-fade" />
            <rect x="-130" y="-75" width="200" height="6" rx="2" fill="#378ADD" opacity="0.08" />

            {/* faint writing lines */}
            {[
              { y: -58, w: 220 },
              { y: -44, w: 200 },
              { y: -30, w: 215 },
              { y: -16, w: 185 },
              { y: -2, w: 210 },
              { y: 12, w: 195 },
              { y: 26, w: 205 },
              { y: 40, w: 170 },
              { y: 54, w: 190 },
              { y: 68, w: 160 },
              { y: 82, w: 175 },
            ].map((line, i) => (
              <rect
                key={line.y}
                x={-130}
                y={line.y}
                width={line.w}
                height="3"
                rx="1.5"
                fill="#378ADD"
                opacity={0.1 + (i % 3) * 0.04}
                className="cv-gen-text-line"
                style={{ animationDelay: `${i * 0.18}s` }}
              />
            ))}

            {/* section dividers */}
            <line x1="-130" y1="20" x2="130" y2="20" stroke="#378ADD" strokeWidth="0.6" opacity="0.15" strokeDasharray="4 4" className="cv-gen-section-line" />
            <line x1="-130" y1="55" x2="130" y2="55" stroke="#378ADD" strokeWidth="0.6" opacity="0.15" strokeDasharray="4 4" className="cv-gen-section-line" style={{ animationDelay: "0.5s" }} />

            {/* pen writing trail */}
            <path
              d="M-90 -20 Q-70 -18 -55 -20"
              fill="none"
              stroke="#378ADD"
              strokeWidth="1.2"
              strokeLinecap="round"
              className="cv-gen-ink-trail"
            />
          </g>

          {/* Saudi writer on CV */}
          <g className="cv-gen-writer-pos">
            <SaudiPerson id="sa1" x={-75} y={-5} scale={1.15} variant="writer" />
          </g>

          {/* Saudi organizer on CV */}
          <g className="cv-gen-organizer-pos">
            <SaudiPerson id="sa2" x={35} y={-35} scale={1.1} flip variant="organizer" />
          </g>
        </g>

        {/* ladder */}
        <g className="cv-gen-ladder" transform="translate(368 148)">
          <line x1="-6" y1="-70" x2="-6" y2="75" stroke="#378ADD" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
          <line x1="6" y1="-70" x2="6" y2="75" stroke="#378ADD" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
          {[-55, -30, -5, 20, 45, 70].map((rung) => (
            <line
              key={rung}
              x1="-6"
              y1={rung}
              x2="6"
              y2={rung}
              stroke="#378ADD"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.55"
            />
          ))}
        </g>

        {/* climber on ladder */}
        <g className="cv-gen-climber-pos">
          <RegularPerson x={368} y={95} scale={1.2} variant="climber" />
        </g>

        {/* paper carrier walking around */}
        <g className="cv-gen-papers-pos">
          <RegularPerson x={80} y={248} scale={1.25} variant="papers" />
        </g>

        {/* decorative sparkles */}
        <circle cx="95" cy="55" r="2" fill="#378ADD" opacity="0.35" className="cv-gen-sparkle" />
        <circle cx="410" cy="70" r="1.5" fill="#378ADD" opacity="0.3" className="cv-gen-sparkle" style={{ animationDelay: "0.6s" }} />
        <circle cx="430" cy="220" r="2" fill="#378ADD" opacity="0.25" className="cv-gen-sparkle" style={{ animationDelay: "1.1s" }} />
      </svg>

      <h2 className="mt-4 text-xl font-extrabold text-slate-900 sm:text-2xl">
        جاري إنشاء سيرتك الذاتية
        <span className="cv-gen-dots" aria-hidden="true">
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </span>
      </h2>
      <p className="mt-2 text-sm text-slate-500">فريقنا يجهّز سيرتك الاحترافية الآن</p>
    </div>
  );
}
