"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { TrashIcon } from "@/app/components/icons";

export default function DeleteButton({ id, title }: { id: string; title: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);

  const remove = async () => {
    setBusy(true);
    await fetch(`/api/cv/${id}`, { method: "DELETE" }).catch(() => null);
    router.refresh();
    setBusy(false);
    setConfirming(false);
  };

  if (!confirming) {
    return (
      <button type="button" className="btn btn-quiet btn-sm" aria-label={`حذف ${title}`} onClick={() => setConfirming(true)}>
        <TrashIcon size={16} />
        حذف
      </button>
    );
  }

  return (
    <span className="flex items-center gap-2 text-sm">
      <span className="text-graphite">تحذفها نهائياً؟</span>
      <button type="button" disabled={busy} className="btn btn-sm bg-bad text-white" onClick={remove}>
        {busy ? <span className="spinner" /> : "احذف"}
      </button>
      <button type="button" disabled={busy} className="btn btn-quiet btn-sm" onClick={() => setConfirming(false)}>
        تراجع
      </button>
    </span>
  );
}
