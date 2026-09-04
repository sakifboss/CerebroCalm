export type ThemeMode = "photophobia" | "low-light" | "high-contrast";

export type RecoveryStage = 1 | 2 | 3 | 4 | 5;

export interface RecoveryStageInfo {
  stage: RecoveryStage;
  name: string;
  shortDesc: string;
  guidance: string;
  recommendedActivityMins: number;
  recommendedBreakMins: number;
}

export interface PatientProfile {
  name: string;
  injuryDate?: string; // YYYY-MM-DD
  recoveryStage: RecoveryStage;
  doctorName?: string;
  doctorPhone?: string;
  clinicName?: string;
  hasCompletedOnboarding: boolean;
}

export interface AccessibilitySettings {
  reducedMotion: boolean;
  theme: ThemeMode;
  fontSize: "standard" | "large" | "extra-large";
  highContrast: boolean;
  screenReaderOptimized: boolean;
  language: "en" | "bn";
}

export interface UserSettings {
  profile: PatientProfile;
  accessibility: AccessibilitySettings;
  pacing: {
    activityMinutes: number;
    breakMinutes: number;
    soundEnabled: boolean;
    autoSanctuary: boolean;
  };
  voiceEnabled: boolean;
  demoMode: boolean;
  dataEncryptionEnabled: boolean;
}
