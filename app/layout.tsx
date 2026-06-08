import type { Metadata } from "next";
import { Baloo_Bhaijaan_2 } from "next/font/google";
import "./globals.css";

const balooBhaijaan = Baloo_Bhaijaan_2({
  variable: "--font-baloo-bhaijaan",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CVfy — هويتك المهنية",
  description:
    "أنشئ سيرتك الذاتية الاحترافية في دقائق. قوالب جاهزة، تحسين بالذكاء الاصطناعي، وتصدير فوري.",
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
      className={`${balooBhaijaan.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-slate-900">
        {children}
      </body>
    </html>
  );
}
