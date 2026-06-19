"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { signOut } from "@/app/auth/actions";
import { CURRENT_CV_ID_KEY, STORAGE_KEY } from "@/lib/cv-storage";

type UserMenuProps = {
  name: string;
  avatarUrl: string | null;
  variant?: "default" | "glass";
};

function normalizeGoogleAvatarUrl(url: string): string {
  if (url.includes("googleusercontent.com") && !url.includes("=s")) {
    return `${url}=s96-c`;
  }
  return url;
}

function UserAvatar({
  name,
  avatarUrl,
  glass = false,
}: UserMenuProps & { glass?: boolean }) {
  if (avatarUrl) {
    const src = normalizeGoogleAvatarUrl(avatarUrl);
    return (
      <Image
        src={src}
        alt={name}
        width={36}
        height={36}
        className={`h-9 w-9 rounded-full object-cover ${glass ? "border-2 border-white/35" : "border-2 border-[#378ADD]/20"}`}
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <span
      className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${
        glass
          ? "border-2 border-white/35 bg-white/15 text-white"
          : "border-2 border-[#378ADD]/20 bg-[#e8f2fc] text-[#378ADD]"
      }`}
    >
      {name.charAt(0).toUpperCase()}
    </span>
  );
}

export default function UserMenu({ name, avatarUrl, variant = "default" }: UserMenuProps) {
  const isGlass = variant === "glass";
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(CURRENT_CV_ID_KEY);
    sessionStorage.removeItem("cvfy-payment-paid");
    sessionStorage.removeItem("cvfy-payment-plan");
    sessionStorage.removeItem("cvfy-payment-pending-plan");
    setOpen(false);
    startTransition(async () => {
      await signOut();
    });
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={
          isGlass
            ? "glass-surface-cta flex items-center gap-2 rounded-full px-2 py-1.5 transition-opacity hover:opacity-90 sm:px-3"
            : "flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1.5 transition-colors hover:border-[#378ADD]/40 sm:px-3"
        }
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <UserAvatar name={name} avatarUrl={avatarUrl} glass={isGlass} />
        <span
          className={`hidden max-w-[100px] truncate text-sm font-semibold md:inline ${
            isGlass ? "text-white" : "text-slate-700"
          }`}
        >
          {name}
        </span>
        <svg
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""} ${isGlass ? "text-white/80" : "text-slate-500"}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-xl border border-slate-100 bg-white py-1 shadow-xl shadow-slate-200/60"
        >
          <Link
            href="/my-cvs"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="block px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-[#e8f2fc] hover:text-[#378ADD]"
          >
            سيرتي الذاتية
          </Link>
          <Link
            href="/account"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="block px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-[#e8f2fc] hover:text-[#378ADD]"
          >
            معلومات الحساب
          </Link>
          <hr className="my-1 border-slate-100" />
          <button
            type="button"
            role="menuitem"
            onClick={handleSignOut}
            disabled={isPending}
            className="block w-full px-4 py-3 text-right text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60"
          >
            {isPending ? "جاري الخروج..." : "تسجيل الخروج"}
          </button>
        </div>
      )}
    </div>
  );
}
