"use client";

import React from "react";
import Link from "next/link";
import { useSettingsStore } from "@/store/settingsStore";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { RegistrationCard } from "@/components/landing/RegistrationCard";
import { TrustSection } from "@/components/landing/TrustSection";
import { SocialProof } from "@/components/landing/SocialProof";
import { WhyJoinSection } from "@/components/landing/WhyJoinSection";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function WelcomeLandingPage() {
  const { profile } = useSettingsStore();

  return (
    <div className="flex flex-col min-h-screen bg-calm-bg text-calm-text -mx-4 -my-6 sm:-my-8 overflow-x-hidden">
      {/* 1. Minimal Sticky Navbar */}
      <LandingNavbar />

      {/* Existing Registered Session Notice (if already logged in) */}
      {profile.hasCompletedOnboarding && (
        <div className="w-full bg-calm-sage-surface/50 border-b border-calm-sage/30 px-4 py-2.5">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-calm-text font-medium">
              <CheckCircle2 className="w-4 h-4 text-calm-sage" />
              <span>
                You are currently registered as <strong>{profile.name || "Alex Taylor"}</strong>
              </span>
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-calm-sage text-calm-bg-deep font-bold rounded-lg text-[11px] hover:opacity-90 transition-opacity"
            >
              <span>Go to Recovery Dashboard</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}

      {/* Main Landing Sections */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 flex flex-col gap-2 sm:gap-4">
        {/* 2. Hero Section */}
        <HeroSection />

        {/* 3. Registration Card */}
        <RegistrationCard />

        {/* 4. Trust Section (Compact) */}
        <TrustSection />

        {/* 5. Minimal Social Proof */}
        <SocialProof />

        {/* 6. Why Join? Cards */}
        <WhyJoinSection />

        {/* 7. Final Call to Action */}
        <FinalCTA />
      </main>

      {/* 8. Minimal Footer */}
      <LandingFooter />
    </div>
  );
}
