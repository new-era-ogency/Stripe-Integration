import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "PulseFlow | AI YouTube Content Generator (Threads, Articles, Scripts)",
  description:
    "Transform any YouTube video into viral Twitter threads, deep LinkedIn articles, and high-converting Shorts scripts in 30 seconds.",
  openGraph: {
    title: "PulseFlow | AI YouTube Content Generator (Threads, Articles, Scripts)",
    description:
      "Transform any YouTube video into viral Twitter threads, deep LinkedIn articles, and high-converting Shorts scripts in 30 seconds.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PulseFlow | AI YouTube Content Generator (Threads, Articles, Scripts)",
    description:
      "Transform any YouTube video into viral Twitter threads, deep LinkedIn articles, and high-converting Shorts scripts in 30 seconds.",
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
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
