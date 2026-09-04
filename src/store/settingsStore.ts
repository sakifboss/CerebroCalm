import { create } from "zustand";
import { UserSettings, ThemeMode, PatientProfile } from "@/types/user";
import { RedFlagAlert } from "@/types/safety";
import { PACING_DEFAULTS } from "@/lib/constants";
import { DEFAULT_PATIENT_PROFILE, getStageInfo } from "@/lib/profileEngine";

interface SettingsState extends UserSettings {
  activeRedFlag: RedFlagAlert | null;
  updateProfile: (profile: Partial<PatientProfile>) => void;
  setTheme: (theme: ThemeMode) => void;
  setReducedMotion: (enabled: boolean) => void;
  setFontSize: (size: "standard" | "large" | "extra-large") => void;
  setPacingMinutes: (activityMinutes: number, breakMinutes: number) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setAutoSanctuary: (enabled: boolean) => void;
  setDemoMode: (enabled: boolean) => void;
  triggerRedFlag: (alert: RedFlagAlert) => void;
  clearRedFlag: () => void;
  resetAllSettings: () => void;
}

const DEFAULT_SETTINGS: UserSettings = {
  profile: DEFAULT_PATIENT_PROFILE,
  accessibility: {
    reducedMotion: false,
    theme: "photophobia",
    fontSize: "standard",
    highContrast: false,
    screenReaderOptimized: false,
  },
  pacing: {
    activityMinutes: PACING_DEFAULTS.ACTIVITY_MINUTES,
    breakMinutes: PACING_DEFAULTS.BREAK_MINUTES,
    soundEnabled: true,
    autoSanctuary: true,
  },
  voiceEnabled: true,
  demoMode: false,
  dataEncryptionEnabled: true,
};

export const useSettingsStore = create<SettingsState>((set) => ({
  ...DEFAULT_SETTINGS,
  activeRedFlag: null,

  updateProfile: (updates) =>
    set((state) => {
      const updatedProfile = { ...state.profile, ...updates };
      // If recovery stage changed, adapt recommended pacing defaults
      let updatedPacing = state.pacing;
      if (updates.recoveryStage && updates.recoveryStage !== state.profile.recoveryStage) {
        const info = getStageInfo(updates.recoveryStage);
        updatedPacing = {
          ...state.pacing,
          activityMinutes: info.recommendedActivityMins,
          breakMinutes: info.recommendedBreakMins,
        };
      }
      return {
        profile: updatedProfile,
        pacing: updatedPacing,
      };
    }),

  setTheme: (theme) =>
    set((state) => {
      if (typeof document !== "undefined") {
        document.documentElement.classList.remove("theme-photophobia", "theme-low-light", "theme-high-contrast");
        document.documentElement.classList.add(`theme-${theme}`);
      }
      return {
        accessibility: { ...state.accessibility, theme },
      };
    }),

  setReducedMotion: (reducedMotion) =>
    set((state) => {
      if (typeof document !== "undefined") {
        if (reducedMotion) {
          document.documentElement.classList.add("reduce-motion");
        } else {
          document.documentElement.classList.remove("reduce-motion");
        }
      }
      return {
        accessibility: { ...state.accessibility, reducedMotion },
      };
    }),

  setFontSize: (fontSize) =>
    set((state) => ({
      accessibility: { ...state.accessibility, fontSize },
    })),

  setPacingMinutes: (activityMinutes, breakMinutes) =>
    set((state) => ({
      pacing: { ...state.pacing, activityMinutes, breakMinutes },
    })),

  setSoundEnabled: (soundEnabled) =>
    set((state) => ({
      pacing: { ...state.pacing, soundEnabled },
    })),

  setAutoSanctuary: (autoSanctuary) =>
    set((state) => ({
      pacing: { ...state.pacing, autoSanctuary },
    })),

  setDemoMode: (demoMode) => set({ demoMode }),

  triggerRedFlag: (activeRedFlag) => set({ activeRedFlag }),

  clearRedFlag: () => set({ activeRedFlag: null }),

  resetAllSettings: () => set({ ...DEFAULT_SETTINGS, activeRedFlag: null }),
}));
