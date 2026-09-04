"use client";

import React, { useEffect, useMemo } from "react";
import { useSymptomStore } from "@/store/symptomStore";
import { usePacingStore } from "@/store/pacingStore";
import { analyzeSymptomTrends } from "@/lib/trendAnalysis";
import { RecoveryChart } from "@/components/RecoveryChart";
import { LineChart, TrendingDown, TrendingUp, Minus, ShieldCheck, Clock } from "lucide-react";

export default function InsightsPage() {
  const { entries, loadEntries, prediction } = useSymptomStore();
  const { sessionsHistory, loadHistory } = usePacingStore();

  useEffect(() => {
    loadEntries();
    loadHistory();
  }, [loadEntries, loadHistory]);

  const trends = useMemo(() => analyzeSymptomTrends(entries), [entries]);

  const directionIcon =
    trends.direction === "easing" ? (
      <TrendingDown className="w-4 h-4 text-calm-sage" />
    ) : trends.direction === "elevating" ? (
      <TrendingUp className="w-4 h-4 text-calm-amber" />
    ) : (
      <Minus className="w-4 h-4 text-calm-text-dim" />
    );

  const directionLabel =
    trends.direction === "easing"
      ? "Easing (Lower symptom burden)"
      : trends.direction === "elevating"
      ? "Elevating (Higher symptom burden)"
      : "Steady / Baseline Stable";

  return (
    <div className="flex flex-col gap-6 max-w-reading mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-1 text-center sm:text-left">
        <h1 className="text-xl sm:text-2xl font-bold text-calm-text">
          Recovery Insights & Trends
        </h1>
        <p className="text-xs text-calm-text-muted leading-relaxed">
          Transparent, non-diagnostic personal trend observations to share with your clinician.
        </p>
      </div>

      {/* Primary SVG Trend Chart */}
      <RecoveryChart data={trends.dailyPoints} sevenDayAverage={trends.sevenDayMovingAverage} />

      {/* Statistical Summary Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-3.5 bg-calm-bg-card border border-calm-border rounded-xl">
          <span className="text-[11px] text-calm-text-muted block">7-Day Moving Avg</span>
          <span className="text-lg font-bold text-calm-text">
            {trends.sevenDayMovingAverage} <span className="text-xs text-calm-text-dim font-normal">/ 15</span>
          </span>
        </div>

        <div className="p-3.5 bg-calm-bg-card border border-calm-border rounded-xl">
          <span className="text-[11px] text-calm-text-muted block">Trend Direction</span>
          <div className="flex items-center gap-1.5 mt-0.5">
            {directionIcon}
            <span className="text-xs font-semibold text-calm-text capitalize">
              {trends.direction}
            </span>
          </div>
        </div>

        <div className="p-3.5 bg-calm-bg-card border border-calm-border rounded-xl">
          <span className="text-[11px] text-calm-text-muted block">Symptom Slope</span>
          <span className="text-lg font-bold text-calm-text">
            {trends.slope > 0 ? `+${trends.slope}` : trends.slope}
          </span>
        </div>

        <div className="p-3.5 bg-calm-bg-card border border-calm-border rounded-xl">
          <span className="text-[11px] text-calm-text-muted block">Recorded Checks</span>
          <span className="text-lg font-bold text-calm-sage">
            {trends.totalEntries}
          </span>
        </div>
      </div>

      {/* Observation Card */}
      <div className="p-5 bg-calm-bg-card border border-calm-border rounded-xl flex flex-col gap-2.5">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-calm-sage" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-calm-text">
            Personal Observation
          </h2>
        </div>
        <p className="text-xs text-calm-text leading-relaxed">
          {trends.interpretation}
        </p>
        <p className="text-[11px] text-calm-text-muted leading-relaxed">
          Observations reflect patterns in your personal logs. They do not constitute a clinical assessment of neurological recovery speed or injury status.
        </p>
      </div>

      {/* Pacing Adherence Summary */}
      <div className="p-5 bg-calm-bg-card border border-calm-border rounded-xl flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-calm-sage" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-calm-text">
            Completed Pacing Sessions ({sessionsHistory.length})
          </h2>
        </div>
        {sessionsHistory.length === 0 ? (
          <p className="text-xs text-calm-text-muted italic">
            No completed pacing sessions recorded yet. Start a session from the Pacing tab to build structured habits.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {sessionsHistory.slice(0, 3).map((sess) => (
              <div
                key={sess.id}
                className="p-3 bg-calm-bg-surface border border-calm-border rounded-lg flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-medium text-calm-text">
                    {Math.round(sess.actualActivitySeconds / 60)}m Activity · {Math.round(sess.actualBreakSeconds / 60)}m Rest
                  </span>
                  <span className="text-[11px] text-calm-text-muted block">
                    Planned: {sess.plannedActivityMinutes}m / {sess.plannedBreakMinutes}m
                  </span>
                </div>
                <span className="text-[11px] text-calm-sage font-mono">
                  {new Date(sess.startTime).toLocaleDateString([], { month: "short", day: "numeric" })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
