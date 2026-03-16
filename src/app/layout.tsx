import type { Metadata } from "next";
import Script from "next/script";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { LoadingScreen } from "@/components/portfolio/LoadingScreen";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ya-m-i | Fullstack Dev & UI/UX Designer",
  description: "Portfolio of Ya-m-i — Fullstack Developer & UI/UX Designer. Your complexity, simplified into a single click.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="antialiased">
        <Script
          src="https://unpkg.com/@splinetool/viewer@1.12.69/build/spline-viewer.js"
          strategy="afterInteractive"
          type="module"
        />
        <Suspense fallback={<LoadingScreen />}>{children}</Suspense>
      </body>
    </html>
  );
}
