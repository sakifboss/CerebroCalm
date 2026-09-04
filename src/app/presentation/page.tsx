"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SLIDES } from "./slidesData";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Printer,
  ArrowLeft,
  CheckCircle2,
  MessageSquare,
  Sparkles,
} from "lucide-react";

export default function PresentationPage() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSpeakerNotes, setShowSpeakerNotes] = useState(true);

  const currentSlide = SLIDES[currentSlideIndex];

  const handleNext = () => {
    if (currentSlideIndex < SLIDES.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "f" || e.key === "F") {
        toggleFullscreen();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handlePrintSlides = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-calm-bg text-calm-text p-4 sm:p-6 select-none">
      {/* Top Slide Presentation Control Bar */}
      <div className="print:hidden max-w-5xl mx-auto w-full mb-4 flex flex-wrap items-center justify-between gap-3 p-3 bg-calm-bg-card border border-calm-border rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-calm-bg-surface hover:bg-calm-bg-elevated border border-calm-border text-calm-text-dim hover:text-calm-text rounded-xl text-xs font-medium transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to App</span>
          </Link>

          <span className="text-xs font-bold text-calm-sage hidden sm:inline">
            Slide {currentSlide.id} of {SLIDES.length}
          </span>
        </div>

        {/* Slide Quick Select Dropdown */}
        <div className="flex items-center gap-2">
          <select
            value={currentSlideIndex}
            onChange={(e) => setCurrentSlideIndex(Number(e.target.value))}
            className="p-1.5 bg-calm-bg-surface border border-calm-border rounded-lg text-xs text-calm-text focus:border-calm-sage focus:outline-none"
          >
            {SLIDES.map((s, idx) => (
              <option key={s.id} value={idx}>
                {s.id}. {s.title}
              </option>
            ))}
          </select>

          {/* Toggle Speaker Notes */}
          <button
            onClick={() => setShowSpeakerNotes(!showSpeakerNotes)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              showSpeakerNotes
                ? "bg-calm-sage-surface border-calm-sage text-calm-sage"
                : "bg-calm-bg-surface border-calm-border text-calm-text-dim"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Notes</span>
          </button>

          {/* Print / Save PDF */}
          <button
            onClick={handlePrintSlides}
            className="px-3 py-1.5 bg-calm-bg-surface hover:bg-calm-bg-elevated border border-calm-border text-calm-text rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
            title="Print Slide Handouts"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print / PDF</span>
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 bg-calm-bg-surface hover:bg-calm-bg-elevated border border-calm-border text-calm-text rounded-lg transition-colors"
            title="Toggle Fullscreen (F)"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Slide Presentation Stage */}
      <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col justify-between p-6 sm:p-10 bg-calm-bg-card border-2 border-calm-border rounded-3xl shadow-xl relative overflow-hidden print:border-none print:shadow-none print:p-0">
        {/* Subtle Ambient Background */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-calm-sage/10 rounded-full blur-3xl pointer-events-none" />

        {/* Slide Header */}
        <div className="flex flex-col gap-2 relative z-10 border-b border-calm-border/80 pb-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-calm-sage flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>{currentSlide.category}</span>
            </span>
            <span className="text-xs font-mono text-calm-text-dim">
              {currentSlide.id.toString().padStart(2, "0")} / {SLIDES.length.toString().padStart(2, "0")}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-calm-text tracking-tight mt-1">
            {currentSlide.title}
          </h1>

          <p className="text-sm sm:text-base text-calm-text-muted font-normal">
            {currentSlide.subtitle}
          </p>
        </div>

        {/* Slide Body Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-6 relative z-10">
          {/* Main Bullet Points (2 Cols) */}
          <div className="lg:col-span-2 flex flex-col gap-3.5">
            {currentSlide.bulletPoints.map((pt, i) => (
              <div
                key={i}
                className="p-3.5 sm:p-4 bg-calm-bg-surface/80 border border-calm-border rounded-2xl flex items-start gap-3 shadow-xs"
              >
                <div className="p-1 rounded-md bg-calm-sage-surface border border-calm-sage/30 text-calm-sage mt-0.5 shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <p className="text-xs sm:text-sm text-calm-text leading-relaxed font-medium">
                  {pt}
                </p>
              </div>
            ))}
          </div>

          {/* Key Metrics / Clinical Insights (1 Col) */}
          <div className="flex flex-col gap-3">
            <div className="p-4 bg-calm-bg-surface border border-calm-border rounded-2xl flex flex-col gap-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-calm-text-muted">
                Key Technical & Clinical Specs
              </span>
              <div className="flex flex-col gap-2">
                {currentSlide.keyHighlights.map((kh, i) => (
                  <div
                    key={i}
                    className="p-2.5 bg-calm-bg-card rounded-xl border border-calm-border/60 flex flex-col"
                  >
                    <span className="text-[10px] text-calm-text-dim uppercase tracking-wider">
                      {kh.label}
                    </span>
                    <span className="text-xs font-bold text-calm-sage mt-0.5">
                      {kh.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Clinical Rationale Box */}
            <div className="p-4 bg-calm-sage-surface/40 border border-calm-sage/30 rounded-2xl flex flex-col gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-calm-sage">
                Clinical Rationale
              </span>
              <p className="text-[11px] text-calm-text-dim leading-relaxed">
                {currentSlide.clinicalRationale}
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Speaker Notes for Student (Bengali & English) */}
        {showSpeakerNotes && (
          <div className="print:hidden p-4 bg-calm-bg-surface border border-calm-sage/40 rounded-2xl flex flex-col gap-2 my-2 relative z-10">
            <div className="flex items-center justify-between text-xs font-bold text-calm-sage">
              <span className="flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Sir এর সামনে যা বলবেন (Speaker Talking Points)</span>
              </span>
              <span className="text-[10px] text-calm-text-dim font-normal">Bengali & English Guide</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 bg-calm-bg-card rounded-xl border border-calm-border">
                <span className="text-[10px] font-bold text-calm-text-muted uppercase block mb-1">
                  বাংলা উপস্থাপনা:
                </span>
                <p className="text-calm-text leading-relaxed">
                  "{currentSlide.speakerNoteBengali}"
                </p>
              </div>
              <div className="p-2.5 bg-calm-bg-card rounded-xl border border-calm-border">
                <span className="text-[10px] font-bold text-calm-text-muted uppercase block mb-1">
                  English Speaking Point:
                </span>
                <p className="text-calm-text leading-relaxed">
                  "{currentSlide.speakerNoteEnglish}"
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Slide Footer with Navigation Buttons */}
        <div className="print:hidden flex items-center justify-between pt-4 border-t border-calm-border/80 mt-4 relative z-10">
          <button
            onClick={handlePrev}
            disabled={currentSlideIndex === 0}
            className="flex items-center gap-2 px-4 py-2.5 bg-calm-bg-surface hover:bg-calm-bg-elevated border border-calm-border text-calm-text rounded-xl text-xs font-semibold disabled:opacity-40 disabled:pointer-events-none transition-all min-h-touch cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Slide</span>
          </button>

          {/* Progress Indicators */}
          <div className="flex items-center gap-1.5">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlideIndex(i)}
                className={`h-2 rounded-full transition-all ${
                  i === currentSlideIndex
                    ? "w-6 bg-calm-sage"
                    : "w-2 bg-calm-border hover:bg-calm-text-dim"
                }`}
                aria-label={`Jump to slide ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={currentSlideIndex === SLIDES.length - 1}
            className="flex items-center gap-2 px-5 py-2.5 bg-calm-sage text-calm-bg-deep font-bold rounded-xl text-xs disabled:opacity-40 disabled:pointer-events-none hover:opacity-95 transition-all min-h-touch cursor-pointer shadow-sm"
          >
            <span>Next Slide</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
