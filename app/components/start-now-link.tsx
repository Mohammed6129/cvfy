import Link from "next/link";
import { DEFAULT_POST_AUTH_PATH } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

type StartNowLinkProps = {
  className?: string;
  children?: React.ReactNode;
};

export default async function StartNowLink({
  className,
  children = "ابدأ الآن",
}: StartNowLinkProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const href = user ? DEFAULT_POST_AUTH_PATH : "/login";

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
