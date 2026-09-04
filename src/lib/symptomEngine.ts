import { SymptomEntry } from "@/types/symptom";
import { CognitiveLoadAssessment } from "@/types/safety";

/**
 * Deterministic Fatigue & Cognitive Load Evaluation Engine
 * Evaluates changes across consecutive symptom entries to detect cognitive fatigue escalation.
 * Strictly non-diagnostic.
 */
export function assessCognitiveLoad(entries: SymptomEntry[]): CognitiveLoadAssessment {
  if (!entries || entries.length === 0) {
    return {
      state: "NORMAL",
      reason: "No symptom entries recorded yet.",
      suggestedAction: "CONTINUE",
      contributingFactors: [],
    };
  }

  // Sort ascending by timestamp
  const sorted = [...entries].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const latest = sorted[sorted.length - 1];
  const contributingFactors: string[] = [];

  // Check absolute severity threshold in latest entry
  const highAbsoluteSymptoms =
    latest.headache >= 4 || latest.cognitiveFatigue >= 4 || latest.sensorySensitivity >= 4;

  if (latest.headache >= 4) {
    contributingFactors.push(`Elevated headache intensity (${latest.headache}/5)`);
  }
  if (latest.cognitiveFatigue >= 4) {
    contributingFactors.push(`Elevated mental fatigue (${latest.cognitiveFatigue}/5)`);
  }
  if (latest.sensorySensitivity >= 4) {
    contributingFactors.push(`Elevated sensory sensitivity (${latest.sensorySensitivity}/5)`);
  }

  // Check escalation across consecutive entries if at least 2 entries exist
  if (sorted.length >= 2) {
    const previous = sorted[sorted.length - 2];
    const fatigueDelta = latest.cognitiveFatigue - previous.cognitiveFatigue;
    const headacheDelta = latest.headache - previous.headache;
    const sensoryDelta = latest.sensorySensitivity - previous.sensorySensitivity;

    const consecutiveFatigueIncrease = fatigueDelta > 0;
    const consecutiveHeadacheIncrease = headacheDelta > 0;

    if (consecutiveFatigueIncrease) {
      contributingFactors.push(
        `Cognitive fatigue rose from ${previous.cognitiveFatigue} to ${latest.cognitiveFatigue} across consecutive checks`
      );
    }
    if (consecutiveHeadacheIncrease) {
      contributingFactors.push(
        `Headache score rose from ${previous.headache} to ${latest.headache} across consecutive checks`
      );
    }

    // High cognitive load condition:
    // Either consecutive rise on top of elevated level, or multiple symptom increases, or absolute high score
    if ((consecutiveFatigueIncrease && latest.cognitiveFatigue >= 3) || (consecutiveFatigueIncrease && consecutiveHeadacheIncrease)) {
      return {
        state: "COGNITIVE_LOAD_HIGH",
        reason:
          "Symptom entries indicate an upward shift in cognitive fatigue across your recent sessions.",
        suggestedAction: "ENTER_RECOVERY",
        contributingFactors,
      };
    }

    if (highAbsoluteSymptoms) {
      return {
        state: "COGNITIVE_LOAD_HIGH",
        reason: "Current symptom ratings are at an elevated level.",
        suggestedAction: "ENTER_RECOVERY",
        contributingFactors,
      };
    }

    if (consecutiveFatigueIncrease || consecutiveHeadacheIncrease || sensoryDelta > 0) {
      return {
        state: "COGNITIVE_LOAD_ELEVATED",
        reason: "Slight rise noted in your latest entry compared to the prior check.",
        suggestedAction: "CONSIDER_PAUSE",
        contributingFactors,
      };
    }
  } else {
    // Single entry logic
    if (highAbsoluteSymptoms) {
      return {
        state: "COGNITIVE_LOAD_HIGH",
        reason: "Current ratings reflect noticeable fatigue or sensory load.",
        suggestedAction: "ENTER_RECOVERY",
        contributingFactors,
      };
    }
  }

  return {
    state: "NORMAL",
    reason: "Current entries reflect a stable pacing baseline.",
    suggestedAction: "CONTINUE",
    contributingFactors,
  };
}
