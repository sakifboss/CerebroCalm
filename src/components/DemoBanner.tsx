"use client";

import React, { useState } from "react";
import { useSymptomStore } from "@/store/symptomStore";
import { useSettingsStore } from "@/store/settingsStore";
import { Sparkles, AlertOctagon, RefreshCw, Trash2, ShieldAlert } from "lucide-react";

export const DemoBanner: React.FC = () => {
  const { injectSyntheticDemoData, clearDemoEntries } = useSymptomStore();
  const { demoMode, setDemoMode, triggerRedFlag } = useSettingsStore();
  const [activeScenario, setActiveScenario] = useState<string | null>(null);

  if (!demoMode) {
    return (
      <div className="w-full bg-calm-bg-card/70 border-b border-calm-border px-4 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-calm-text-dim">
          <Sparkles className="w-3.5 h-3.5 text-calm-sage" />
          <span>Hackathon Demo Mode</span>
        </div>
        <button
          onClick={() => setDemoMode(true)}
          className="px-2.5 py-1 bg-calm-bg-surface hover:bg-calm-bg-elevated border border-calm-border text-calm-sage rounded text-[11px] font-semibold transition-colors"
        >
          Enable Demo Tools
        </button>
      </div>
    );
  }

  const handleSimulateRedFlag = () => {
    triggerRedFlag({
      id: `demo_rf_${Date.now()}`,
      timestamp: new Date().toISOString(),
      triggerReason: "Simulated Red-Flag Event (Hackathon Demonstration)",
      matchedSymptoms: [
        "Simulated: Repeated vomiting",
        "Simulated: Sudden slurred speech & confusion",
      ],
      guidanceText:
        "Emergency warning signs require immediate medical attention. Call 911 or visit the nearest emergency department immediately. Normal coaching is superseded.",
      requiresImmediateEvaluation: true,
    });
  };

  return (
    <div className="w-full bg-calm-amber-surface/70 border-b-2 border-calm-amber-muted px-4 py-2.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs text-calm-text">
      <div className="flex items-center gap-2">
        <span className="px-2 py-0.5 bg-calm-amber-muted text-calm-bg-deep font-bold rounded text-[10px] tracking-wider uppercase">
          Demo Mode
        </span>
        <span className="text-calm-text-muted hidden sm:inline">
          Synthetic test data only · Isolated from real logs
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={async () => {
            setActiveScenario("stable");
            await injectSyntheticDemoData("stable");
          }}
          className="px-2.5 py-1.5 bg-calm-bg-surface hover:bg-calm-bg-elevated border border-calm-border rounded text-[11px] font-medium text-calm-text flex items-center gap-1.5"
        >
          <Sparkles className="w-3 h-3 text-calm-sage" />
          <span>Stable Baseline</span>
        </button>

        <button
          onClick={async () => {
            setActiveScenario("escalation");
            await injectSyntheticDemoData("escalation");
          }}
          className="px-2.5 py-1.5 bg-calm-bg-surface hover:bg-calm-bg-elevated border border-calm-border rounded text-[11px] font-medium text-calm-amber flex items-center gap-1.5"
        >
          <AlertOctagon className="w-3 h-3 text-calm-amber" />
          <span>Cognitive Overload</span>
        </button>

        <button
          onClick={handleSimulateRedFlag}
          className="px-2.5 py-1.5 bg-calm-emergency-surface hover:bg-calm-emergency/30 border border-calm-emergency text-calm-text rounded text-[11px] font-medium flex items-center gap-1.5"
        >
          <ShieldAlert className="w-3 h-3 text-calm-emergency" />
          <span>Trigger Red Flag</span>
        </button>

        <button
          onClick={async () => {
            await clearDemoEntries();
            setActiveScenario(null);
          }}
          className="px-2.5 py-1.5 bg-calm-bg-surface hover:bg-calm-bg-elevated border border-calm-border text-calm-text-muted hover:text-calm-text rounded text-[11px] flex items-center gap-1"
          title="Purge only synthetic demo entries"
        >
          <Trash2 className="w-3 h-3" />
          <span>Purge Demo</span>
        </button>

        <button
          onClick={() => setDemoMode(false)}
          className="text-calm-text-dim hover:text-calm-text text-[11px] underline pl-1"
        >
          Hide
        </button>
      </div>
    </div>
  );
};
