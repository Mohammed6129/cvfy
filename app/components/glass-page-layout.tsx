import type { ReactNode } from "react";
import Footer from "./Footer";
import GlassBackgroundBlobs from "./glass-background-blobs";
import Navbar from "./Navbar";

type GlassPageLayoutProps = {
  children: ReactNode;
  mainClassName?: string;
};

export default function GlassPageLayout({
  children,
  mainClassName = "",
}: GlassPageLayoutProps) {
  return (
    <div className="home-glass-page relative flex min-h-full flex-1 flex-col">
      <GlassBackgroundBlobs />
      <Navbar variant="glass" />
      <main className={`relative z-10 flex-1 ${mainClassName}`.trim()}>
        {children}
      </main>
      <Footer variant="glass" />
    </div>
  );
}
