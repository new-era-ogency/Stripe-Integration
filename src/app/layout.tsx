import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import AuthSessionSync from "@/components/auth/AuthSessionSync";
import AppFooter from "@/components/layout/AppFooter";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PulseFlow | One YouTube video → X, LinkedIn & Telegram posts",
  description:
    "Paste a YouTube link. Get publish-ready X threads, LinkedIn posts, and Telegram drops in under a minute. Join the free beta.",
  openGraph: {
    title: "PulseFlow | One YouTube video → X, LinkedIn & Telegram posts",
    description:
      "Paste a YouTube link. Get publish-ready X threads, LinkedIn posts, and Telegram drops in under a minute.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PulseFlow | One YouTube video → X, LinkedIn & Telegram posts",
    description:
      "Paste a YouTube link. Get publish-ready X threads, LinkedIn posts, and Telegram drops in under a minute.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${geistMono.variable} h-full font-sans antialiased`}
    >
      <body
        className={`${geistSans.className} dark min-h-full flex flex-col bg-[#000000] text-gray-50 antialiased`}
      >
        <AuthSessionSync />
        <main className="flex-1">{children}</main>
        <AppFooter />
      </body>
    </html>
  );
}
