export type SymptomScale = 1 | 2 | 3 | 4 | 5;

export type MoodType =
  | "calm"
  | "okay"
  | "frustrated"
  | "overwhelmed"
  | "anxious"
  | "exhausted";

export type SymptomTrigger =
  | "screens"
  | "lighting"
  | "noise"
  | "motion"
  | "poor_sleep"
  | "physical";

export interface SymptomEntry {
  id: string;
  timestamp: string; // ISO 8601
  headache: SymptomScale; // 1 (none/minimal) to 5 (severe)
  sensorySensitivity: SymptomScale; // Light/sound sensitivity 1 to 5
  cognitiveFatigue: SymptomScale; // Brain fog / mental fatigue 1 to 5
  mood: MoodType;
  triggers?: SymptomTrigger[];
  note?: string;
  source: "manual" | "voice" | "demo";
  isDemo?: boolean;
}

export interface SymptomTrendPoint {
  date: string; // YYYY-MM-DD
  averageHeadache: number;
  averageSensory: number;
  averageFatigue: number;
  totalScore: number;
  entryCount: number;
}

export interface ReactionCheckResult {
  id: string;
  timestamp: string;
  trials: number[]; // Reaction times in milliseconds
  averageMs: number;
  variabilityMs: number; // Standard deviation of trials
  rating: "steady" | "mildly_variable" | "high_variability";
}

export interface TriggerCorrelation {
  trigger: SymptomTrigger;
  label: string;
  count: number;
  averageFatigueWhenPresent: number;
  averageFatigueBaseline: number;
  delta: number;
}
