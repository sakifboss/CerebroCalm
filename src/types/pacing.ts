import { SymptomScale } from "./symptom";

export type PacingStatus = "idle" | "active" | "break" | "paused" | "completed";

export interface PacingSession {
  id: string;
  startTime: string; // ISO string
  endTime?: string;
  plannedActivityMinutes: number;
  plannedBreakMinutes: number;
  actualActivitySeconds: number;
  actualBreakSeconds: number;
  symptomBefore?: {
    headache: SymptomScale;
    cognitiveFatigue: SymptomScale;
  };
  symptomAfter?: {
    headache: SymptomScale;
    cognitiveFatigue: SymptomScale;
  };
  status: PacingStatus;
  notes?: string;
}

export interface PacingConfig {
  activityMinutes: number;
  breakMinutes: number;
  soundAlert: boolean;
  vibrationAlert: boolean;
  autoSanctuaryOnBreak: boolean;
}
