export type UrgencyLevel = "normal" | "caution" | "urgent";

export interface RedFlagAlert {
  id: string;
  timestamp: string;
  triggerReason: string;
  matchedSymptoms: string[];
  guidanceText: string;
  requiresImmediateEvaluation: boolean;
}

export interface AIResponsePayload {
  message: string;
  action: string;
  urgency: UrgencyLevel;
  disclaimer: string;
  safetyPassed: boolean;
}

export interface CognitiveLoadAssessment {
  state: "NORMAL" | "COGNITIVE_LOAD_ELEVATED" | "COGNITIVE_LOAD_HIGH";
  reason: string;
  suggestedAction: "CONTINUE" | "CONSIDER_PAUSE" | "ENTER_RECOVERY";
  contributingFactors: string[];
}
