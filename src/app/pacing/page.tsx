"use client";

import React from "react";
import { PacingAssistant } from "@/components/PacingAssistant";
import { Clock, ShieldCheck, HeartHandshake } from "lucide-react";

export default function PacingPage() {
  return (
    <div className="flex flex-col gap-6 max-w-reading mx-auto">
      <div className="flex flex-col gap-1 text-center sm:text-left">
        <h1 className="text-xl sm:text-2xl font-bold text-calm-text">
          Cognitive Pacing Assistant
        </h1>
        <p className="text-xs text-calm-text-muted leading-relaxed">
          Pacing prevents the "push-crash" cycle by introducing structured recovery breaks before fatigue accumulates.
        </p>
      </div>

      <PacingAssistant />

      {/* Pacing Principles Educational Card */}
      <div className="p-5 bg-calm-bg-card border border-calm-border rounded-xl flex flex-col gap-3">
        <div className="flex items-center gap-2 text-calm-sage">
          <HeartHandshake className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Clinical Pacing Principle
          </span>
        </div>
        <p className="text-xs text-calm-text-muted leading-relaxed">
          In concussion rehabilitation, rest should occur <em>before</em> symptoms spike. Taking scheduled micro-breaks allows neuronal metabolic recovery and helps you maintain sustained function throughout the day.
        </p>
      </div>
    </div>
  );
}
