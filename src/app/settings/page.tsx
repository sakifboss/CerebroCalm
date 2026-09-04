"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AccessibilityControls } from "@/components/AccessibilityControls";
import { useSettingsStore } from "@/store/settingsStore";
import { useSymptomStore } from "@/store/symptomStore";
import { PACING_CLINICAL_NOTE, PACING_DEFAULTS } from "@/lib/constants";
import { sanitizePacingMinutes } from "@/lib/pacingEngine";
import { Sliders, Bell, Trash2, Check, Shield, User, LogOut } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const { pacing, profile, setPacingMinutes, setSoundEnabled, resetAllSettings, logoutOrResetProfile } = useSettingsStore();
  const { clearAllEntries } = useSymptomStore();

  const [actMins, setActMins] = useState(pacing.activityMinutes);
  const [brkMins, setBrkMins] = useState(pacing.breakMinutes);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showWipeConfirm, setShowWipeConfirm] = useState(false);

  const handleSavePacing = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanAct = sanitizePacingMinutes(actMins, "activity");
    const cleanBrk = sanitizePacingMinutes(brkMins, "break");
    setPacingMinutes(cleanAct, cleanBrk);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 1500);
  };

  const handleWipeAll = async () => {
    await clearAllEntries();
    resetAllSettings();
    setShowWipeConfirm(false);
  };

  return (
    <div className="flex flex-col gap-6 max-w-reading mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-1 text-center sm:text-left">
        <h1 className="text-xl sm:text-2xl font-bold text-calm-text">
          Settings & Accessibility
        </h1>
        <p className="text-xs text-calm-text-muted leading-relaxed">
          Configure sensory thresholds, pacing durations, and accessibility preferences.
        </p>
      </div>

      {/* Theme & Visual Strain */}
      <ThemeToggle />

      {/* Text Size & Readability */}
      <AccessibilityControls />

      {/* Pacing Configuration */}
      <form onSubmit={handleSavePacing} className="p-5 bg-calm-bg-card border border-calm-border rounded-xl flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-calm-sage" />
          <h2 className="text-base font-semibold text-calm-text">
            Pacing Durations
          </h2>
        </div>

        <p className="text-xs text-calm-text-muted leading-relaxed">
          {PACING_CLINICAL_NOTE}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="act-mins" className="text-xs font-semibold text-calm-text">
              Activity Interval (Minutes)
            </label>
            <input
              id="act-mins"
              type="number"
              min={PACING_DEFAULTS.MIN_ACTIVITY_MINUTES}
              max={PACING_DEFAULTS.MAX_ACTIVITY_MINUTES}
              value={actMins}
              onChange={(e) => setActMins(Number(e.target.value))}
              className="p-3 bg-calm-bg-surface border border-calm-border rounded-xl text-sm font-bold text-calm-text focus:border-calm-sage focus:outline-none min-h-touch"
            />
            <span className="text-[11px] text-calm-text-muted">Between 5 and 60 minutes</span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="brk-mins" className="text-xs font-semibold text-calm-text">
              Recovery Break Interval (Minutes)
            </label>
            <input
              id="brk-mins"
              type="number"
              min={PACING_DEFAULTS.MIN_BREAK_MINUTES}
              max={PACING_DEFAULTS.MAX_BREAK_MINUTES}
              value={brkMins}
              onChange={(e) => setBrkMins(Number(e.target.value))}
              className="p-3 bg-calm-bg-surface border border-calm-border rounded-xl text-sm font-bold text-calm-text focus:border-calm-sage focus:outline-none min-h-touch"
            />
            <span className="text-[11px] text-calm-text-muted">Between 2 and 30 minutes</span>
          </div>
        </div>

        <button
          type="submit"
          className="flex items-center justify-center gap-2 py-3 px-5 bg-calm-bg-surface hover:bg-calm-bg-elevated border border-calm-sage text-calm-text font-semibold rounded-xl text-xs transition-colors min-h-touch self-start"
        >
          {savedSuccess ? <Check className="w-4 h-4 text-calm-sage" /> : null}
          <span>{savedSuccess ? "Pacing Durations Saved" : "Save Pacing Settings"}</span>
        </button>
      </form>

      {/* Audio Prompts Toggle */}
      <div className="p-4 bg-calm-bg-card border border-calm-border rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Bell className="w-4 h-4 text-calm-sage" />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-calm-text">Gentle Audio Chimes</span>
            <span className="text-xs text-calm-text-muted">Subdued chime when activity blocks conclude</span>
          </div>
        </div>
        <button
          onClick={() => setSoundEnabled(!pacing.soundEnabled)}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold min-h-[36px] min-w-[60px] border transition-colors ${
            pacing.soundEnabled
              ? "bg-calm-sage text-calm-bg-deep border-calm-sage"
              : "bg-calm-bg-surface text-calm-text-muted border-calm-border"
          }`}
          aria-pressed={pacing.soundEnabled}
        >
          {pacing.soundEnabled ? "Enabled" : "Muted"}
        </button>
      </div>

      {/* Active Patient Session */}
      <div className="p-5 bg-calm-bg-card border border-calm-border rounded-xl flex flex-col gap-3">
        <div className="flex items-center gap-2 text-calm-sage">
          <User className="w-4 h-4" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-calm-text">
            Active Patient Session
          </h2>
        </div>
        <p className="text-xs text-calm-text-muted leading-relaxed">
          Currently registered on this device as <strong className="text-calm-text">{profile.name || "Anonymous Patient"}</strong>. You can switch accounts or re-enter onboarding.
        </p>

        <button
          onClick={() => {
            logoutOrResetProfile();
            router.push("/welcome");
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-calm-bg-surface hover:bg-calm-bg-elevated border border-calm-border hover:border-calm-sage text-calm-text rounded-xl text-xs font-semibold transition-colors min-h-touch self-start"
        >
          <LogOut className="w-4 h-4 text-calm-sage" />
          <span>Switch Patient / Re-register</span>
        </button>
      </div>

      {/* Local Storage & Wipe Data */}
      <div className="p-5 bg-calm-bg-card border border-calm-border rounded-xl flex flex-col gap-3">
        <div className="flex items-center gap-2 text-calm-emergency">
          <Trash2 className="w-4 h-4" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-calm-text">
            Reset All Local Data
          </h2>
        </div>
        <p className="text-xs text-calm-text-muted leading-relaxed">
          Purge all locally stored symptom logs, pacing sessions, and encryption keys from this browser. This action is permanent.
        </p>

        {!showWipeConfirm ? (
          <button
            onClick={() => setShowWipeConfirm(true)}
            className="px-4 py-2.5 bg-calm-bg-surface hover:bg-calm-emergency-surface border border-calm-border hover:border-calm-emergency text-calm-text-muted hover:text-calm-text rounded-xl text-xs font-semibold transition-colors min-h-touch self-start"
          >
            Clear All Data...
          </button>
        ) : (
          <div className="p-3.5 bg-calm-emergency-surface border border-calm-emergency/50 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <span className="text-xs text-calm-text">Are you sure you want to permanently erase all local records?</span>
            <div className="flex items-center gap-2">
              <button
                onClick={async () => {
                  await clearAllEntries();
                  resetAllSettings();
                  setShowWipeConfirm(false);
                  router.push("/welcome");
                }}
                className="px-3.5 py-2 bg-calm-emergency text-calm-text font-bold rounded-lg text-xs min-h-touch"
              >
                Yes, Purge
              </button>
              <button
                onClick={() => setShowWipeConfirm(false)}
                className="px-3.5 py-2 bg-calm-bg-surface text-calm-text-muted hover:text-calm-text rounded-lg text-xs min-h-touch"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
