type LoadingSpinnerProps = {
  label?: string;
  size?: "sm" | "md" | "lg";
};

const sizes = {
  sm: "h-5 w-5 border-2",
  md: "h-10 w-10 border-4",
  lg: "h-14 w-14 border-4",
};

export default function LoadingSpinner({
  label,
  size = "md",
}: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <div
        className={`animate-spin rounded-full border-[#e8f2fc] border-t-[#378ADD] ${sizes[size]}`}
        role="status"
        aria-label={label ?? "جاري التحميل"}
      />
      {label && (
        <p className="animate-pulse text-sm font-semibold text-slate-600">
          {label}
        </p>
      )}
    </div>
  );
}
