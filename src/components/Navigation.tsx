"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSettingsStore } from "@/store/settingsStore";
import {
  Home,
  Activity,
  Clock,
  Moon,
  LineChart,
  Settings,
  FileText,
  Zap,
  Building2,
  Sparkles,
} from "lucide-react";

export const Navigation: React.FC = () => {
  const pathname = usePathname();
  const { profile, _hasHydrated } = useSettingsStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isOnboarded = mounted && _hasHydrated && profile.hasCompletedOnboarding;

  if (pathname === "/welcome") {
    return null;
  }

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/symptoms", label: "Check-In", icon: Activity },
    { href: "/pacing", label: "Pacing", icon: Clock },
    { href: "/sanctuary", label: "Sanctuary", icon: Moon },
    { href: "/reaction", label: "Reaction", icon: Zap },
    { href: "/insights", label: "Trends", icon: LineChart },
    { href: "/report", label: "Report", icon: FileText },
    { href: "/accommodations", label: "Letter", icon: Building2 },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <>
      {/* Top Header for Desktop and Tablet */}
      <header className="sticky top-0 z-40 w-full bg-calm-bg/90 backdrop-blur-md border-b border-calm-border">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href={isOnboarded ? "/" : "/welcome"} className="flex items-center gap-2.5 min-h-touch">
            <div className="w-8 h-8 rounded-lg bg-calm-sage-surface border border-calm-sage/30 flex items-center justify-center text-calm-sage font-bold text-base">
              C
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base text-calm-text tracking-tight">CerebroCalm</span>
              <span className="text-[10px] text-calm-text-muted leading-none">Recovery Companion</span>
            </div>
          </Link>

          {isOnboarded ? (
            /* Desktop Nav for registered patients */
            <div className="hidden md:flex items-center gap-3">
              <nav className="flex items-center gap-1" aria-label="Main Navigation">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-colors min-h-touch ${
                        isActive
                          ? "bg-calm-bg-elevated border border-calm-sage/30 text-calm-text shadow-sm"
                          : "text-calm-text-dim hover:text-calm-text hover:bg-calm-bg-surface"
                      }`}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isActive ? "text-calm-sage" : "text-calm-text-muted"}`} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Patient Profile Badge */}
              <div className="pl-3 border-l border-calm-border flex items-center gap-1.5 text-xs text-calm-text-muted font-mono">
                <span className="w-2 h-2 rounded-full bg-calm-sage" />
                <span className="max-w-[100px] truncate">{profile.name || "Patient"}</span>
              </div>
            </div>
          ) : (
            /* Unregistered Header View */
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-calm-sage-surface border border-calm-sage/30 text-xs text-calm-sage font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Patient Registration Required</span>
              </div>
              <Link
                href="/privacy"
                className="text-xs text-calm-text-dim hover:text-calm-text px-2 py-1 rounded-lg"
              >
                Privacy
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Bottom Nav Bar for Mobile - Only visible when registered */}
      {isOnboarded && (
        <nav
          className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-calm-bg/95 backdrop-blur-md border-t border-calm-border px-2 py-1.5 flex items-center justify-around"
          aria-label="Mobile Navigation"
        >
          {navItems.slice(0, 5).map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center p-2 rounded-xl text-[11px] font-medium transition-colors min-h-touch min-w-[56px] ${
                  isActive
                    ? "text-calm-sage bg-calm-bg-surface"
                    : "text-calm-text-muted hover:text-calm-text"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon className="w-5 h-5 mb-0.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      )}
    </>
  );
};
