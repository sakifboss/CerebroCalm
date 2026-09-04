import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { DemoBanner } from "@/components/DemoBanner";
import { RedFlagAlert } from "@/components/RedFlagAlert";
import { DarkSanctuary } from "@/components/DarkSanctuary";
import { ClinicalDisclaimer } from "@/components/ClinicalDisclaimer";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "CerebroCalm — Concussion & Mild TBI Recovery Companion",
  description:
    "A privacy-first, low-cognitive-load recovery companion for concussion and mild TBI recovery. Designed for photophobia, screen intolerance, and cognitive pacing.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="theme-photophobia">
      <head>
        {/* Anti-flicker inline theme initialization script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const settings = JSON.parse(localStorage.getItem('cerebrocalm_settings') || '{}');
                if (settings.theme) {
                  document.documentElement.className = 'theme-' + settings.theme;
                }
                if (settings.reducedMotion) {
                  document.documentElement.classList.add('reduce-motion');
                }
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-calm-bg text-calm-text pb-20 md:pb-8">
        <ErrorBoundary>
          {/* Hackathon Demo Bar */}
          <DemoBanner />

          {/* Main Top Header */}
          <Navigation />

          {/* Emergency Safety Alert (Deterministic Override) */}
          <RedFlagAlert />

          {/* Dark Sanctuary Overlay (Rest Interval) */}
          <DarkSanctuary />

          {/* Page Contents */}
          <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 sm:py-8">
            {children}
          </main>

          {/* Educational Disclaimer Footer */}
          <footer className="max-w-4xl mx-auto w-full px-4 pt-4 pb-8">
            <ClinicalDisclaimer compact />
          </footer>
        </ErrorBoundary>
      </body>
    </html>
  );
}
