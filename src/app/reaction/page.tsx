"use client";

import React, { useState, useRef } from "react";
import { Timer, ArrowLeft, RefreshCw, Check, Activity, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";

export default function ReactionCheckPage() {
  const [gameState, setGameState] = useState<"idle" | "waiting" | "ready" | "early" | "completed">("idle");
  const [trials, setTrials] = useState<number[]>([]);
  const [currentTrialNumber, setCurrentTrialNumber] = useState(1);
  const [startTime, setStartTime] = useState<number>(0);
  const timerTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startNextTrial = () => {
    setGameState("waiting");

    // Random delay between 2200ms and 4800ms to avoid anticipation
    const delay = 2200 + Math.random() * 2600;

    if (timerTimeoutRef.current) clearTimeout(timerTimeoutRef.current);

    timerTimeoutRef.current = setTimeout(() => {
      setStartTime(Date.now());
      setGameState("ready");
    }, delay);
  };

  const handleUserTap = () => {
    if (gameState === "idle") {
      setTrials([]);
      setCurrentTrialNumber(1);
      startNextTrial();
    } else if (gameState === "waiting") {
      // Tapped too early
      if (timerTimeoutRef.current) clearTimeout(timerTimeoutRef.current);
      setGameState("early");
    } else if (gameState === "ready") {
      const elapsed = Date.now() - startTime;
      const updatedTrials = [...trials, elapsed];
      setTrials(updatedTrials);

      if (updatedTrials.length >= 3) {
        setGameState("completed");
      } else {
        setCurrentTrialNumber(updatedTrials.length + 1);
        startNextTrial();
      }
    } else if (gameState === "early") {
      startNextTrial();
    }
  };

  const handleReset = () => {
    if (timerTimeoutRef.current) clearTimeout(timerTimeoutRef.current);
    setGameState("idle");
    setTrials([]);
    setCurrentTrialNumber(1);
  };

  // Calculations
  const averageMs =
    trials.length > 0
      ? Math.round(trials.reduce((sum, t) => sum + t, 0) / trials.length)
      : 0;

  const variance =
    trials.length > 1
      ? trials.reduce((sum, t) => sum + Math.pow(t - averageMs, 2), 0) / trials.length
      : 0;
  const variabilityMs = Math.round(Math.sqrt(variance));

  const consistencyRating =
    variabilityMs < 50
      ? "Consistent & Steady"
      : variabilityMs < 110
      ? "Mild Variability"
      : "Elevated Variability (Mental Fatigue)";

  return (
    <div className="flex flex-col gap-6 max-w-reading mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs text-calm-text-dim hover:text-calm-text py-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
        <span className="text-xs text-calm-text-muted">15-Second Neuro Micro-Check</span>
      </div>

      <div className="flex flex-col gap-1 text-center sm:text-left">
        <h1 className="text-xl sm:text-2xl font-bold text-calm-text">
          Low-Stimulus Reaction Stability
        </h1>
        <p className="text-xs text-calm-text-muted leading-relaxed">
          Measures reaction consistency across 3 gentle trials to evaluate cognitive fatigue without sensory glare.
        </p>
      </div>

      {/* Main Interactive Target Card */}
      <div
        onClick={handleUserTap}
        role="button"
        tabIndex={0}
        aria-label="Reaction test area. Tap to interact."
        className={`w-full min-h-[320px] rounded-2xl border-2 flex flex-col items-center justify-center p-6 text-center select-none cursor-pointer transition-all ${
          gameState === "idle"
            ? "bg-calm-bg-card border-calm-border hover:border-calm-sage/50"
            : gameState === "waiting"
            ? "bg-calm-bg-surface border-calm-border"
            : gameState === "ready"
            ? "bg-calm-sage-surface border-calm-sage ring-4 ring-calm-sage/30 shadow-xl"
            : gameState === "early"
            ? "bg-calm-amber-surface border-calm-amber"
            : "bg-calm-bg-card border-calm-sage/40"
        }`}
      >
        {gameState === "idle" && (
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-calm-bg-surface border border-calm-sage/40 flex items-center justify-center text-calm-sage">
              <Timer className="w-8 h-8" />
            </div>
            <span className="text-base font-bold text-calm-text">
              Tap Anywhere to Start Check (3 Trials)
            </span>
            <span className="text-xs text-calm-text-muted max-w-xs">
              When the circle appears in warm sage, tap as promptly as comfortable.
            </span>
          </div>
        )}

        {gameState === "waiting" && (
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-calm-text-muted">
              Trial {currentTrialNumber} of 3
            </span>
            <span className="text-lg font-light text-calm-text-dim animate-pulse">
              Wait quietly for the sage circle...
            </span>
            <span className="text-[11px] text-calm-text-muted">Relax your eyes</span>
          </div>
        )}

        {gameState === "ready" && (
          <div className="flex flex-col items-center gap-2">
            <div className="w-24 h-24 rounded-full bg-calm-sage flex items-center justify-center text-calm-bg-deep font-bold text-lg shadow-lg">
              TAP NOW
            </div>
            <span className="text-xs font-semibold text-calm-sage mt-2">
              Tap anywhere!
            </span>
          </div>
        )}

        {gameState === "early" && (
          <div className="flex flex-col items-center gap-2">
            <span className="text-base font-bold text-calm-amber">
              Tapped slightly too early!
            </span>
            <span className="text-xs text-calm-text-muted">
              Tap again to restart Trial {currentTrialNumber}.
            </span>
          </div>
        )}

        {gameState === "completed" && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-calm-sage-surface border border-calm-sage text-calm-sage flex items-center justify-center">
              <Check className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-calm-text-muted">
                Assessment Finished
              </span>
              <div className="text-3xl font-extralight font-mono text-calm-text mt-1">
                {averageMs} ms <span className="text-xs text-calm-text-dim">average</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-calm-text-muted">
              <span>Trial 1: {trials[0]}ms</span>
              <span>Trial 2: {trials[1]}ms</span>
              <span>Trial 3: {trials[2]}ms</span>
            </div>

            <div className="px-3 py-1.5 rounded-full bg-calm-bg-surface border border-calm-border text-xs text-calm-sage font-medium">
              Consistency: {consistencyRating} (±{variabilityMs}ms)
            </div>
          </div>
        )}
      </div>

      {/* Control bar */}
      <div className="flex items-center justify-between">
        {gameState !== "idle" ? (
          <button
            onClick={handleReset}
            className="flex items-center gap-2 text-xs text-calm-text-dim hover:text-calm-text py-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Test</span>
          </button>
        ) : (
          <div></div>
        )}

        <div className="flex items-center gap-1 text-[11px] text-calm-text-muted">
          <ShieldCheck className="w-3.5 h-3.5 text-calm-sage" />
          <span>Non-diagnostic focus metric</span>
        </div>
      </div>
    </div>
  );
}
