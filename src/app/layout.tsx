import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import { TransitionLoader } from "@/components/transition-loader";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export const metadata: Metadata = {
  title: "Lynqis - AI Meeting Intelligence",
  description: "Every meeting, decoded.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${geist.variable} antialiased`}>
        <Suspense fallback={null}>
          <TransitionLoader />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
