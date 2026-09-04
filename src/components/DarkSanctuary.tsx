"use client";

import React, { useState, useEffect } from "react";
import { usePacingStore } from "@/store/pacingStore";
import { useSettingsStore } from "@/store/settingsStore";
import { BREATHING_BOX_STEPS } from "@/lib/constants";
import { startBrownNoise, stopBrownNoise, playCalmChime } from "@/lib/audioGenerator";
import { X, Volume2, VolumeX, Pause, Play, Moon, Shield, Waves } from "lucide-react";

export const DarkSanctuary: React.FC = () => {
  const {
    isSanctuaryActive,
    closeSanctuary,
    secondsRemaining,
    totalSeconds,
    status,
    tick,
    pauseTimer,
    resumeTimer,
  } = usePacingStore();

  const { pacing, accessibility } = useSettingsStore();

  const [breathSecond, setBreathSecond] = useState(0);
  const [noiseActive, setNoiseActive] = useState(pacing.soundEnabled);

  // Manage Web Audio Brown Noise soundscape
  useEffect(() => {
    if (!isSanctuaryActive) {
      stopBrownNoise();
      return;
    }

    if (noiseActive) {
      startBrownNoise(0.12);
    } else {
      stopBrownNoise();
    }

    return () => {
      stopBrownNoise();
    };
  }, [isSanctuaryActive, noiseActive]);

  // Tick the pacing timer if active in sanctuary
  useEffect(() => {
    if (!isSanctuaryActive) return;

    const timer = setInterval(() => {
      tick();
      setBreathSecond((prev) => (prev + 1) % 16);
    }, 1000);

    return () => clearInterval(timer);
  }, [isSanctuaryActive, tick]);

  if (!isSanctuaryActive) return null;

  // Determine current breathing phase
  const phaseIndex = Math.floor(breathSecond / 4);
  const currentStep = BREATHING_BOX_STEPS[phaseIndex] || BREATHING_BOX_STEPS[0];
  const phaseSecond = (breathSecond % 4) + 1;

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;

  const handleToggleNoise = () => {
    if (noiseActive) {
      stopBrownNoise();
      setNoiseActive(false);
    } else {
      startBrownNoise(0.12);
      setNoiseActive(true);
    }
  };

  const handleExit = () => {
    stopBrownNoise();
    playCalmChime();
    closeSanctuary();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Dark Sanctuary Recovery Mode"
      className="fixed inset-0 z-50 bg-[#12100E] text-calm-text-dim flex flex-col justify-between p-6 select-none"
    >
      {/* Top Controls: Minimal & Low Glow */}
      <div className="flex items-center justify-between max-w-xl mx-auto w-full">
        <div className="flex items-center gap-2 text-xs text-calm-text-muted opacity-70">
          <Moon className="w-4 h-4 text-calm-sage" />
          <span>Dark Sanctuary — Sensory Rest</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleNoise}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs min-h-touch border transition-colors ${
              noiseActive
                ? "bg-calm-sage-surface border-calm-sage/40 text-calm-sage"
                : "bg-calm-bg-surface/50 border-calm-border/40 text-calm-text-muted hover:text-calm-text"
            }`}
            aria-label={noiseActive ? "Mute Brown Noise" : "Enable Brown Noise"}
          >
            <Waves className="w-3.5 h-3.5" />
            <span>{noiseActive ? "Brown Noise ON" : "Noise Muted"}</span>
          </button>

          <button
            onClick={handleExit}
            className="p-2.5 rounded-lg text-calm-text-muted hover:text-calm-text bg-calm-bg-surface/50 border border-calm-border/40 min-h-touch min-w-touch flex items-center justify-center"
            aria-label="Exit Dark Sanctuary"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Breathing Centerpiece */}
      <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto my-auto gap-8">
        {/* Breathing Guide Circle */}
        <div
          className={`w-52 h-52 sm:w-60 sm:h-60 rounded-full border border-calm-border/60 flex flex-col items-center justify-center relative bg-calm-bg-deep/40 transition-all duration-1000 ${
            accessibility.reducedMotion
              ? ""
              : phaseIndex === 0
              ? "scale-105 border-calm-sage/40 bg-calm-sage-surface/20"
              : phaseIndex === 2
              ? "scale-95 border-calm-border"
              : "scale-100"
          }`}
        >
          <span className="text-xs uppercase tracking-widest text-calm-text-muted opacity-70 mb-1 font-mono">
            {currentStep.phase} ({phaseSecond}/4s)
          </span>
          <span className="text-xl sm:text-2xl font-light text-calm-text tracking-wide px-4">
            {currentStep.prompt}
          </span>
        </div>

        {/* Break Countdown Timer */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs text-calm-text-muted font-mono tracking-wider opacity-60 uppercase">
            Recovery Rest Countdown
          </span>
          <div className="text-4xl sm:text-5xl font-extralight tracking-widest font-mono text-calm-text">
            {formattedTime}
          </div>
        </div>

        {/* Play/Pause Minimal Button */}
        <div className="flex items-center gap-4">
          {status === "active" || status === "break" ? (
            <button
              onClick={pauseTimer}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-calm-bg-surface/60 border border-calm-border/50 text-xs text-calm-text-muted hover:text-calm-text min-h-touch"
            >
              <Pause className="w-3.5 h-3.5" />
              <span>Pause Break</span>
            </button>
          ) : (
            <button
              onClick={resumeTimer}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-calm-bg-surface/60 border border-calm-border/50 text-xs text-calm-text-muted hover:text-calm-text min-h-touch"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Resume</span>
            </button>
          )}
        </div>
      </div>

      {/* Subtle Bottom Guidance */}
      <div className="max-w-md mx-auto text-center flex flex-col items-center gap-1 opacity-60">
        <div className="flex items-center gap-1 text-[11px] text-calm-text-dim">
          <Shield className="w-3 h-3 text-calm-sage" />
          <span>Rest your eyes away from the screen · Brownian low-frequency soundscape active</span>
        </div>
      </div>
    </div>
  );
};
