"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSettingsStore } from "@/store/settingsStore";

export const OnboardingGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { profile, _hasHydrated } = useSettingsStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !_hasHydrated) return;

    const publicPages = ["/welcome", "/privacy"];
    const isPublic = publicPages.includes(pathname);

    // If user has NOT completed local registration and attempts to access any dashboard/tool page, gate them to /welcome
    if (!profile.hasCompletedOnboarding && !isPublic) {
      router.replace("/welcome");
    }
  }, [mounted, _hasHydrated, pathname, profile.hasCompletedOnboarding, router]);

  // Initial SSR mount & hydration guard: prevent flash
  if (!mounted || !_hasHydrated) {
    return <div className="min-h-screen bg-calm-bg" />;
  }

  const publicPages = ["/welcome", "/privacy"];
  const isPublic = publicPages.includes(pathname);

  // If user is not registered and is on a protected route, render a gentle redirecting state
  if (!profile.hasCompletedOnboarding && !isPublic) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-center px-4">
        <div className="w-8 h-8 rounded-full border-2 border-calm-sage border-t-transparent animate-spin" />
        <p className="text-sm font-medium text-calm-text">
          Directing to patient registration & onboarding...
        </p>
        <p className="text-xs text-calm-text-muted">
          Your recovery data remains 100% on-device and encrypted.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};
