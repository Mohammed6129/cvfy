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

export const GLASS_LABEL_CLASS =
  "mb-2 block text-sm font-semibold text-white/85";

/** Light input fields on glass form pages */
export const FORM_FIELD_BASE =
  "rounded-[11px] border border-[#E0EDF8] bg-white text-[#333] outline-none transition-colors placeholder:text-[#999] focus:border-[#378ADD] focus:ring-2 focus:ring-[#378ADD]/20";

export const FORM_INPUT_CLASS = `w-full px-4 py-3 ${FORM_FIELD_BASE}`;

export const FORM_SELECT_CLASS = `w-full appearance-none px-4 py-3 ${FORM_FIELD_BASE}`;

export const FORM_DATE_SELECT_CLASS = `min-w-0 flex-1 appearance-none px-3 py-3 text-sm ${FORM_FIELD_BASE}`;

export const FORM_LABEL_CLASS = GLASS_LABEL_CLASS;

export const FORM_TIP_CLASS = "mt-1.5 text-xs leading-relaxed text-white/45";

export const FORM_PHONE_WRAPPER_CLASS =
  "flex overflow-hidden rounded-[11px] border border-[#E0EDF8] bg-white focus-within:border-[#378ADD] focus-within:ring-2 focus-within:ring-[#378ADD]/20";

export const FORM_PHONE_PREFIX_CLASS =
  "flex shrink-0 items-center bg-[#378ADD] px-4 text-sm font-semibold text-white";

export const FORM_PHONE_INPUT_CLASS =
  "w-full border-0 bg-white px-4 py-3 text-left text-[#333] outline-none placeholder:text-[#999]";

export const FORM_NESTED_SECTION_CLASS = "glass-page-card-sm p-4 sm:p-6";

export const FORM_BTN_NEXT_CLASS =
  "inline-flex items-center justify-center rounded-full bg-[#378ADD] px-8 py-3 text-sm font-bold text-white shadow-md shadow-[#378ADD]/25 transition-colors hover:bg-[#2a6bb8]";

export const FORM_BTN_BACK_CLASS = "glass-btn-secondary px-6 py-3 text-sm";

/** @deprecated Use FORM_INPUT_CLASS */
export const GLASS_INPUT_CLASS = FORM_INPUT_CLASS;
