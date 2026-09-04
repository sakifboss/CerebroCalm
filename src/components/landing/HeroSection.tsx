"use client";

import React from "react";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

export const HeroSection: React.FC = () => {
  const scrollToRegister = () => {
    const element = document.getElementById("register-card");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <section className="relative pt-12 pb-8 sm:pt-20 sm:pb-12 flex flex-col items-center text-center overflow-hidden">
      {/* Subtle Background Glow & Abstract Grid */}
      <div className="absolute inset-0 -z-10 pointer-events-none flex items-center justify-center">
        {/* Soft Radial Gradient Aura */}
        <div className="w-[520px] h-[340px] rounded-full bg-gradient-to-tr from-calm-sage/10 via-calm-amber/5 to-transparent blur-3xl opacity-75" />
        {/* Very Subtle Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* 1. Live Badge: ● REGISTRATION OPEN */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-calm-sage-surface border border-calm-sage/35 text-xs text-calm-sage font-semibold tracking-wide shadow-sm mb-6 animate-fade-in">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-calm-sage opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-calm-sage" />
        </span>
        <span className="tracking-wider uppercase text-[11px]">Registration Open</span>
      </div>

      {/* 2. Main Headline */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-calm-text tracking-tight max-w-2xl leading-[1.12]">
        Be Part of Something <span className="text-calm-sage">Great</span>.
      </h1>

      {/* 3. Supporting Text */}
      <p className="mt-5 text-base sm:text-lg text-calm-text-muted leading-relaxed max-w-xl font-normal">
        Join our community and get access to an experience built for people who want to learn, connect, and create.
      </p>

      {/* 4. Two Information Badges */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-6 text-xs text-calm-text-dim">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-calm-bg-card border border-calm-border shadow-xs">
          <CheckCircle2 className="w-3.5 h-3.5 text-calm-sage" />
          <span>Free Registration</span>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-calm-bg-card border border-calm-border shadow-xs">
          <CheckCircle2 className="w-3.5 h-3.5 text-calm-sage" />
          <span>Takes less than a minute</span>
        </div>
      </div>

      {/* 5. Primary CTA & Secondary text */}
      <div className="mt-8 flex flex-col items-center gap-2.5">
        <button
          onClick={scrollToRegister}
          className="group px-7 py-3.5 bg-calm-sage text-calm-bg-deep font-bold rounded-2xl text-sm sm:text-base flex items-center gap-2 hover:opacity-95 active:scale-[0.98] transition-all shadow-md cursor-pointer min-h-touch"
        >
          <span>Register Now</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
        <span className="text-xs text-calm-text-dim font-medium">
          No credit card required.
        </span>
      </div>
    </section>
  );
};
