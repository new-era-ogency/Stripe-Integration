import type { Metadata, Viewport } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Geist, Geist_Mono } from "next/font/google";
import AuthSessionSync from "@/components/auth/AuthSessionSync";
import ConditionalFooter from "@/components/layout/ConditionalFooter";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import IubendaConsentScripts from "@/components/consent/IubendaConsentScripts";
import { ToastProvider } from "@/components/feedback/ToastProvider";
import { OpenAiKeyProvider } from "@/components/openai/OpenAiKeyProvider";
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
  title: "PulseFlow | Free BYOK AI Dashboard for Content Creators",
  description:
    "100% free, privacy-first BYOK dashboard. Paste a YouTube link, connect your OpenAI key, and get X, LinkedIn, and Telegram posts — billed directly by OpenAI.",
  openGraph: {
    title: "PulseFlow | Free BYOK AI Dashboard for Content Creators",
    description:
      "Bring your own OpenAI key. No monthly subscriptions. Generate multi-platform content from YouTube in your browser.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PulseFlow | Free BYOK AI Dashboard for Content Creators",
    description:
      "100% free BYOK dashboard for creators. Your key stays in your browser. Pay OpenAI directly.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
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
      suppressHydrationWarning
    >
      <body
        className={`${geistSans.className} dark min-h-full flex flex-col bg-[#000000] text-gray-50 antialiased`}
      >
        <IubendaConsentScripts />
        <ThemeProvider>
          <AuthSessionSync />
          <ToastProvider>
            <OpenAiKeyProvider>
              <main className="flex-1">
                {children}
                <GoogleAnalytics gaId="G-MD54867XV4" />
              </main>
            </OpenAiKeyProvider>
          </ToastProvider>
        </ThemeProvider>
        <ConditionalFooter />
      </body>
    </html>
  );
}
