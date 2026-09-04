"use client";

import React from "react";
import { Check, ShieldCheck, Zap, Lock } from "lucide-react";

export const TrustSection: React.FC = () => {
  return (
    <section id="trust-section" className="w-full max-w-lg mx-auto py-2">
      <div className="p-4 bg-calm-bg-card/70 border border-calm-border/60 rounded-2xl flex flex-col gap-2.5 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-bold uppercase tracking-wider text-calm-text">
          <ShieldCheck className="w-4 h-4 text-calm-sage" />
          <span>Simple. Secure. Fast.</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-calm-text-muted">
          <div className="flex items-center justify-center sm:justify-start gap-1.5">
            <Check className="w-3.5 h-3.5 text-calm-sage shrink-0" />
            <span>No unnecessary info</span>
          </div>
          <div className="flex items-center justify-center sm:justify-start gap-1.5">
            <Check className="w-3.5 h-3.5 text-calm-sage shrink-0" />
            <span>Secure registration</span>
          </div>
          <div className="flex items-center justify-center sm:justify-start gap-1.5">
            <Check className="w-3.5 h-3.5 text-calm-sage shrink-0" />
            <span>Instant confirmation</span>
          </div>
        </div>
      </div>
    </section>
  );
};
