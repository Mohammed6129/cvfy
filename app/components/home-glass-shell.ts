/** Shared homepage glass section shell — keeps card edges aligned across sections. */
export const HOME_GLASS_SECTION_CLASS = "px-6 py-12 md:px-12";
export const HOME_GLASS_CONTAINER_CLASS = "mx-auto w-full max-w-[1100px] box-border";

export const GLASS_CARD_STYLE = {
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  background: "rgba(255,255,255,0.1)",
  border: "1px solid rgba(255,255,255,0.2)",
  borderRadius: "24px",
} as const;

export const GLASS_INPUT_CLASS =
  "w-full rounded-xl border border-white/25 bg-white/90 px-4 py-3 text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-[#378ADD] focus:ring-2 focus:ring-[#378ADD]/20";

export const GLASS_LABEL_CLASS =
  "mb-2 block text-sm font-semibold text-white/85";
