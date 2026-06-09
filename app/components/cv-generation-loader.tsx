"use client";

const CHAR_SCALE = 3;

function SaudiPerson({
  id,
  x,
  y,
  scale = CHAR_SCALE,
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
        <rect x="-3" y="14" width="2.8" height="7.5" rx="1" fill="#e2e8f0" className="cv-gen-leg-left" />
        <rect x="0.2" y="14" width="2.8" height="7.5" rx="1" fill="#e2e8f0" className="cv-gen-leg-right" />

        {/* thobe */}
        <path d="M-6.5 8 L6.5 8 L5.5 17 L-5.5 17 Z" fill="#ffffff" stroke="#378ADD" strokeWidth="0.55" />
        <line x1="-4.5" y1="10.5" x2="4.5" y2="10.5" stroke="#378ADD" strokeWidth="0.4" opacity="0.4" />
        <line x1="-3" y1="13" x2="3" y2="13" stroke="#378ADD" strokeWidth="0.3" opacity="0.25" />

        {/* shemagh drape over shoulders */}
        <path
          d="M-5 7.5 Q0 9.5 5 7.5 L4.5 10 Q0 11.5 -4.5 10 Z"
          fill={`url(#shemagh-${id})`}
          stroke="#c41e3a"
          strokeWidth="0.35"
        />

        {/* head under shemagh */}
        <circle cx="0" cy="5.2" r="0.9" fill="#fcd9b6" opacity="0.5" />

        {/* shemagh head wrap */}
        <circle cx="0" cy="4.8" r="3.6" fill={`url(#shemagh-${id})`} stroke="#c41e3a" strokeWidth="0.5" />
        {/* shemagh fold lines */}
        <path d="M-2.5 3.5 Q0 5.5 2.5 3.5" fill="none" stroke="#ffffff" strokeWidth="0.45" opacity="0.7" />
        <path d="M-3 6 Q0 7.8 3 6" fill="none" stroke="#ffffff" strokeWidth="0.35" opacity="0.55" />

        {/* agal — double black cord */}
        <ellipse cx="0" cy="3.6" rx="4" ry="1.25" fill="none" stroke="#0f172a" strokeWidth="1.1" />
        <ellipse cx="0" cy="4.85" rx="4" ry="1.25" fill="none" stroke="#0f172a" strokeWidth="1.1" />
        <line x1="-4" y1="4.2" x2="4" y2="4.2" stroke="#0f172a" strokeWidth="0.35" opacity="0.5" />

        {/* flowing shemagh ends */}
        <path
          d="M-3.5 5.5 Q-8 7 -7 12 Q-5.5 10.5 -4 7.5 Z"
          fill={`url(#shemagh-${id})`}
          stroke="#c41e3a"
          strokeWidth="0.4"
          className="cv-gen-shemagh-tail"
        />
        <path
          d="M3.5 5.5 Q8 7 7 12 Q5.5 10.5 4 7.5 Z"
          fill={`url(#shemagh-${id})`}
          stroke="#c41e3a"
          strokeWidth="0.4"
          className="cv-gen-shemagh-tail cv-gen-shemagh-tail-right"
        />

        {variant === "writer" && (
          <g className="cv-gen-pen-arm">
            <line x1="4.5" y1="9" x2="10" y2="5.5" stroke="#378ADD" strokeWidth="0.75" strokeLinecap="round" />
            <line x1="10" y1="5.5" x2="12.5" y2="4" stroke="#1e293b" strokeWidth="0.65" strokeLinecap="round" className="cv-gen-pen-tip" />
            <circle cx="12.5" cy="4" r="0.5" fill="#378ADD" />
          </g>
        )}

        {variant === "organizer" && (
          <g className="cv-gen-ruler-arm">
            <rect x="3" y="7" width="14" height="2.2" rx="0.5" fill="#ffffff" stroke="#378ADD" strokeWidth="0.55" />
            <line x1="5" y1="8.1" x2="15" y2="8.1" stroke="#378ADD" strokeWidth="0.35" opacity="0.7" />
            <line x1="6.5" y1="7.4" x2="6.5" y2="9" stroke="#378ADD" strokeWidth="0.45" />
            <line x1="9.5" y1="7.4" x2="9.5" y2="9" stroke="#378ADD" strokeWidth="0.45" />
            <line x1="12.5" y1="7.4" x2="12.5" y2="9" stroke="#378ADD" strokeWidth="0.45" />
          </g>
        )}
      </g>
    </g>
  );
}

function RegularPerson({
  x,
  y,
  scale = CHAR_SCALE,
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
        <rect x="-3" y="14" width="2.8" height="7.5" rx="1" fill="#334155" className="cv-gen-leg-left" />
        <rect x="0.2" y="14" width="2.8" height="7.5" rx="1" fill="#334155" className="cv-gen-leg-right" />
        <rect x="-5.5" y="8" width="11" height="8.5" rx="1.5" fill="#378ADD" opacity="0.9" />
        <rect x="-4.5" y="9" width="9" height="1.2" rx="0.3" fill="#ffffff" opacity="0.55" />
        <circle cx="0" cy="5" r="3.2" fill="#fcd9b6" stroke="#378ADD" strokeWidth="0.45" />

        {variant === "papers" && (
          <g className="cv-gen-paper-stack">
            <rect x="4" y="5.5" width="6" height="8" rx="0.5" fill="#ffffff" stroke="#378ADD" strokeWidth="0.45" transform="rotate(8 7 9.5)" />
            <rect x="5.5" y="4.5" width="6" height="8" rx="0.5" fill="#e8f2fc" stroke="#378ADD" strokeWidth="0.45" transform="rotate(-4 8.5 8.5)" />
            <line x1="6.5" y1="7" x2="10" y2="7" stroke="#378ADD" strokeWidth="0.4" opacity="0.55" />
            <line x1="6.5" y1="8.8" x2="10" y2="8.8" stroke="#378ADD" strokeWidth="0.4" opacity="0.55" />
          </g>
        )}

        {variant === "climber" && (
          <g>
            <rect x="-4.5" y="7" width="3.5" height="2.2" rx="0.5" fill="#fcd9b6" stroke="#378ADD" strokeWidth="0.3" />
            <rect x="1" y="9" width="3.5" height="2.2" rx="0.5" fill="#fcd9b6" stroke="#378ADD" strokeWidth="0.3" />
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
        viewBox="0 0 500 380"
        className="mx-auto h-auto w-full max-w-2xl"
        aria-hidden="true"
      >
        <defs>
          <pattern id="shemagh-sa1" patternUnits="userSpaceOnUse" width="5" height="5">
            <rect width="2.5" height="5" fill="#c41e3a" />
            <rect x="2.5" width="2.5" height="5" fill="#ffffff" />
          </pattern>
          <pattern id="shemagh-sa2" patternUnits="userSpaceOnUse" width="5" height="5">
            <rect width="2.5" height="5" fill="#c41e3a" />
            <rect x="2.5" width="2.5" height="5" fill="#ffffff" />
          </pattern>
          <linearGradient id="cv-shadow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#378ADD" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#378ADD" stopOpacity="0.02" />
          </linearGradient>
          <filter id="cv-soft-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#378ADD" floodOpacity="0.15" />
          </filter>
        </defs>

        <ellipse cx="250" cy="352" rx="190" ry="12" fill="#378ADD" opacity="0.06" />

        {/* CV paper */}
        <g transform="translate(250 175)">
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

            <rect x="-130" y="-95" width="120" height="14" rx="3" fill="#378ADD" opacity="0.12" className="cv-gen-line-fade" />
            <rect x="-130" y="-75" width="200" height="6" rx="2" fill="#378ADD" opacity="0.08" />

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

            <line x1="-130" y1="20" x2="130" y2="20" stroke="#378ADD" strokeWidth="0.6" opacity="0.15" strokeDasharray="4 4" className="cv-gen-section-line" />
            <line x1="-130" y1="55" x2="130" y2="55" stroke="#378ADD" strokeWidth="0.6" opacity="0.15" strokeDasharray="4 4" className="cv-gen-section-line" style={{ animationDelay: "0.5s" }} />

            <path
              d="M-90 -20 Q-70 -18 -55 -20"
              fill="none"
              stroke="#378ADD"
              strokeWidth="1.2"
              strokeLinecap="round"
              className="cv-gen-ink-trail"
            />
          </g>

          <g className="cv-gen-writer-pos">
            <SaudiPerson id="sa1" x={0} y={0} variant="writer" />
          </g>

          <g className="cv-gen-organizer-pos">
            <SaudiPerson id="sa2" x={0} y={0} flip variant="organizer" />
          </g>
        </g>

        <g className="cv-gen-ladder" transform="translate(368 168)">
          <line x1="-7" y1="-75" x2="-7" y2="85" stroke="#378ADD" strokeWidth="3" strokeLinecap="round" opacity="0.75" />
          <line x1="7" y1="-75" x2="7" y2="85" stroke="#378ADD" strokeWidth="3" strokeLinecap="round" opacity="0.75" />
          {[-60, -32, -4, 24, 52, 80].map((rung) => (
            <line
              key={rung}
              x1="-7"
              y1={rung}
              x2="7"
              y2={rung}
              stroke="#378ADD"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.6"
            />
          ))}
        </g>

        <g className="cv-gen-climber-pos">
          <RegularPerson x={0} y={0} variant="climber" />
        </g>

        <g className="cv-gen-papers-pos">
          <RegularPerson x={0} y={0} variant="papers" />
        </g>

        <circle cx="95" cy="65" r="2.5" fill="#378ADD" opacity="0.35" className="cv-gen-sparkle" />
        <circle cx="410" cy="80" r="2" fill="#378ADD" opacity="0.3" className="cv-gen-sparkle" style={{ animationDelay: "0.6s" }} />
        <circle cx="430" cy="280" r="2.5" fill="#378ADD" opacity="0.25" className="cv-gen-sparkle" style={{ animationDelay: "1.1s" }} />
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
