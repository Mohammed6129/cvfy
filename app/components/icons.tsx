type IconProps = { size?: number; className?: string };

const base = (size: number, className?: string) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className,
  "aria-hidden": true,
});

export const CheckIcon = ({ size = 18, className }: IconProps) => (
  <svg {...base(size, className)}><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
);
export const XIcon = ({ size = 18, className }: IconProps) => (
  <svg {...base(size, className)}><path d="M6 6l12 12M18 6L6 18" /></svg>
);
export const LockIcon = ({ size = 18, className }: IconProps) => (
  <svg {...base(size, className)}><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 018 0v3" /></svg>
);
export const DownloadIcon = ({ size = 18, className }: IconProps) => (
  <svg {...base(size, className)}><path d="M12 4v11M7.5 11l4.5 4.5 4.5-4.5M5 19.5h14" /></svg>
);
export const UploadIcon = ({ size = 18, className }: IconProps) => (
  <svg {...base(size, className)}><path d="M12 16V5M7.5 9L12 4.5 16.5 9M5 19.5h14" /></svg>
);
export const PenIcon = ({ size = 18, className }: IconProps) => (
  <svg {...base(size, className)}><path d="M4 20l1-4.5L16.5 4a1.8 1.8 0 012.5 0l1 1a1.8 1.8 0 010 2.5L8.5 19 4 20z" /><path d="M14.5 6l3.5 3.5" /></svg>
);
export const PlusIcon = ({ size = 18, className }: IconProps) => (
  <svg {...base(size, className)}><path d="M12 5v14M5 12h14" /></svg>
);
export const TrashIcon = ({ size = 18, className }: IconProps) => (
  <svg {...base(size, className)}><path d="M5 7h14M10 7V5h4v2M7 7l.8 12h8.4L17 7" /></svg>
);
export const CopyIcon = ({ size = 18, className }: IconProps) => (
  <svg {...base(size, className)}><rect x="8" y="8" width="11" height="12" rx="2" /><path d="M5 16V6a2 2 0 012-2h8" /></svg>
);
export const ChevronIcon = ({ size = 18, className }: IconProps) => (
  <svg {...base(size, className)}><path d="M6 9l6 6 6-6" /></svg>
);
/** Points toward "next" in a right-to-left flow. */
export const NextIcon = ({ size = 18, className }: IconProps) => (
  <svg {...base(size, className)}><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
);
export const BackIcon = ({ size = 18, className }: IconProps) => (
  <svg {...base(size, className)}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
export const FileIcon = ({ size = 18, className }: IconProps) => (
  <svg {...base(size, className)}><path d="M7 3.5h7l4 4V20a.5.5 0 01-.5.5h-10A.5.5 0 017 20V3.5z" /><path d="M14 3.5v4h4M9.5 12.5h5M9.5 16h5" /></svg>
);
export const ShieldIcon = ({ size = 18, className }: IconProps) => (
  <svg {...base(size, className)}><path d="M12 3.5l7 2.5v5.5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-2.5z" /><path d="M9 12l2.2 2.2L15 10.5" /></svg>
);
export const TargetIcon = ({ size = 18, className }: IconProps) => (
  <svg {...base(size, className)}><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3.5" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" /></svg>
);
export const ChatIcon = ({ size = 18, className }: IconProps) => (
  <svg {...base(size, className)}><path d="M5 5.5h14a1 1 0 011 1v9a1 1 0 01-1 1h-7l-4.5 3.5V16.5H5a1 1 0 01-1-1v-9a1 1 0 011-1z" /></svg>
);
