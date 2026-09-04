"use client";

import React, { useEffect } from "react";
import { useSettingsStore } from "@/store/settingsStore";
import { ThemeMode } from "@/types/user";
import { Moon, Eye, SunDim, ZapOff, Globe } from "lucide-react";

export const ThemeToggle: React.FC = () => {
  const { accessibility, setTheme, setReducedMotion, setLanguage } = useSettingsStore();

  useEffect(() => {
    // Initial sync with DOM to prevent flicker
    const root = document.documentElement;
    root.classList.remove("theme-photophobia", "theme-low-light", "theme-high-contrast");
    root.classList.add(`theme-${accessibility.theme}`);

    if (accessibility.reducedMotion) {
      root.classList.add("reduce-motion");
    } else {
      root.classList.remove("reduce-motion");
    }
  }, [accessibility.theme, accessibility.reducedMotion]);

  const themes: { id: ThemeMode; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      id: "photophobia",
      label: "Photophobia-Safe",
      icon: <Eye className="w-4 h-4 text-calm-text-muted" />,
      desc: "Ultra-warm amber & stone, no blue or harsh contrast",
    },
    {
      id: "low-light",
      label: "Low-Light",
      icon: <Moon className="w-4 h-4 text-calm-sage" />,
      desc: "Subdued night palette with gentle sage tones",
    },
    {
      id: "high-contrast",
      label: "High Contrast",
      icon: <SunDim className="w-4 h-4 text-calm-text" />,
      desc: "Distinct text edges without bright glare",
    },
  ];

  return (
    <div className="flex flex-col gap-3 p-4 bg-calm-bg-card border border-calm-border rounded-xl">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-calm-text">Display Theme</label>
        <span className="text-xs text-calm-text-muted">Glare reduction</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {themes.map((t) => {
          const isSelected = accessibility.theme === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`flex items-center gap-2.5 px-3.5 py-3 rounded-lg text-left transition-colors min-h-touch border ${
                isSelected
                  ? "bg-calm-bg-elevated border-calm-sage text-calm-text shadow-sm"
                  : "bg-calm-bg-surface border-calm-border text-calm-text-dim hover:text-calm-text hover:border-calm-border-focus"
              }`}
              aria-pressed={isSelected}
            >
              {t.icon}
              <div className="flex flex-col">
                <span className="text-sm font-semibold">{t.label}</span>
                <span className="text-xs text-calm-text-muted opacity-80">{t.desc}</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="pt-2 border-t border-calm-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ZapOff className="w-4 h-4 text-calm-text-muted" />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-calm-text">Reduce Motion</span>
            <span className="text-xs text-calm-text-muted">Stops animations and page shifts</span>
          </div>
        </div>
        <button
          onClick={() => setReducedMotion(!accessibility.reducedMotion)}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold min-h-[36px] min-w-[60px] border transition-colors ${
            accessibility.reducedMotion
              ? "bg-calm-sage text-calm-bg-deep border-calm-sage"
              : "bg-calm-bg-surface text-calm-text-muted border-calm-border"
          }`}
          aria-pressed={accessibility.reducedMotion}
        >
          {accessibility.reducedMotion ? "Active" : "Off"}
        </button>
      </div>

      <div className="pt-2 border-t border-calm-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-calm-text-muted" />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-calm-text">Language / ভাষা</span>
            <span className="text-xs text-calm-text-muted">English or বাংলা (Bengali)</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setLanguage("en")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold min-h-[36px] border transition-colors ${
              accessibility.language === "en"
                ? "bg-calm-sage text-calm-bg-deep border-calm-sage"
                : "bg-calm-bg-surface text-calm-text-muted border-calm-border"
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLanguage("bn")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold min-h-[36px] border transition-colors ${
              accessibility.language === "bn"
                ? "bg-calm-sage text-calm-bg-deep border-calm-sage"
                : "bg-calm-bg-surface text-calm-text-muted border-calm-border"
            }`}
          >
            বাংলা
          </button>
        </div>
      </div>
    </div>
  );
};
