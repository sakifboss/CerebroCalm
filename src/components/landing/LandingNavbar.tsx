"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Menu, X, Sparkles } from "lucide-react";

export const LandingNavbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToRegister = () => {
    setMobileMenuOpen(false);
    const element = document.getElementById("register-card");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-calm-bg/85 backdrop-blur-md border-b border-calm-border/70 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-calm-sage-surface border border-calm-sage/30 flex items-center justify-center text-calm-sage font-bold text-sm shadow-sm group-hover:border-calm-sage transition-colors">
            C
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base text-calm-text tracking-tight flex items-center gap-1.5">
              <span>CerebroCalm</span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] bg-calm-sage-surface text-calm-sage font-medium border border-calm-sage/20">
                2026
              </span>
            </span>
            <span className="text-[10px] text-calm-text-muted leading-none">
              Recovery Companion Platform
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs text-calm-text-muted font-medium">
          <button
            onClick={() => scrollToSection("why-join")}
            className="hover:text-calm-text transition-colors py-1 cursor-pointer"
          >
            Why Join
          </button>
          <button
            onClick={() => scrollToSection("trust-section")}
            className="hover:text-calm-text transition-colors py-1 cursor-pointer"
          >
            Trust & Privacy
          </button>
          <Link
            href="/privacy"
            className="hover:text-calm-text transition-colors py-1"
          >
            Privacy
          </Link>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={scrollToRegister}
            className="flex items-center gap-1.5 px-4 py-2 bg-calm-sage text-calm-bg-deep font-bold rounded-xl text-xs hover:opacity-95 active:scale-[0.98] transition-all shadow-sm"
          >
            <span>Register Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-calm-text-muted hover:text-calm-text hover:bg-calm-bg-surface transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-calm-border bg-calm-bg-card/95 backdrop-blur-md px-4 py-4 flex flex-col gap-3">
          <button
            onClick={() => scrollToSection("why-join")}
            className="text-left text-xs font-medium text-calm-text py-2 border-b border-calm-border/40"
          >
            Why Join
          </button>
          <button
            onClick={() => scrollToSection("trust-section")}
            className="text-left text-xs font-medium text-calm-text py-2 border-b border-calm-border/40"
          >
            Trust & Privacy
          </button>
          <Link
            href="/privacy"
            className="text-left text-xs font-medium text-calm-text py-2 border-b border-calm-border/40"
            onClick={() => setMobileMenuOpen(false)}
          >
            Privacy Policy
          </Link>
          <button
            onClick={scrollToRegister}
            className="w-full mt-2 py-3 bg-calm-sage text-calm-bg-deep font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md"
          >
            <span>Register Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </header>
  );
};
