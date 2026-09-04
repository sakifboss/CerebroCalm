"use client";

import React, { useState } from "react";
import { Mic, MicOff, Check, X, AlertTriangle } from "lucide-react";
import {
  isSpeechRecognitionSupported,
  createSpeechRecognizer,
  ParsedVoiceSymptom,
} from "@/lib/voice";
import { SymptomScale, MoodType } from "@/types/symptom";

interface VoiceInputProps {
  onApplyParsedData: (data: {
    headache?: SymptomScale;
    sensorySensitivity?: SymptomScale;
    cognitiveFatigue?: SymptomScale;
    mood?: MoodType;
    note?: string;
  }) => void;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({ onApplyParsedData }) => {
  const [isListening, setIsListening] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [parsedResult, setParsedResult] = useState<ParsedVoiceSymptom | null>(null);
  const [recognizer, setRecognizer] = useState<{ start: () => void; stop: () => void } | null>(null);

  const isSupported = isSpeechRecognitionSupported();

  const handleStartListening = () => {
    setErrorMessage(null);
    setParsedResult(null);

    const rec = createSpeechRecognizer(
      (parsed) => {
        setParsedResult(parsed);
        setIsListening(false);
      },
      (err) => {
        setErrorMessage(err);
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      }
    );

    if (rec) {
      setRecognizer(rec);
      setIsListening(true);
      rec.start();
    }
  };

  const handleStopListening = () => {
    if (recognizer) {
      recognizer.stop();
    }
    setIsListening(false);
  };

  const handleConfirmApplication = () => {
    if (!parsedResult) return;
    onApplyParsedData({
      headache: parsedResult.headache,
      sensorySensitivity: parsedResult.sensorySensitivity,
      cognitiveFatigue: parsedResult.cognitiveFatigue,
      mood: parsedResult.mood,
      note: parsedResult.rawTranscript,
    });
    setParsedResult(null);
  };

  const handleDiscard = () => {
    setParsedResult(null);
  };

  return (
    <div className="flex flex-col gap-3 p-4 bg-calm-bg-surface border border-calm-border rounded-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Mic className={`w-4 h-4 ${isListening ? "text-calm-emergency animate-pulse" : "text-calm-sage"}`} />
          <span className="text-sm font-semibold text-calm-text">Voice Input (Short Spoken Check)</span>
        </div>
        <span className="text-xs text-calm-text-muted">On-device parsing</span>
      </div>

      <p className="text-xs text-calm-text-muted leading-relaxed">
        Speak clearly, for example: <em className="text-calm-text-dim">"Headache is 2, lights bother me 3, feeling calm"</em>. No audio is ever recorded or uploaded.
      </p>

      {!isSupported ? (
        <div className="p-3 bg-calm-bg-card border border-calm-border rounded-lg text-xs text-calm-text-muted flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-calm-amber flex-shrink-0" />
          <span>Speech recognition is not supported in this browser. Please use the tactile 1–5 scale buttons below.</span>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          {!isListening ? (
            <button
              type="button"
              onClick={handleStartListening}
              className="flex items-center gap-2 px-4 py-2.5 bg-calm-bg-card hover:bg-calm-bg-elevated border border-calm-sage text-calm-text rounded-xl text-sm font-medium transition-colors min-h-touch"
            >
              <Mic className="w-4 h-4 text-calm-sage" />
              <span>Tap to Speak</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleStopListening}
              className="flex items-center gap-2 px-4 py-2.5 bg-calm-emergency-surface border border-calm-emergency text-calm-text rounded-xl text-sm font-medium transition-colors min-h-touch"
            >
              <MicOff className="w-4 h-4 text-calm-emergency" />
              <span>Stop Listening...</span>
            </button>
          )}

          {isListening && (
            <span className="text-xs text-calm-text-muted italic">Listening... (Speak for 3-5 seconds)</span>
          )}
        </div>
      )}

      {errorMessage && (
        <div className="text-xs text-calm-emergency p-2.5 bg-calm-emergency-surface border border-calm-emergency/40 rounded-lg">
          {errorMessage}
        </div>
      )}

      {/* Confirmation Dialog for Parsed Voice Data */}
      {parsedResult && (
        <div className="mt-2 p-4 bg-calm-bg-elevated border border-calm-border-focus rounded-xl flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-calm-text uppercase tracking-wider">
              {parsedResult.isAmbiguous ? "Please Confirm Spoken Entry" : "Detected Values"}
            </span>
            <span className="text-xs text-calm-text-muted">
              Confidence: {Math.round(parsedResult.confidence * 100)}%
            </span>
          </div>

          <div className="p-2.5 bg-calm-bg-card border border-calm-border rounded-lg text-xs text-calm-text-dim italic">
            "{parsedResult.rawTranscript}"
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2 bg-calm-bg-surface border border-calm-border rounded-md">
              <span className="text-calm-text-muted block">Headache:</span>
              <span className="font-bold text-calm-text">
                {parsedResult.headache ? `${parsedResult.headache} / 5` : "Not detected"}
              </span>
            </div>
            <div className="p-2 bg-calm-bg-surface border border-calm-border rounded-md">
              <span className="text-calm-text-muted block">Sensory:</span>
              <span className="font-bold text-calm-text">
                {parsedResult.sensorySensitivity ? `${parsedResult.sensorySensitivity} / 5` : "Not detected"}
              </span>
            </div>
            <div className="p-2 bg-calm-bg-surface border border-calm-border rounded-md">
              <span className="text-calm-text-muted block">Brain Fog:</span>
              <span className="font-bold text-calm-text">
                {parsedResult.cognitiveFatigue ? `${parsedResult.cognitiveFatigue} / 5` : "Not detected"}
              </span>
            </div>
            <div className="p-2 bg-calm-bg-surface border border-calm-border rounded-md">
              <span className="text-calm-text-muted block">Mood:</span>
              <span className="font-bold text-calm-text capitalize">
                {parsedResult.mood || "Not specified"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleConfirmApplication}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-calm-sage text-calm-bg-deep font-semibold rounded-lg text-xs min-h-touch"
            >
              <Check className="w-4 h-4" />
              Apply These Ratings
            </button>
            <button
              type="button"
              onClick={handleDiscard}
              className="px-3 py-2 bg-calm-bg-surface border border-calm-border text-calm-text-muted hover:text-calm-text rounded-lg text-xs min-h-touch"
            >
              <X className="w-4 h-4" />
              Discard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
