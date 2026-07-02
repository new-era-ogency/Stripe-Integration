import type { Metadata, Viewport } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import AuthSessionSync from "@/components/auth/AuthSessionSync";
import AppFooter from "@/components/layout/AppFooter";
import { ToastProvider } from "@/components/feedback/ToastProvider";
import { OpenAiKeyProvider } from "@/components/openai/OpenAiKeyProvider";
import { IUBENDA_CS_CONFIG_SCRIPT } from "@/lib/consent/iubenda-config";
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
    >
      <body
        className={`${geistSans.className} dark min-h-full flex flex-col bg-[#000000] text-gray-50 antialiased`}
      >
        <Script
          id="iubenda-cs-config"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: IUBENDA_CS_CONFIG_SCRIPT }}
        />
        <Script
          id="iubenda-autoblocking"
          src="https://cs.iubenda.com/autoblocking/4592982.js"
          strategy="beforeInteractive"
        />
        <Script
          id="iubenda-gpp-stub"
          src="https://cdn.iubenda.com/cs/gpp/stub.js"
          strategy="beforeInteractive"
        />
        <Script
          id="iubenda-cs"
          src="https://cdn.iubenda.com/cs/iubenda_cs.js"
          strategy="beforeInteractive"
          async
          charSet="UTF-8"
        />
        <AuthSessionSync />
        <ToastProvider>
          <OpenAiKeyProvider>
            <main className="flex-1">
              {children}
              <GoogleAnalytics gaId="G-MD54867XV4" />
            </main>
          </OpenAiKeyProvider>
        </ToastProvider>
        <AppFooter />
      </body>
    </html>
  );
}
