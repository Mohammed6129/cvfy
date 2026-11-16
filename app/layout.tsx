import type { Metadata, Viewport } from "next";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cvfy-rosy.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "CVfy — سيرة ذاتية مطابقة للوظيفة، بالعربي والإنجليزي",
    template: "%s — CVfy",
  },
  description:
    "اكتب خبراتك بأسلوبك العادي، وCVfy يحوّلها لسيرة ذاتية احترافية بالعربي والإنجليزي، مطابقة لإعلان الوظيفة وجاهزة لأنظمة الفرز ATS. المعاينة مجانية.",
  keywords: ["سيرة ذاتية", "CV", "ATS", "السعودية", "وظائف", "سيرة ذاتية بالانجليزي", "كتابة سيرة ذاتية"],
  openGraph: {
    type: "website",
    locale: "ar_SA",
    siteName: "CVfy",
    title: "CVfy — سولف لنا عن شغلك، ونكتبها لك سيرة على مقاس الوظيفة",
    description: "سيرة ذاتية بالعربي والإنجليزي مطابقة لإعلان الوظيفة. المعاينة مجانية.",
  },
  twitter: { card: "summary" },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" data-scroll-behavior="smooth">
      <head>
        <link rel="preload" href="/fonts/readex-pro-arabic.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        <a
          href="#main"
          className="btn btn-primary btn-sm sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[100]"
        >
          انتقل للمحتوى
        </a>
        {children}
      </body>
    </html>
  );
}
