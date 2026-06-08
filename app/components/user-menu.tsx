"use client";

import Image from "next/image";
import { useTransition } from "react";
import { signOut } from "@/app/auth/actions";

type UserMenuProps = {
  name: string;
  avatarUrl: string | null;
};

function normalizeGoogleAvatarUrl(url: string): string {
  if (url.includes("googleusercontent.com") && !url.includes("=s")) {
    return `${url}=s96-c`;
  }
  return url;
}

function UserAvatar({ name, avatarUrl }: UserMenuProps) {
  if (avatarUrl) {
    const src = normalizeGoogleAvatarUrl(avatarUrl);

    return (
      <Image
        src={src}
        alt={name}
        width={36}
        height={36}
        className="h-9 w-9 rounded-full border-2 border-[#378ADD]/20 object-cover"
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#378ADD]/20 bg-[#e8f2fc] text-sm font-bold text-[#378ADD]">
      {name.charAt(0).toUpperCase()}
    </span>
  );
}

export default function UserMenu({ name, avatarUrl }: UserMenuProps) {
  const [isPending, startTransition] = useTransition();

  const handleSignOut = () => {
    sessionStorage.removeItem("cvfy-generated-cv");
    sessionStorage.removeItem("cvfy-payment-paid");
    sessionStorage.removeItem("cvfy-payment-plan");
    sessionStorage.removeItem("cvfy-payment-pending-plan");

    startTransition(async () => {
      await signOut();
    });
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2.5">
        <UserAvatar name={name} avatarUrl={avatarUrl} />
        <span className="hidden max-w-[140px] truncate text-sm font-semibold text-slate-700 sm:inline">
          {name}
        </span>
      </div>
      <button
        type="button"
        onClick={handleSignOut}
        disabled={isPending}
        className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "جاري الخروج..." : "تسجيل الخروج"}
      </button>
    </div>
  );
}
