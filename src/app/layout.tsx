import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter, Geist } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import "./globals.css";
import { TransitionLoader } from "@/components/transition-loader";
import { LocaleProvider } from "@/lib/i18n/locale-context";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Linqis - AI Meeting Intelligence",
    template: "%s | Linqis",
  },
  description: "Every meeting, decoded. Linqis transcribes your meetings, extracts decisions and action items, and flags disagreements automatically with AI.",
  keywords: ["AI meeting summarizer", "meeting notes AI", "meeting transcription", "action items AI", "meeting intelligence"],
  openGraph: {
    title: "Linqis - AI Meeting Intelligence",
    description: "Every meeting, decoded. Automatic transcription, summaries, decisions and action items.",
    url: "/",
    siteName: "Linqis",
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "Linqis - AI Meeting Intelligence" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Linqis - AI Meeting Intelligence",
    description: "Every meeting, decoded.",
    images: ["/opengraph-image.png"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${geist.variable} antialiased`}>
        <SessionProvider>
          <LocaleProvider>
            <Suspense fallback={null}>
              <TransitionLoader />
            </Suspense>
            {children}
          </LocaleProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
