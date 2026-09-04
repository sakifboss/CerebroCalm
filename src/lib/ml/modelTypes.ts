export interface FeatureVector {
  recentFatigueAvg: number;
  recentHeadacheAvg: number;
  recentSensoryAvg: number;
  symptomSlope: number;
  entryCount: number;
  fatigueVelocity: number; // change from previous entry
}

export interface PredictionOutput {
  hasSufficientData: boolean;
  recommendation: string;
  contributingFactors: string[];
  confidenceScore: number; // 0.0 to 1.0 (heuristic uncertainty)
  disclaimer: string;
}
