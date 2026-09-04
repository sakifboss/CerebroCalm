import { SymptomEntry } from "@/types/symptom";
import { FeatureVector } from "./modelTypes";

/**
 * Extracts a normalized feature vector from the user's recent symptom logs
 */
export function extractFeatures(entries: SymptomEntry[]): FeatureVector {
  if (!entries || entries.length === 0) {
    return {
      recentFatigueAvg: 0,
      recentHeadacheAvg: 0,
      recentSensoryAvg: 0,
      symptomSlope: 0,
      entryCount: 0,
      fatigueVelocity: 0,
    };
  }

  const sorted = [...entries].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  // Take the last 5 entries for recent window
  const window = sorted.slice(-5);
  const n = window.length;

  const fatigueSum = window.reduce((acc, e) => acc + e.cognitiveFatigue, 0);
  const headacheSum = window.reduce((acc, e) => acc + e.headache, 0);
  const sensorySum = window.reduce((acc, e) => acc + e.sensorySensitivity, 0);

  const recentFatigueAvg = fatigueSum / n;
  const recentHeadacheAvg = headacheSum / n;
  const recentSensoryAvg = sensorySum / n;

  // Slope calculation over window
  let slope = 0;
  if (n > 1) {
    const firstTotal = window[0].headache + window[0].cognitiveFatigue + window[0].sensorySensitivity;
    const lastTotal =
      window[n - 1].headache +
      window[n - 1].cognitiveFatigue +
      window[n - 1].sensorySensitivity;
    slope = (lastTotal - firstTotal) / (n - 1);
  }

  // Velocity (last delta)
  let fatigueVelocity = 0;
  if (n >= 2) {
    fatigueVelocity = window[n - 1].cognitiveFatigue - window[n - 2].cognitiveFatigue;
  }

  return {
    recentFatigueAvg,
    recentHeadacheAvg,
    recentSensoryAvg,
    symptomSlope: slope,
    entryCount: sorted.length,
    fatigueVelocity,
  };
}
