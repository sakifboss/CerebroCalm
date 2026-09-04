"use client";

import React from "react";
import { useSettingsStore } from "@/store/settingsStore";
import { Type, ShieldCheck, Eye } from "lucide-react";

export const AccessibilityControls: React.FC = () => {
  const { accessibility, setFontSize } = useSettingsStore();

  const fontSizes: { id: "standard" | "large" | "extra-large"; label: string; preview: string }[] = [
    { id: "standard", label: "Standard", preview: "16px base" },
    { id: "large", label: "Comfort", preview: "18px base" },
    { id: "extra-large", label: "Expanded", preview: "20px base" },
  ];

  return (
    <div className="flex flex-col gap-4 p-5 bg-calm-bg-card border border-calm-border rounded-xl">
      <div className="flex items-center gap-2">
        <Type className="w-5 h-5 text-calm-sage" />
        <h3 className="text-base font-medium text-calm-text">Readability & Text Scale</h3>
      </div>
      <p className="text-xs text-calm-text-muted leading-relaxed max-w-reading">
        Larger font sizes reduce visual strain when cognitive fatigue or eye convergence makes reading difficult.
      </p>

      <div className="grid grid-cols-3 gap-2">
        {fontSizes.map((f) => {
          const isSelected = accessibility.fontSize === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setFontSize(f.id)}
              className={`p-3 rounded-lg border text-center transition-colors min-h-touch ${
                isSelected
                  ? "bg-calm-bg-elevated border-calm-sage text-calm-text shadow-sm"
                  : "bg-calm-bg-surface border-calm-border text-calm-text-dim hover:border-calm-border-focus"
              }`}
              aria-pressed={isSelected}
            >
              <div className="text-sm font-semibold">{f.label}</div>
              <div className="text-xs text-calm-text-muted mt-0.5">{f.preview}</div>
            </button>
          );
        })}
      </div>

      <div className="mt-2 p-3 bg-calm-bg-surface border border-calm-border rounded-lg flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-calm-sage flex-shrink-0 mt-0.5" />
        <span className="text-xs text-calm-text-muted leading-relaxed">
          Complies with WCAG 2.2 AA standards: Minimum 48px tactile touch targets, 4.5:1 text contrast ratio, and glare-free warm tone balance.
        </span>
      </div>
    </div>
  );
};
