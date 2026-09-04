import { SymptomEntry } from "@/types/symptom";
import { extractFeatures } from "./featureEngineering";
import { PredictionOutput } from "./modelTypes";

const ML_EDUCATIONAL_DISCLAIMER =
  "This is an educational estimate based on your personal logged entries, not a clinical forecast or medical diagnosis.";

/**
 * Predicts cognitive load pressure using an explainable, lightweight heuristic model.
 * Does not require external servers or deep neural networks.
 */
export function predictCognitiveFatigue(entries: SymptomEntry[]): PredictionOutput {
  const features = extractFeatures(entries);

  // Require at least 3 entries to evaluate personal patterns responsibly
  if (features.entryCount < 3) {
    return {
      hasSufficientData: false,
      recommendation: "Not enough personal data yet. Record at least 3 checks to view pattern insights.",
      contributingFactors: [],
      confidenceScore: 0,
      disclaimer: ML_EDUCATIONAL_DISCLAIMER,
    };
  }

  const factors: string[] = [];

  // Logistic-style weight coefficients
  const wFatigue = 0.45;
  const wHeadache = 0.25;
  const wSlope = 0.2;
  const wVelocity = 0.1;

  // Normalized raw score [0, 1]
  // max possible fatigue/headache avg is 5
  const normFatigue = features.recentFatigueAvg / 5;
  const normHeadache = features.recentHeadacheAvg / 5;
  const normSlope = Math.min(1, Math.max(0, (features.symptomSlope + 2) / 4));
  const normVelocity = Math.min(1, Math.max(0, (features.fatigueVelocity + 2) / 4));

  const weightedRisk =
    normFatigue * wFatigue +
    normHeadache * wHeadache +
    normSlope * wSlope +
    normVelocity * wVelocity;

  if (features.recentFatigueAvg >= 3.2) {
    factors.push(`Recent mental fatigue average is elevated (${features.recentFatigueAvg.toFixed(1)}/5)`);
  }
  if (features.symptomSlope > 0.2) {
    factors.push("Overall symptom ratings have trended upward over your last few checks");
  }
  if (features.fatigueVelocity > 0) {
    factors.push("Fatigue increased in your most recent entry");
  }

  // Calculate confidence based on data sample size
  const sampleConfidence = Math.min(0.85, 0.4 + features.entryCount * 0.05);

  if (weightedRisk > 0.6) {
    return {
      hasSufficientData: true,
      recommendation:
        "Recent symptom pattern suggests you may benefit from a lower cognitive-load session and taking breaks earlier.",
      contributingFactors: factors.length > 0 ? factors : ["Recent ratings are above your baseline average."],
      confidenceScore: Number(sampleConfidence.toFixed(2)),
      disclaimer: ML_EDUCATIONAL_DISCLAIMER,
    };
  }

  return {
    hasSufficientData: true,
    recommendation:
      "Recent symptom pattern reflects a steady cognitive pacing baseline. Continue pacing as guided by your clinician.",
    contributingFactors: ["Symptom ratings have remained stable across recent checks."],
    confidenceScore: Number(sampleConfidence.toFixed(2)),
    disclaimer: ML_EDUCATIONAL_DISCLAIMER,
  };
}
