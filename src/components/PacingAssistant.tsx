"use client";

import React, { useEffect } from "react";
import { usePacingStore } from "@/store/pacingStore";
import { useSettingsStore } from "@/store/settingsStore";
import { PACING_CLINICAL_NOTE } from "@/lib/constants";
import { Play, Pause, Square, Moon, Clock, Settings2 } from "lucide-react";
import Link from "next/link";

export const PacingAssistant: React.FC = () => {
  const {
    status,
    secondsRemaining,
    totalSeconds,
    startActivity,
    pauseTimer,
    resumeTimer,
    endSession,
    openSanctuary,
    tick,
  } = usePacingStore();

  const { pacing } = useSettingsStore();

  // Tick the timer every second if active
  useEffect(() => {
    if (status !== "active" && status !== "break") return;

    const interval = setInterval(() => {
      tick();
    }, 1000);

    return () => clearInterval(interval);
  }, [status, tick]);

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedRemaining = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;

  const progressPercent =
    totalSeconds > 0
      ? Math.min(100, Math.round(((totalSeconds - secondsRemaining) / totalSeconds) * 100))
      : 0;

  return (
    <div className="flex flex-col gap-5 p-6 bg-calm-bg-card border border-calm-border rounded-2xl max-w-reading mx-auto">
      {/* Clinician guidance notice */}
      <div className="p-3 bg-calm-bg-surface border border-calm-border rounded-xl text-xs text-calm-text-muted flex items-start gap-2.5">
        <Clock className="w-4 h-4 text-calm-sage flex-shrink-0 mt-0.5" />
        <span className="leading-relaxed">{PACING_CLINICAL_NOTE}</span>
      </div>

      {/* Main Timer Display */}
      <div className="flex flex-col items-center justify-center p-6 bg-calm-bg-surface border border-calm-border rounded-2xl text-center gap-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-calm-text-muted">
          {status === "active"
            ? "Paced Activity Block"
            : status === "break"
            ? "Rest & Recovery Interval"
            : status === "paused"
            ? "Activity Paused"
            : "Ready for Paced Session"}
        </span>

        <div className="text-5xl sm:text-6xl font-extralight tracking-wider font-mono text-calm-text my-1">
          {status === "idle"
            ? `${pacing.activityMinutes.toString().padStart(2, "0")}:00`
            : formattedRemaining}
        </div>

        {/* Linear progress bar */}
        <div className="w-full max-w-xs h-2 bg-calm-bg-deep rounded-full overflow-hidden mt-1 border border-calm-border">
          <div
            className="h-full bg-calm-sage transition-all duration-300"
            style={{ width: `${status === "idle" ? 0 : progressPercent}%` }}
          />
        </div>

        <span className="text-xs text-calm-text-muted">
          Planned: {pacing.activityMinutes} min activity · {pacing.breakMinutes} min break
        </span>
      </div>

      {/* Primary Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {status === "idle" ? (
          <button
            onClick={() => startActivity(pacing.activityMinutes)}
            className="flex items-center justify-center gap-2 py-4 px-6 bg-calm-sage text-calm-bg-deep font-bold rounded-xl text-base shadow-md hover:opacity-95 active:scale-[0.99] min-h-touch"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Start Activity Session</span>
          </button>
        ) : status === "active" ? (
          <button
            onClick={pauseTimer}
            className="flex items-center justify-center gap-2 py-4 px-6 bg-calm-bg-elevated border border-calm-border-focus text-calm-text font-bold rounded-xl text-base shadow-md hover:border-calm-sage min-h-touch"
          >
            <Pause className="w-5 h-5" />
            <span>Pause Timer</span>
          </button>
        ) : (
          <button
            onClick={resumeTimer}
            className="flex items-center justify-center gap-2 py-4 px-6 bg-calm-sage text-calm-bg-deep font-bold rounded-xl text-base shadow-md hover:opacity-95 active:scale-[0.99] min-h-touch"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Resume Activity</span>
          </button>
        )}

        <button
          onClick={openSanctuary}
          className="flex items-center justify-center gap-2 py-4 px-6 bg-calm-bg-surface border border-calm-border text-calm-text-muted hover:text-calm-text font-semibold rounded-xl text-base hover:border-calm-border-focus min-h-touch"
        >
          <Moon className="w-5 h-5 text-calm-sage" />
          <span>Enter Dark Sanctuary</span>
        </button>
      </div>

      {/* Secondary Controls (Stop Session, Adjust Settings) */}
      <div className="flex items-center justify-between pt-2 border-t border-calm-border text-xs text-calm-text-muted">
        {status !== "idle" ? (
          <button
            onClick={endSession}
            className="flex items-center gap-1.5 text-calm-text-dim hover:text-calm-emergency py-2 min-h-touch"
          >
            <Square className="w-3.5 h-3.5" />
            <span>End Current Session</span>
          </button>
        ) : (
          <span className="text-calm-text-dim">Stop activity before fatigue builds</span>
        )}

        <Link
          href="/settings"
          className="flex items-center gap-1.5 text-calm-text-dim hover:text-calm-text py-2 min-h-touch"
        >
          <Settings2 className="w-3.5 h-3.5" />
          <span>Adjust Session Length</span>
        </Link>
      </div>
    </div>
  );
};
