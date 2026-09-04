"use client";

import React, { useEffect, useState } from "react";
import { SymptomLogger } from "@/components/SymptomLogger";
import { useSymptomStore } from "@/store/symptomStore";
import { formatDate } from "@/lib/utils";
import { Activity, Shield, Clock } from "lucide-react";

export default function SymptomsPage() {
  const { entries, loadEntries } = useSymptomStore();
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  return (
    <div className="flex flex-col gap-6 max-w-reading mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-1 text-center sm:text-left">
        <h1 className="text-xl sm:text-2xl font-bold text-calm-text">
          Quick Recovery Check-In
        </h1>
        <p className="text-xs text-calm-text-muted leading-relaxed">
          Record your current state in a few seconds. Designed to avoid screen strain.
        </p>
      </div>

      {/* Main Tactile Symptom Logger */}
      <SymptomLogger />

      {/* Toggle Recent Entries Log */}
      <div className="pt-4 border-t border-calm-border flex flex-col gap-4">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="text-xs text-calm-text-dim hover:text-calm-text py-2 flex items-center justify-between"
        >
          <span>Recent Stored Check-Ins ({entries.length})</span>
          <span className="text-calm-sage">{showHistory ? "Hide ↑" : "View ↓"}</span>
        </button>

        {showHistory && (
          <div className="flex flex-col gap-2.5">
            {entries.length === 0 ? (
              <p className="text-xs text-calm-text-muted italic text-center p-4">
                No entries saved yet.
              </p>
            ) : (
              entries
                .slice(-5)
                .reverse()
                .map((entry) => (
                  <div
                    key={entry.id}
                    className="p-3.5 bg-calm-bg-card border border-calm-border rounded-xl flex items-center justify-between text-xs"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-calm-text">
                          Headache: {entry.headache} · Sensory: {entry.sensorySensitivity} · Fatigue: {entry.cognitiveFatigue}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-calm-bg-surface text-calm-text-muted capitalize">
                          {entry.mood}
                        </span>
                        {entry.isDemo && (
                          <span className="px-1.5 py-0.5 rounded bg-calm-amber-surface text-calm-amber font-mono text-[10px]">
                            DEMO
                          </span>
                        )}
                      </div>
                      {entry.note && (
                        <p className="text-calm-text-dim italic">"{entry.note}"</p>
                      )}
                    </div>
                    <div className="text-[11px] text-calm-text-muted whitespace-nowrap pl-3">
                      {formatDate(entry.timestamp)}
                    </div>
                  </div>
                ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
