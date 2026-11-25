"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, type ReactNode } from "react";
import { writeDraft } from "@/app/create/draft";
import { fetchAsGuest } from "@/lib/guest";
import type { CvForm } from "@/lib/cv/types";
import { FileIcon } from "./icons";

type UploadCvProps = {
  mock: boolean;
  className?: string;
  children?: ReactNode;
  /** Inside the builder: hand the parsed form over instead of navigating. */
  onParsed?: (form: CvForm) => void;
};

/**
 * One tap → file picker → we read the old CV → one review screen → write.
 * No sign-in: a guest session is started on the way if needed.
 */
export default function UploadCv({ mock, className = "btn btn-ghost btn-lg", children, onParsed }: UploadCvProps) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (file: File) => {
    setBusy(true);
    setError(null);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetchAsGuest(mock, "/api/cv/parse", { method: "POST", body });
      if (res.status === 401) {
        router.push(`/login?next=${encodeURIComponent("/create")}`);
        return;
      }
      const data = (await res.json().catch(() => ({}))) as { form?: CvForm; error?: string };
      if (!res.ok || !data.form) {
        setError(data.error || "ما قدرنا نقرأ الملف. جرّب ملف ثاني أو عبّي بياناتك.");
        return;
      }
      if (onParsed) {
        onParsed(data.form);
      } else {
        writeDraft({ form: data.form, step: 0, cvId: null, pending: false, review: true });
        router.push("/create?review=1");
      }
    } catch {
      setError("انقطع الاتصال أثناء رفع الملف. جرّب مرة ثانية.");
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  };

  return (
    <div>
      <button type="button" disabled={busy} onClick={() => input.current?.click()} className={className}>
        {busy ? <span className="spinner" /> : <FileIcon size={18} />}
        {busy ? "نقرأ سيرتك…" : children ?? "ارفع سيرتك القديمة"}
      </button>
      <input
        ref={input}
        type="file"
        accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void upload(file);
        }}
      />
      {error && <p className="field-error" role="alert">{error}</p>}
    </div>
  );
}
