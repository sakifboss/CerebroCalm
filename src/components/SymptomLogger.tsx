"use client";

import React, { useState } from "react";
import { SymptomScale, MoodType } from "@/types/symptom";
import { useSymptomStore } from "@/store/symptomStore";
import { VoiceInput } from "./VoiceInput";
import { Check, Activity, Sparkles, Smile, ShieldAlert } from "lucide-react";

interface SymptomLoggerProps {
  onSuccess?: () => void;
}

export const SymptomLogger: React.FC<SymptomLoggerProps> = ({ onSuccess }) => {
  const { addEntry } = useSymptomStore();

  const [headache, setHeadache] = useState<SymptomScale>(2);
  const [sensorySensitivity, setSensorySensitivity] = useState<SymptomScale>(2);
  const [cognitiveFatigue, setCognitiveFatigue] = useState<SymptomScale>(2);
  const [mood, setMood] = useState<MoodType>("okay");
  const [note, setNote] = useState<string>("");
  const [source, setSource] = useState<"manual" | "voice">("manual");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const scales: SymptomScale[] = [1, 2, 3, 4, 5];
  const scaleLabels = ["Minimal", "Mild", "Moderate", "Elevated", "Severe"];

  const moodOptions: { id: MoodType; label: string }[] = [
    { id: "calm", label: "Calm / Grounded" },
    { id: "okay", label: "Managing Okay" },
    { id: "frustrated", label: "Frustrated" },
    { id: "overwhelmed", label: "Overwhelmed" },
    { id: "anxious", label: "Anxious" },
    { id: "exhausted", label: "Exhausted" },
  ];

  const handleVoiceDataApplied = (data: {
    headache?: SymptomScale;
    sensorySensitivity?: SymptomScale;
    cognitiveFatigue?: SymptomScale;
    mood?: MoodType;
    note?: string;
  }) => {
    if (data.headache) setHeadache(data.headache);
    if (data.sensorySensitivity) setSensorySensitivity(data.sensorySensitivity);
    if (data.cognitiveFatigue) setCognitiveFatigue(data.cognitiveFatigue);
    if (data.mood) setMood(data.mood);
    if (data.note) setNote(data.note);
    setSource("voice");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addEntry({
        headache,
        sensorySensitivity,
        cognitiveFatigue,
        mood,
        note: note.trim() || undefined,
        source,
      });

      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        if (onSuccess) onSuccess();
      }, 1200);
    } catch (err) {
      console.error("Failed to save symptom log", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-6 max-w-reading mx-auto">
      {/* Voice Assistant Option */}
      <VoiceInput onApplyParsedData={handleVoiceDataApplied} />

      {/* Question 1: Headache */}
      <div className="flex flex-col gap-2.5 p-5 bg-calm-bg-card border border-calm-border rounded-xl">
        <div className="flex items-center justify-between">
          <label className="text-base font-semibold text-calm-text">
            1. How is your head right now?
          </label>
          <span className="text-xs text-calm-text-muted">
            {scaleLabels[headache - 1]} ({headache}/5)
          </span>
        </div>
        <p className="text-xs text-calm-text-muted">1 is none or barely noticeable; 5 is severe throbbing pain.</p>
        <div className="grid grid-cols-5 gap-2 pt-1" role="radiogroup" aria-label="Headache intensity">
          {scales.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setHeadache(s);
                setSource("manual");
              }}
              role="radio"
              aria-checked={headache === s}
              className={`py-3 rounded-xl font-bold text-base transition-all min-h-touch flex flex-col items-center justify-center border ${
                headache === s
                  ? "bg-calm-bg-elevated border-calm-sage text-calm-sage ring-2 ring-calm-sage/30 shadow-md"
                  : "bg-calm-bg-surface border-calm-border text-calm-text-dim hover:text-calm-text hover:border-calm-border-focus"
              }`}
            >
              <span>{s}</span>
              <span className="text-[10px] font-normal opacity-70 hidden sm:inline">
                {scaleLabels[s - 1]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Question 2: Sensory Sensitivity */}
      <div className="flex flex-col gap-2.5 p-5 bg-calm-bg-card border border-calm-border rounded-xl">
        <div className="flex items-center justify-between">
          <label className="text-base font-semibold text-calm-text">
            2. How sensitive are you to light or sound?
          </label>
          <span className="text-xs text-calm-text-muted">
            {scaleLabels[sensorySensitivity - 1]} ({sensorySensitivity}/5)
          </span>
        </div>
        <p className="text-xs text-calm-text-muted">Glare intolerance, screen harshness, or noise distress.</p>
        <div className="grid grid-cols-5 gap-2 pt-1" role="radiogroup" aria-label="Sensory sensitivity">
          {scales.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setSensorySensitivity(s);
                setSource("manual");
              }}
              role="radio"
              aria-checked={sensorySensitivity === s}
              className={`py-3 rounded-xl font-bold text-base transition-all min-h-touch flex flex-col items-center justify-center border ${
                sensorySensitivity === s
                  ? "bg-calm-bg-elevated border-calm-sage text-calm-sage ring-2 ring-calm-sage/30 shadow-md"
                  : "bg-calm-bg-surface border-calm-border text-calm-text-dim hover:text-calm-text hover:border-calm-border-focus"
              }`}
            >
              <span>{s}</span>
              <span className="text-[10px] font-normal opacity-70 hidden sm:inline">
                {scaleLabels[s - 1]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Question 3: Cognitive Fatigue / Brain Fog */}
      <div className="flex flex-col gap-2.5 p-5 bg-calm-bg-card border border-calm-border rounded-xl">
        <div className="flex items-center justify-between">
          <label className="text-base font-semibold text-calm-text">
            3. How foggy does your mind feel?
          </label>
          <span className="text-xs text-calm-text-muted">
            {scaleLabels[cognitiveFatigue - 1]} ({cognitiveFatigue}/5)
          </span>
        </div>
        <p className="text-xs text-calm-text-muted">Difficulty focusing, slowed thinking, or mental heaviness.</p>
        <div className="grid grid-cols-5 gap-2 pt-1" role="radiogroup" aria-label="Cognitive fatigue">
          {scales.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setCognitiveFatigue(s);
                setSource("manual");
              }}
              role="radio"
              aria-checked={cognitiveFatigue === s}
              className={`py-3 rounded-xl font-bold text-base transition-all min-h-touch flex flex-col items-center justify-center border ${
                cognitiveFatigue === s
                  ? "bg-calm-bg-elevated border-calm-sage text-calm-sage ring-2 ring-calm-sage/30 shadow-md"
                  : "bg-calm-bg-surface border-calm-border text-calm-text-dim hover:text-calm-text hover:border-calm-border-focus"
              }`}
            >
              <span>{s}</span>
              <span className="text-[10px] font-normal opacity-70 hidden sm:inline">
                {scaleLabels[s - 1]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Question 4: Accessible Mood Selection */}
      <div className="flex flex-col gap-2.5 p-5 bg-calm-bg-card border border-calm-border rounded-xl">
        <div className="flex items-center justify-between">
          <label className="text-base font-semibold text-calm-text">
            4. Emotional / mental state
          </label>
          <span className="text-xs text-calm-text-muted capitalize">{mood}</span>
        </div>
        <p className="text-xs text-calm-text-muted">Accessible text labels; no emoji reliance.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1" role="radiogroup" aria-label="Mood selection">
          {moodOptions.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                setMood(m.id);
                setSource("manual");
              }}
              role="radio"
              aria-checked={mood === m.id}
              className={`px-3 py-3 rounded-xl text-xs font-semibold transition-all min-h-touch border text-left ${
                mood === m.id
                  ? "bg-calm-bg-elevated border-calm-sage text-calm-text ring-2 ring-calm-sage/30 shadow-md"
                  : "bg-calm-bg-surface border-calm-border text-calm-text-dim hover:text-calm-text hover:border-calm-border-focus"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Optional Note */}
      <div className="flex flex-col gap-2 p-4 bg-calm-bg-card border border-calm-border rounded-xl">
        <label htmlFor="symptom-note" className="text-sm font-medium text-calm-text">
          Optional context or triggers
        </label>
        <textarea
          id="symptom-note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="e.g. Read for 15 mins under fluorescent office lighting..."
          rows={2}
          maxLength={280}
          className="w-full bg-calm-bg-surface border border-calm-border rounded-lg p-3 text-sm text-calm-text placeholder:text-calm-text-dim/50 focus:outline-none focus:border-calm-sage focus:ring-1 focus:ring-calm-sage"
        />
        <div className="flex justify-between items-center text-xs text-calm-text-muted">
          <span>Encrypted with AES-GCM on-device before saving</span>
          <span>{note.length}/280</span>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting || savedSuccess}
        className={`w-full py-4 px-6 rounded-2xl font-bold text-base transition-all min-h-touch flex items-center justify-center gap-2 shadow-lg ${
          savedSuccess
            ? "bg-calm-sage text-calm-bg-deep border border-calm-sage"
            : "bg-calm-sage text-calm-bg-deep hover:opacity-95 active:scale-[0.99]"
        }`}
      >
        {savedSuccess ? (
          <>
            <Check className="w-5 h-5" />
            <span>Check Logged Safely</span>
          </>
        ) : (
          <>
            <Activity className="w-5 h-5" />
            <span>{isSubmitting ? "Encrypting & Storing..." : "Save Recovery Check (5 Sec)"}</span>
          </>
        )}
      </button>
    </form>
  );
};
