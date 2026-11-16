"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { signOut } from "@/app/auth/actions";
import { ChevronIcon } from "./icons";

type UserMenuProps = { name: string; avatarUrl: string | null };

export default function UserMenu({ name, avatarUrl }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  const item = "block w-full px-4 py-2.5 text-start text-[0.9375rem] text-ink hover:bg-desk";

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex min-h-11 items-center gap-2 rounded-full border border-rule bg-paper py-1 pe-3 ps-1 hover:border-ink"
      >
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt=""
            width={32}
            height={32}
            className="h-8 w-8 rounded-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-marker text-sm font-semibold">
            {name.charAt(0)}
          </span>
        )}
        <span className="hidden max-w-28 truncate text-sm sm:inline">{name}</span>
        <ChevronIcon size={14} className={`text-mute transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute end-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-[var(--radius-control)] border border-rule bg-paper py-1 shadow-[var(--shadow-pop)]"
        >
          <Link href="/my-cvs" role="menuitem" className={item} onClick={() => setOpen(false)}>
            سيري الذاتية
          </Link>
          <Link href="/create?new=1" role="menuitem" className={item} onClick={() => setOpen(false)}>
            سيرة جديدة
          </Link>
          <Link href="/account" role="menuitem" className={item} onClick={() => setOpen(false)}>
            حسابي
          </Link>
          <hr className="my-1 border-rule" />
          <button
            type="button"
            role="menuitem"
            disabled={pending}
            className={`${item} text-bad`}
            onClick={() => startTransition(async () => void (await signOut()))}
          >
            {pending ? "جاري الخروج…" : "تسجيل الخروج"}
          </button>
        </div>
      )}
    </div>
  );
}
