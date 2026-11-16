import type { ReactNode } from "react";
import SiteFooter from "./site-footer";
import SiteHeader from "./site-header";

type PageShellProps = {
  children: ReactNode;
  variant?: "full" | "focus";
  /** Tinted "desk" background — used where a CV sheet sits on the page. */
  desk?: boolean;
  footer?: boolean;
};

export default function PageShell({ children, variant = "full", desk = false, footer = true }: PageShellProps) {
  return (
    <div className={`flex min-h-dvh flex-col ${desk ? "bg-desk" : "bg-paper"}`}>
      <SiteHeader variant={variant} />
      <main id="main" className="flex-1">
        {children}
      </main>
      {footer && <SiteFooter />}
    </div>
  );
}
