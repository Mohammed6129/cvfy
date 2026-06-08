import type { Metadata } from "next";
import { Baloo_Bhaijaan_2 } from "next/font/google";
import "./globals.css";

const balooBhaijaan = Baloo_Bhaijaan_2({
  variable: "--font-baloo-bhaijaan",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://cvfy-rosy.vercel.app"
  ),
  title: {
    default: "CVfy — هويتك المهنية",
    template: "%s | CVfy",
  },
  description:
    "أنشئ سيرتك الذاتية الاحترافية في دقائق. قوالب ATS، تحسين بالذكاء الاصطناعي، وتصدير فوري للسوق السعودي.",
  keywords: [
    "سيرة ذاتية",
    "CV",
    "السعودية",
    "ATS",
    "ذكاء اصطناعي",
    "وظائف",
  ],
  openGraph: {
    locale: "ar_SA",
    type: "website",
    siteName: "CVfy",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      data-scroll-behavior="smooth"
      className={`${balooBhaijaan.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white font-sans text-slate-900">
        {children}
      </body>
    </html>
  );
}
