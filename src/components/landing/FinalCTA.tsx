"use client";

import React from "react";
import { ArrowRight } from "lucide-react";

export const FinalCTA: React.FC = () => {
  const scrollToRegister = () => {
    const element = document.getElementById("register-card");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <section className="w-full max-w-2xl mx-auto py-12">
      <div className="relative p-8 sm:p-12 bg-gradient-to-b from-calm-bg-card to-calm-bg-surface border border-calm-border/80 rounded-3xl text-center flex flex-col items-center gap-5 shadow-lg overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-32 bg-calm-sage/15 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col gap-2 relative z-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-calm-text tracking-tight">
            Your spot is waiting.
          </h2>
          <p className="text-xs sm:text-sm text-calm-text-muted max-w-md">
            Registration takes less than a minute. Enter your name and email to join now.
          </p>
        </div>

        <button
          onClick={scrollToRegister}
          className="group relative z-10 px-8 py-3.5 bg-calm-sage text-calm-bg-deep font-bold rounded-2xl text-sm sm:text-base flex items-center gap-2 hover:opacity-95 active:scale-[0.98] transition-all shadow-md cursor-pointer min-h-touch"
        >
          <span>Register Now</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </section>
  );
};
