"use client";

import React from "react";
import Link from "next/link";

export const LandingFooter: React.FC = () => {
  return (
    <footer className="w-full border-t border-calm-border/60 py-8 mt-12 text-xs text-calm-text-dim">
      <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left: Brand & Copyright */}
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-calm-sage-surface border border-calm-sage/30 flex items-center justify-center text-calm-sage font-bold text-[10px]">
            C
          </div>
          <span className="font-semibold text-calm-text">CerebroCalm</span>
          <span>© 2026. All rights reserved.</span>
        </div>

        {/* Right: Minimal Legal Links */}
        <div className="flex items-center gap-6">
          <Link href="/privacy" className="hover:text-calm-text transition-colors">
            Privacy Policy
          </Link>
          <a
            href="#trust-section"
            className="hover:text-calm-text transition-colors"
          >
            Terms of Service
          </a>
          <a
            href="mailto:support@cerebrocalm.local"
            className="hover:text-calm-text transition-colors"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};
