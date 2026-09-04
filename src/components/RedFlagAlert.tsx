"use client";

import React from "react";
import { useSettingsStore } from "@/store/settingsStore";
import { AlertOctagon, PhoneCall, X, ShieldAlert } from "lucide-react";

export const RedFlagAlert: React.FC = () => {
  const { activeRedFlag, clearRedFlag, profile } = useSettingsStore();

  if (!activeRedFlag) return null;

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="redflag-title"
      aria-describedby="redflag-desc"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    >
      <div className="w-full max-w-lg bg-calm-bg-card border-2 border-calm-emergency rounded-2xl p-6 shadow-2xl flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="p-3 bg-calm-emergency-surface border border-calm-emergency text-calm-text rounded-xl flex-shrink-0">
            <AlertOctagon className="w-8 h-8 text-calm-emergency" />
          </div>
          <div className="flex-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-calm-emergency">
              Emergency Safety Alert
            </span>
            <h2 id="redflag-title" className="text-xl font-bold text-calm-text mt-0.5">
              Urgent Medical Evaluation Required
            </h2>
          </div>
          <button
            onClick={clearRedFlag}
            className="p-2 text-calm-text-muted hover:text-calm-text rounded-lg min-h-touch min-w-touch flex items-center justify-center"
            aria-label="Close emergency warning"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Trigger Symptoms */}
        <div className="p-3.5 bg-calm-bg-surface border border-calm-border rounded-xl">
          <span className="text-xs font-semibold text-calm-text-dim block mb-1">
            Flagged Symptom Indicator:
          </span>
          <ul className="list-disc list-inside space-y-1 text-sm text-calm-text">
            {activeRedFlag.matchedSymptoms.map((sym, idx) => (
              <li key={idx} className="leading-snug">
                {sym}
              </li>
            ))}
          </ul>
        </div>

        {/* Guidance */}
        <p id="redflag-desc" className="text-sm text-calm-text-muted leading-relaxed">
          {activeRedFlag.guidanceText}
        </p>

        {/* Emergency Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <a
            href="tel:911"
            className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 bg-calm-emergency text-calm-text font-bold rounded-xl text-base shadow-lg hover:bg-calm-emergency-dark transition-colors min-h-touch text-center"
          >
            <PhoneCall className="w-5 h-5" />
            Call 911 / Emergency
          </a>

          {profile.doctorPhone && (
            <a
              href={`tel:${profile.doctorPhone}`}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 bg-calm-bg-surface hover:bg-calm-bg-elevated border border-calm-sage text-calm-text font-bold rounded-xl text-sm transition-colors min-h-touch text-center"
            >
              <PhoneCall className="w-4 h-4 text-calm-sage" />
              <span>Call {profile.doctorName || "Clinic"}</span>
            </a>
          )}

          <button
            onClick={clearRedFlag}
            className="px-5 py-3.5 bg-calm-bg-surface border border-calm-border text-calm-text-muted hover:text-calm-text font-semibold rounded-xl text-sm transition-colors min-h-touch"
          >
            Acknowledge / Close
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-calm-text-muted justify-center border-t border-calm-border pt-3">
          <ShieldAlert className="w-4 h-4 text-calm-amber" />
          <span>Deterministic safety logic has superseded all normal pacing and AI prompts.</span>
        </div>
      </div>
    </div>
  );
};
