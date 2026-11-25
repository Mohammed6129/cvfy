import type { ReactNode } from "react";

/**
 * CVfy illustration set.
 *
 * One vocabulary everywhere: a white sheet, navy ink lines (3px, round caps)
 * and the highlighter as the only accent. Drawn as inline SVG so they stay
 * crisp, weigh nothing, and pick up the brand tokens from CSS.
 */

const INK = "var(--color-ink)";
const MARK = "var(--color-marker)";
const SOFT = "var(--color-marker-soft)";
const LINE = "#c9d0dc";
const PAPER = "#ffffff";

type Tile = "desk" | "paper" | "none";

type IlluProps = {
  className?: string;
  /** Background tile behind the drawing. */
  tile?: Tile;
};

function Frame({ className, tile = "desk", children }: IlluProps & { children: ReactNode }) {
  return (
    <svg viewBox="0 0 190 190" className={className} aria-hidden="true" focusable="false">
      {tile !== "none" && (
        <rect width="190" height="190" rx="16" fill={tile === "desk" ? "var(--color-desk)" : PAPER} />
      )}
      {children}
    </svg>
  );
}

const stroke = { stroke: INK, strokeWidth: 3, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
const grey = { stroke: LINE, strokeWidth: 3, strokeLinecap: "round" as const };

/** You talk, it becomes a CV. */
export function IlluTalk(props: IlluProps) {
  return (
    <Frame {...props}>
      <circle cx="112" cy="84" r="52" fill={MARK} />
      <path d="M56 109 L52 128 L78 109" fill={PAPER} {...stroke} />
      <rect x="34" y="44" width="104" height="66" rx="14" fill={PAPER} {...stroke} />
      <line x1="59" y1="110" x2="75" y2="110" stroke={PAPER} strokeWidth="4" />
      <path d="M50 64 q8 -6 16 0 t16 0 t16 0 t16 0" fill="none" {...stroke} />
      <path d="M50 79 q8 -6 16 0 t16 0 t16 0" fill="none" {...stroke} />
      <path d="M50 94 q8 -6 16 0 t16 0" fill="none" {...stroke} />
      <rect x="106" y="100" width="58" height="66" rx="7" fill={PAPER} {...stroke} />
      <line x1="116" y1="116" x2="150" y2="116" {...stroke} strokeWidth="3.5" />
      <rect x="116" y="126" width="30" height="9" rx="2" fill={MARK} />
      <line x1="116" y1="145" x2="152" y2="145" {...grey} />
      <line x1="116" y1="155" x2="140" y2="155" {...grey} />
    </Frame>
  );
}

/** Keywords found on the sheet. */
export function IlluMatch(props: IlluProps) {
  return (
    <Frame {...props}>
      <rect x="40" y="30" width="96" height="128" rx="8" fill={PAPER} {...stroke} />
      <line x1="54" y1="50" x2="100" y2="50" {...stroke} strokeWidth="4.5" />
      <line x1="54" y1="68" x2="122" y2="68" {...grey} />
      <rect x="54" y="78" width="46" height="10" rx="2" fill={MARK} />
      <line x1="106" y1="83" x2="122" y2="83" {...grey} />
      <line x1="54" y1="100" x2="112" y2="100" {...grey} />
      <line x1="54" y1="115" x2="66" y2="115" {...grey} />
      <rect x="72" y="110" width="38" height="10" rx="2" fill={MARK} />
      <line x1="54" y1="132" x2="96" y2="132" {...grey} />
      <line x1="150" y1="140" x2="168" y2="158" stroke={INK} strokeWidth="7" strokeLinecap="round" />
      <circle cx="132" cy="122" r="27" fill={SOFT} {...stroke} strokeWidth="3.5" />
      <path d="M120 122 l8 8 l15 -17" fill="none" {...stroke} strokeWidth="4" />
    </Frame>
  );
}

/** Finished files, ready to send. */
export function IlluFiles(props: IlluProps) {
  return (
    <Frame {...props}>
      <rect x="62" y="30" width="86" height="114" rx="8" fill={PAPER} {...stroke} transform="rotate(9 105 87)" />
      <rect x="42" y="38" width="86" height="114" rx="8" fill={PAPER} {...stroke} />
      <rect x="54" y="52" width="36" height="15" rx="3" fill={MARK} />
      <line x1="54" y1="82" x2="114" y2="82" {...stroke} strokeWidth="3.5" />
      <line x1="54" y1="97" x2="110" y2="97" {...grey} />
      <line x1="54" y1="110" x2="116" y2="110" {...grey} />
      <line x1="54" y1="123" x2="98" y2="123" {...grey} />
      <circle cx="134" cy="142" r="25" fill={INK} />
      <path d="M122 142 l9 9 l15 -18" fill="none" stroke={MARK} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
    </Frame>
  );
}

/** A fresh sheet and a pen. */
export function IlluBlank(props: IlluProps) {
  return (
    <Frame {...props}>
      <rect x="40" y="28" width="96" height="134" rx="8" fill={PAPER} {...stroke} />
      <line x1="54" y1="48" x2="98" y2="48" {...stroke} strokeWidth="4.5" />
      <line x1="54" y1="66" x2="116" y2="66" {...grey} />
      <rect x="54" y="78" width="40" height="10" rx="2" fill={MARK} />
      <line x1="54" y1="102" x2="84" y2="102" {...stroke} />
      <g transform="rotate(38 128 108)">
        <rect x="119" y="56" width="18" height="66" rx="4" fill={MARK} {...stroke} />
        <line x1="119" y1="70" x2="137" y2="70" {...stroke} />
        <path d="M119 122 L128 142 L137 122 Z" fill={PAPER} {...stroke} />
      </g>
      <path d="M150 34 v14 M143 41 h14" fill="none" {...stroke} />
    </Frame>
  );
}

/** An old CV going up. */
export function IlluUpload(props: IlluProps) {
  return (
    <Frame {...props}>
      <g transform="rotate(-6 88 92)">
        <rect x="42" y="28" width="92" height="128" rx="8" fill={PAPER} {...stroke} />
        <line x1="56" y1="48" x2="98" y2="48" {...grey} strokeWidth="4.5" />
        <line x1="56" y1="66" x2="120" y2="66" {...grey} />
        <line x1="56" y1="80" x2="112" y2="80" {...grey} />
        <line x1="56" y1="94" x2="118" y2="94" {...grey} />
        <line x1="56" y1="108" x2="100" y2="108" {...grey} />
        <line x1="56" y1="122" x2="110" y2="122" {...grey} />
      </g>
      <circle cx="134" cy="136" r="27" fill={MARK} {...stroke} />
      <path d="M134 150 V124 M122 135 L134 123 L146 135" fill="none" {...stroke} strokeWidth="4" />
    </Frame>
  );
}

/** The CV being written — lines draw themselves in, the highlighter sweeps. */
export function IlluWriting(props: IlluProps) {
  const draw = (delay: number) => ({ className: "illu-draw", pathLength: 1, style: { animationDelay: `${delay}s` } });
  return (
    <Frame {...props}>
      <rect x="44" y="22" width="102" height="146" rx="8" fill={PAPER} {...stroke} />
      <line x1="58" y1="42" x2="108" y2="42" {...stroke} strokeWidth="4.5" {...draw(0)} />
      <line x1="58" y1="58" x2="130" y2="58" {...grey} {...draw(0.25)} />
      <rect x="58" y="70" width="48" height="10" rx="2" fill={MARK} className="illu-grow" style={{ animationDelay: "0.55s" }} />
      <line x1="58" y1="92" x2="126" y2="92" {...grey} {...draw(0.8)} />
      <line x1="58" y1="106" x2="118" y2="106" {...grey} {...draw(1.05)} />
      <rect x="58" y="118" width="38" height="10" rx="2" fill={MARK} className="illu-grow" style={{ animationDelay: "1.3s" }} />
      <line x1="102" y1="123" x2="130" y2="123" {...grey} {...draw(1.5)} />
      <line x1="58" y1="142" x2="110" y2="142" {...grey} {...draw(1.75)} />
      <g className="illu-pen">
        <g transform="rotate(38 140 120)">
          <rect x="132" y="76" width="16" height="56" rx="4" fill={MARK} {...stroke} />
          <path d="M132 132 L140 150 L148 132 Z" fill={PAPER} {...stroke} />
        </g>
      </g>
    </Frame>
  );
}

/** Nothing here yet — a placeholder sheet waiting to be filled. */
export function IlluEmpty(props: IlluProps) {
  return (
    <Frame {...props}>
      <rect x="46" y="30" width="92" height="128" rx="8" fill={PAPER} stroke={INK} strokeWidth="3" strokeDasharray="7 7" strokeLinecap="round" />
      <line x1="60" y1="52" x2="102" y2="52" {...grey} strokeWidth="4.5" />
      <line x1="60" y1="72" x2="122" y2="72" {...grey} />
      <line x1="60" y1="86" x2="112" y2="86" {...grey} />
      <circle cx="132" cy="138" r="27" fill={MARK} {...stroke} />
      <path d="M132 125 v26 M119 138 h26" fill="none" {...stroke} strokeWidth="4" />
    </Frame>
  );
}

/** An ATS reading a CV: scan band and viewfinder corners. */
export function IlluScan(props: IlluProps) {
  return (
    <Frame {...props}>
      <rect x="50" y="28" width="90" height="134" rx="8" fill={PAPER} {...stroke} />
      <line x1="64" y1="48" x2="106" y2="48" {...stroke} strokeWidth="4.5" />
      <line x1="64" y1="64" x2="126" y2="64" {...stroke} />
      <line x1="64" y1="77" x2="118" y2="77" {...stroke} />
      <rect x="32" y="88" width="126" height="16" rx="4" fill={MARK} />
      <line x1="32" y1="96" x2="158" y2="96" {...stroke} strokeWidth="2" />
      <line x1="64" y1="116" x2="124" y2="116" {...grey} />
      <line x1="64" y1="129" x2="112" y2="129" {...grey} />
      <line x1="64" y1="142" x2="120" y2="142" {...grey} />
      <path d="M22 34 v-14 h14 M154 20 h14 v14 M168 156 v14 h-14 M36 170 h-14 v-14" fill="none" {...stroke} strokeWidth="3.5" />
    </Frame>
  );
}

/** A question, and a short answer back. */
export function IlluQuestions(props: IlluProps) {
  return (
    <Frame {...props}>
      <circle cx="128" cy="64" r="44" fill={MARK} />
      <path d="M118 120 L126 140 L98 120" fill={PAPER} {...stroke} />
      <rect x="34" y="34" width="112" height="88" rx="18" fill={PAPER} {...stroke} />
      <line x1="101" y1="122" x2="117" y2="122" stroke={PAPER} strokeWidth="4" />
      <path d="M76 66 q0 -16 15 -16 q15 0 15 13 q0 9 -9 13 q-6 3 -6 9" fill="none" {...stroke} strokeWidth="4.5" />
      <circle cx="91" cy="101" r="3.2" fill={INK} />
      <rect x="92" y="132" width="72" height="34" rx="14" fill={INK} />
      <circle cx="113" cy="149" r="3.5" fill={MARK} />
      <circle cx="128" cy="149" r="3.5" fill={MARK} />
      <circle cx="143" cy="149" r="3.5" fill={MARK} />
    </Frame>
  );
}

/** Page not found: a sheet with its corner folded and a question mark. */
export function IlluLost(props: IlluProps) {
  return (
    <Frame {...props}>
      <path d="M48 30 h62 l32 32 v98 a8 8 0 0 1 -8 8 h-86 a8 8 0 0 1 -8 -8 v-122 a8 8 0 0 1 8 -8 z" fill={PAPER} {...stroke} />
      <path d="M110 30 v24 a8 8 0 0 0 8 8 h24" fill={SOFT} {...stroke} />
      <path d="M78 96 q0 -18 17 -18 q17 0 17 15 q0 10 -10 15 q-7 3 -7 11" fill="none" {...stroke} strokeWidth="5" />
      <circle cx="95" cy="138" r="3.6" fill={INK} />
    </Frame>
  );
}

/* ───────────── Small spots for the form steps (64×64) ───────────── */

function Spot({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" focusable="false">
      {children}
    </svg>
  );
}

const thin = { stroke: INK, strokeWidth: 2.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export function SpotTarget({ className }: { className?: string }) {
  return (
    <Spot className={className}>
      <circle cx="29" cy="35" r="22" fill={MARK} {...thin} />
      <circle cx="29" cy="35" r="12" fill={PAPER} {...thin} />
      <circle cx="29" cy="35" r="3.4" fill={INK} />
      <path d="M31 33 L52 12 M45 11 h8 v8" fill="none" {...thin} />
    </Spot>
  );
}

export function SpotPerson({ className }: { className?: string }) {
  return (
    <Spot className={className}>
      <rect x="6" y="13" width="52" height="38" rx="7" fill={PAPER} {...thin} />
      <circle cx="22" cy="28" r="6" fill={MARK} {...thin} />
      <path d="M13 43 q9 -11 18 0" fill="none" {...thin} />
      <line x1="38" y1="26" x2="50" y2="26" {...thin} />
      <line x1="38" y1="35" x2="47" y2="35" stroke={LINE} strokeWidth="2.6" strokeLinecap="round" />
    </Spot>
  );
}

export function SpotBriefcase({ className }: { className?: string }) {
  return (
    <Spot className={className}>
      <path d="M23 21 v-5 a3 3 0 0 1 3 -3 h12 a3 3 0 0 1 3 3 v5" fill="none" {...thin} />
      <rect x="6" y="21" width="52" height="32" rx="7" fill={PAPER} {...thin} />
      <rect x="7.5" y="31" width="49" height="9" fill={MARK} />
      <path d="M6 31 h52 M6 40 h52" fill="none" {...thin} />
      <rect x="27" y="31" width="10" height="9" rx="2" fill={INK} />
    </Spot>
  );
}

export function SpotCap({ className }: { className?: string }) {
  return (
    <Spot className={className}>
      <path d="M18 31 v11 c0 6 28 6 28 0 v-11" fill={PAPER} {...thin} />
      <path d="M32 12 L59 25 L32 38 L5 25 Z" fill={MARK} {...thin} />
      <path d="M59 25 v14" fill="none" {...thin} />
      <circle cx="59" cy="43" r="3" fill={INK} />
    </Spot>
  );
}

export function SpotSkills({ className }: { className?: string }) {
  return (
    <Spot className={className}>
      <rect x="6" y="10" width="34" height="13" rx="6.5" fill={MARK} {...thin} />
      <rect x="24" y="27" width="34" height="13" rx="6.5" fill={PAPER} {...thin} />
      <rect x="8" y="44" width="28" height="13" rx="6.5" fill={PAPER} {...thin} />
      <path d="M46 46 l4 4 l8 -9" fill="none" {...thin} />
    </Spot>
  );
}
