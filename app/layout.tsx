import type { Metadata } from "next";
import { Baloo_Bhaijaan_2, Noto_Serif } from "next/font/google";
import "./globals.css";

const balooBhaijaan = Baloo_Bhaijaan_2({
  variable: "--font-baloo-bhaijaan",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  preload: true,
});

const notoSerif = Noto_Serif({
  variable: "--font-noto-serif",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  preload: false,
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
    "أنشئ سيرتك الذاتية الاحترافية في دقائق. قوالب ATS رسمية، تحسين بالذكاء الاصطناعي، وتصدير فوري لسوق العمل السعودي.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
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
      className={`${balooBhaijaan.variable} ${notoSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans text-white antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[9999] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-[#0C447C] focus:shadow-lg"
        >
          انتقل للمحتوى الرئيسي
        </a>
        <div id="main-content" className="flex flex-1 flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
