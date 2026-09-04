"use client";

import React from "react";
import { usePacingStore } from "@/store/pacingStore";
import { Moon, EyeOff, Wind, Shield } from "lucide-react";

export default function SanctuaryPage() {
  const { openSanctuary } = usePacingStore();

  return (
    <div className="flex flex-col gap-6 max-w-reading mx-auto text-center sm:text-left">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl sm:text-2xl font-bold text-calm-text">
          Dark Sanctuary
        </h1>
        <p className="text-xs text-calm-text-muted leading-relaxed">
          A sensory-deprived environment designed for screen intolerance, headache relief, and parasympathetic reset.
        </p>
      </div>

      <div className="p-8 bg-calm-bg-card border border-calm-border rounded-2xl flex flex-col items-center text-center gap-6 shadow-md">
        <div className="w-16 h-16 rounded-full bg-calm-bg-surface border border-calm-border flex items-center justify-center text-calm-sage">
          <Moon className="w-8 h-8" />
        </div>

        <div className="flex flex-col gap-2 max-w-md">
          <h2 className="text-lg font-bold text-calm-text">
            Sensory Rest & Box Breathing
          </h2>
          <p className="text-xs text-calm-text-muted leading-relaxed">
            Entering the Sanctuary dims all bright screen elements, pauses cognitive inputs, and guides you through 4-4-4-4 rhythmic box breathing.
          </p>
        </div>

        <button
          onClick={openSanctuary}
          className="w-full sm:w-auto px-8 py-4 bg-calm-sage text-calm-bg-deep font-bold rounded-xl text-base shadow-lg hover:opacity-95 transition-all min-h-touch flex items-center justify-center gap-2.5"
        >
          <EyeOff className="w-5 h-5" />
          <span>Enter Dark Sanctuary Now</span>
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left pt-4 border-t border-calm-border">
          <div className="p-3 bg-calm-bg-surface border border-calm-border rounded-xl flex items-start gap-2.5">
            <Wind className="w-4 h-4 text-calm-sage flex-shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-calm-text">Box Breathing</span>
              <span className="text-[11px] text-calm-text-muted">
                Calms sympathetic autonomic arousal often triggered by head trauma.
              </span>
            </div>
          </div>
          <div className="p-3 bg-calm-bg-surface border border-calm-border rounded-xl flex items-start gap-2.5">
            <Shield className="w-4 h-4 text-calm-sage flex-shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-calm-text">Zero Flashing</span>
              <span className="text-[11px] text-calm-text-muted">
                Zero sudden shifts or glare; safe for severe photophobia.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
