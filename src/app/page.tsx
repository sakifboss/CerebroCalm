"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSymptomStore } from "@/store/symptomStore";
import { usePacingStore } from "@/store/pacingStore";
import { useSettingsStore } from "@/store/settingsStore";
import { PatientProfileModal } from "@/components/PatientProfileModal";
import { calculateDaysPostInjury, getStageInfo } from "@/lib/profileEngine";
import {
  Activity,
  Clock,
  Moon,
  LineChart,
  AlertCircle,
  ShieldCheck,
  UserCog,
  FileText,
  Calendar,
  Stethoscope,
  Zap,
  Building2,
  Sparkles,
} from "lucide-react";

export default function DashboardPage() {
  const { entries, assessment, prediction, loadEntries } = useSymptomStore();
  const { status, secondsRemaining, openSanctuary, startActivity } = usePacingStore();
  const { pacing, profile } = useSettingsStore();

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const latestEntry = entries.length > 0 ? entries[entries.length - 1] : null;
  const daysPostInjury = calculateDaysPostInjury(profile.injuryDate);
  const stageInfo = getStageInfo(profile.recoveryStage);

  // Formatting remaining pacing time
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedRemaining = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;

  return (
    <div className="flex flex-col gap-8 max-w-reading mx-auto">
      {/* Patient Profile & Clinical Timeline Header */}
      <section aria-label="Patient Profile Summary" className="p-4 bg-calm-bg-card border border-calm-border rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-calm-sage-surface border border-calm-sage/30 flex items-center justify-center text-calm-sage font-bold">
            {(profile.name || "P").slice(0, 1).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-calm-text">
                Welcome, {profile.name || "Patient"}
              </span>
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="text-[11px] text-calm-sage hover:underline flex items-center gap-1 font-medium"
                aria-label="Edit patient recovery profile"
              >
                <UserCog className="w-3.5 h-3.5" />
                <span>Profile</span>
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-calm-text-muted mt-0.5">
              {daysPostInjury !== null && (
                <span className="px-2 py-0.5 rounded bg-calm-bg-surface border border-calm-border text-calm-text font-mono">
                  Day {daysPostInjury} Post-Injury
                </span>
              )}
              <span className="text-calm-text-dim">
                {stageInfo.name.split(":")[0]} ({stageInfo.recommendedActivityMins}m pacing)
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <Link
            href="/welcome"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-calm-bg-surface hover:bg-calm-bg-elevated border border-calm-border hover:border-calm-sage/60 text-calm-text-muted hover:text-calm-text rounded-xl text-xs font-medium transition-colors justify-center"
          >
            <span>Onboarding</span>
          </Link>
          <Link
            href="/report"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-calm-bg-surface hover:bg-calm-bg-elevated border border-calm-border hover:border-calm-sage text-calm-text rounded-xl text-xs font-semibold transition-colors justify-center"
          >
            <FileText className="w-3.5 h-3.5 text-calm-sage" />
            <span>Doctor's Report</span>
          </Link>
        </div>
      </section>

      {/* Gentle Onboarding Banner if not completed */}
      {!profile.hasCompletedOnboarding && (
        <div className="p-4 bg-calm-sage-surface/40 border border-calm-sage/40 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-calm-sage-surface border border-calm-sage/30 text-calm-sage">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-calm-text">
                Welcome to your low-cognitive recovery companion
              </p>
              <p className="text-calm-text-muted">
                Complete your local profile setup, concussion timeline, or load clinical demo data.
              </p>
            </div>
          </div>
          <Link
            href="/welcome"
            className="px-3 py-1.5 bg-calm-sage text-calm-bg-deep font-bold rounded-xl text-xs hover:opacity-95 transition-opacity shrink-0 self-stretch sm:self-auto text-center"
          >
            Get Started →
          </Link>
        </div>
      )}

      {/* Three Core Questions Section */}
      <section aria-labelledby="status-overview" className="flex flex-col gap-4">
        <h1 id="status-overview" className="sr-only">
          Current Recovery Status Overview
        </h1>

        {/* 1. How am I feeling? */}
        <div className="p-5 bg-calm-bg-card border border-calm-border rounded-2xl flex flex-col gap-2 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-calm-text-muted">
            1. How am I feeling?
          </span>
          {latestEntry ? (
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-calm-text">
                  Headache: {latestEntry.headache}/5 · Fatigue: {latestEntry.cognitiveFatigue}/5
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-calm-bg-surface border border-calm-border text-calm-sage capitalize font-medium">
                  {latestEntry.mood}
                </span>
              </div>
              <p className="text-xs text-calm-text-muted">
                Last checked {new Date(latestEntry.timestamp).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}.
                {latestEntry.isDemo && " (Demo entry)"}
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-sm text-calm-text-muted">No check-in recorded yet today.</p>
              <Link
                href="/symptoms"
                className="text-xs text-calm-sage font-semibold hover:underline"
              >
                Log Check-in →
              </Link>
            </div>
          )}
        </div>

        {/* 2. What should I do now? */}
        <div className="p-5 bg-calm-bg-card border border-calm-border rounded-2xl flex flex-col gap-2.5 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-calm-text-muted">
            2. What should I do now?
          </span>
          <div className="flex items-start gap-3">
            <div
              className={`p-2 rounded-xl mt-0.5 ${
                assessment.state === "COGNITIVE_LOAD_HIGH"
                  ? "bg-calm-amber-surface text-calm-amber border border-calm-amber-muted"
                  : "bg-calm-sage-surface text-calm-sage border border-calm-sage/30"
              }`}
            >
              {assessment.state === "COGNITIVE_LOAD_HIGH" ? (
                <AlertCircle className="w-5 h-5" />
              ) : (
                <ShieldCheck className="w-5 h-5" />
              )}
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-base font-bold text-calm-text leading-snug">
                {assessment.state === "COGNITIVE_LOAD_HIGH"
                  ? "Take a recovery break — sensory rest advised"
                  : assessment.state === "COGNITIVE_LOAD_ELEVATED"
                  ? "Paced light activity only — avoid high glare"
                  : "Proceed with clinician-approved paced tasks"}
              </span>
              <p className="text-xs text-calm-text-muted leading-relaxed">
                {assessment.reason}
              </p>
            </div>
          </div>
        </div>

        {/* 3. When should I take a break? */}
        <div className="p-5 bg-calm-bg-card border border-calm-border rounded-2xl flex flex-col gap-2 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-calm-text-muted">
            3. When should I take a break?
          </span>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-bold font-mono text-calm-text">
                {status === "active"
                  ? `${formattedRemaining} remaining in session`
                  : status === "break"
                  ? `In recovery break (${formattedRemaining})`
                  : `Next planned break in ${pacing.activityMinutes} minutes`}
              </span>
              <p className="text-xs text-calm-text-muted mt-0.5">
                {status === "active"
                  ? "Stop current reading or screen task when the timer chimes."
                  : "Rest before symptoms escalate."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Primary Actions */}
      <section aria-labelledby="primary-actions" className="flex flex-col gap-3">
        <h2 id="primary-actions" className="text-xs font-bold uppercase tracking-wider text-calm-text-muted">
          Immediate Recovery & Pacing Actions
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Action 1: Log Symptoms */}
          <Link
            href="/symptoms"
            className="flex items-center gap-3.5 p-4 bg-calm-bg-surface hover:bg-calm-bg-elevated border border-calm-border hover:border-calm-border-focus rounded-xl transition-colors min-h-touch group"
          >
            <div className="p-2.5 rounded-lg bg-calm-bg-card border border-calm-border text-calm-sage group-hover:border-calm-sage transition-colors">
              <Activity className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-calm-text">Log Symptoms</span>
              <span className="text-xs text-calm-text-muted">Quick 5-second check-in</span>
            </div>
          </Link>

          {/* Action 2: Start Pacing */}
          {status === "idle" ? (
            <button
              onClick={() => startActivity(pacing.activityMinutes)}
              className="flex items-center gap-3.5 p-4 bg-calm-bg-surface hover:bg-calm-bg-elevated border border-calm-border hover:border-calm-border-focus rounded-xl transition-colors min-h-touch text-left group"
            >
              <div className="p-2.5 rounded-lg bg-calm-bg-card border border-calm-border text-calm-sage group-hover:border-calm-sage transition-colors">
                <Clock className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-calm-text">Start Pacing</span>
                <span className="text-xs text-calm-text-muted">
                  Begin {pacing.activityMinutes}m activity block
                </span>
              </div>
            </button>
          ) : (
            <Link
              href="/pacing"
              className="flex items-center gap-3.5 p-4 bg-calm-bg-surface hover:bg-calm-bg-elevated border border-calm-border hover:border-calm-border-focus rounded-xl transition-colors min-h-touch group"
            >
              <div className="p-2.5 rounded-lg bg-calm-bg-card border border-calm-border text-calm-amber group-hover:border-calm-amber transition-colors">
                <Clock className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-calm-text">View Active Pacing</span>
                <span className="text-xs text-calm-text-muted">
                  Timer running: {formattedRemaining}
                </span>
              </div>
            </Link>
          )}

          {/* Action 3: Enter Dark Sanctuary */}
          <button
            onClick={openSanctuary}
            className="flex items-center gap-3.5 p-4 bg-calm-bg-surface hover:bg-calm-bg-elevated border border-calm-border hover:border-calm-border-focus rounded-xl transition-colors min-h-touch text-left group"
          >
            <div className="p-2.5 rounded-lg bg-calm-bg-card border border-calm-border text-calm-sage group-hover:border-calm-sage transition-colors">
              <Moon className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-calm-text">Enter Dark Sanctuary</span>
              <span className="text-xs text-calm-text-muted">Brown noise & box breathing</span>
            </div>
          </button>

          {/* Action 4: View Trends */}
          <Link
            href="/insights"
            className="flex items-center gap-3.5 p-4 bg-calm-bg-surface hover:bg-calm-bg-elevated border border-calm-border hover:border-calm-border-focus rounded-xl transition-colors min-h-touch group"
          >
            <div className="p-2.5 rounded-lg bg-calm-bg-card border border-calm-border text-calm-sage group-hover:border-calm-sage transition-colors">
              <LineChart className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-calm-text">View My Trends</span>
              <span className="text-xs text-calm-text-muted">Personal recovery patterns</span>
            </div>
          </Link>
        </div>

        {/* Clinical & Neuro-Recovery Tools Section */}
        <div className="flex flex-col gap-2 pt-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-calm-text-muted">
            Clinical Documents & Assessments
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Tool 1: Doctor's Report */}
            <Link
              href="/report"
              className="flex flex-col justify-between p-4 bg-calm-bg-card hover:bg-calm-bg-surface border border-calm-border hover:border-calm-sage/50 rounded-xl transition-colors text-xs text-calm-text group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg bg-calm-sage-surface border border-calm-sage/30 text-calm-sage">
                  <FileText className="w-4 h-4" />
                </div>
                <span className="text-calm-sage text-[11px] font-semibold group-hover:underline">Print PDF →</span>
              </div>
              <div>
                <span className="font-bold text-calm-text block text-sm mb-0.5">
                  Doctor's Report
                </span>
                <span className="text-calm-text-muted text-[11px] leading-snug">
                  7-day trajectory table & red-flag audit for neurology visits.
                </span>
              </div>
            </Link>

            {/* Tool 2: Accommodation Letter */}
            <Link
              href="/accommodations"
              className="flex flex-col justify-between p-4 bg-calm-bg-card hover:bg-calm-bg-surface border border-calm-border hover:border-calm-sage/50 rounded-xl transition-colors text-xs text-calm-text group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg bg-calm-sage-surface border border-calm-sage/30 text-calm-sage">
                  <Building2 className="w-4 h-4" />
                </div>
                <span className="text-calm-sage text-[11px] font-semibold group-hover:underline">Generate →</span>
              </div>
              <div>
                <span className="font-bold text-calm-text block text-sm mb-0.5">
                  Work/School Letter
                </span>
                <span className="text-calm-text-muted text-[11px] leading-snug">
                  Official accommodation notice adapted to your recovery stage.
                </span>
              </div>
            </Link>

            {/* Tool 3: Reaction Check */}
            <Link
              href="/reaction"
              className="flex flex-col justify-between p-4 bg-calm-bg-card hover:bg-calm-bg-surface border border-calm-border hover:border-calm-sage/50 rounded-xl transition-colors text-xs text-calm-text group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg bg-calm-sage-surface border border-calm-sage/30 text-calm-sage">
                  <Zap className="w-4 h-4" />
                </div>
                <span className="text-calm-sage text-[11px] font-semibold group-hover:underline">Test (15s) →</span>
              </div>
              <div>
                <span className="font-bold text-calm-text block text-sm mb-0.5">
                  Reaction Stability
                </span>
                <span className="text-calm-text-muted text-[11px] leading-snug">
                  Low-glare test measuring processing latency & consistency.
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Lightweight ML Personal Insight */}
      {prediction.hasSufficientData && (
        <section aria-labelledby="ml-insight" className="p-4 bg-calm-bg-card border border-calm-border rounded-xl flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span id="ml-insight" className="text-xs font-semibold uppercase tracking-wider text-calm-sage">
              Personal Pacing Observation
            </span>
            <span className="text-[11px] text-calm-text-muted">
              Confidence: {Math.round(prediction.confidenceScore * 100)}%
            </span>
          </div>
          <p className="text-xs text-calm-text leading-relaxed">
            {prediction.recommendation}
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {prediction.contributingFactors.map((f, i) => (
              <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-calm-bg-surface text-calm-text-muted border border-calm-border">
                {f}
              </span>
            ))}
          </div>
          <span className="text-[10px] text-calm-text-dim italic mt-1">
            {prediction.disclaimer}
          </span>
        </section>
      )}

      {/* Patient Profile Modal */}
      <PatientProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </div>
  );
}
