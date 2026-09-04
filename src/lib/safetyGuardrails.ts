import { RED_FLAG_KEYWORDS, RED_FLAG_SYMPTOMS, CLINICAL_DISCLAIMER_TEXT } from "./constants";
import { RedFlagAlert, AIResponsePayload } from "@/types/safety";
import { AIResponseSchema } from "./validation";

export interface RedFlagDetectionResult {
  isRedFlag: boolean;
  alert?: RedFlagAlert;
}

/**
 * Deterministic Red-Flag Evaluator
 * Runs synchronously and locally before any AI processing or coaching logic.
 */
export function evaluateRedFlags(
  textNote?: string,
  explicitSymptoms?: {
    headache?: number;
    vomiting?: boolean;
    seizure?: boolean;
    confusion?: boolean;
    difficultyWaking?: boolean;
    slurredSpeech?: boolean;
    weaknessNumbness?: boolean;
    unequalPupils?: boolean;
  }
): RedFlagDetectionResult {
  const matchedSymptoms: string[] = [];

  // 1. Check explicit symptom toggles if present
  if (explicitSymptoms) {
    if (explicitSymptoms.headache === 5) {
      matchedSymptoms.push("Severe maximum intensity headache");
    }
    if (explicitSymptoms.vomiting) matchedSymptoms.push("Repeated vomiting");
    if (explicitSymptoms.seizure) matchedSymptoms.push("Seizures or convulsions");
    if (explicitSymptoms.confusion) matchedSymptoms.push("Unusual confusion or agitation");
    if (explicitSymptoms.difficultyWaking) matchedSymptoms.push("Severe difficulty waking or staying awake");
    if (explicitSymptoms.slurredSpeech) matchedSymptoms.push("Slurred speech or difficulty talking");
    if (explicitSymptoms.weaknessNumbness) matchedSymptoms.push("Weakness, numbness, or loss of coordination");
    if (explicitSymptoms.unequalPupils) matchedSymptoms.push("Unequal pupils or double vision");
  }

  // 2. Scan text notes or speech transcript for red-flag patterns
  if (textNote && textNote.trim().length > 0) {
    const normalized = textNote.toLowerCase();

    for (const keyword of RED_FLAG_KEYWORDS) {
      if (normalized.includes(keyword)) {
        matchedSymptoms.push(`Concerning sign detected: "${keyword}"`);
      }
    }
  }

  if (matchedSymptoms.length > 0) {
    const alert: RedFlagAlert = {
      id: `rf_${Date.now()}`,
      timestamp: new Date().toISOString(),
      triggerReason: "Potential emergency red-flag symptom detected",
      matchedSymptoms,
      guidanceText:
        "Emergency warning signs require immediate medical attention. Please seek urgent or emergency medical evaluation now (call 911 or go to the nearest emergency department). Do not wait.",
      requiresImmediateEvaluation: true,
    };
    return { isRedFlag: true, alert };
  }

  return { isRedFlag: false };
}

/**
 * Strict System Prompt for AI Interactions
 */
export const RESPONSIBLE_AI_SYSTEM_PROMPT = `
You are CerebroCalm's educational pacing and recovery assistant.
Your goal is to support the user in following their clinician's pacing plan.

CRITICAL SAFETY & RESPONSIBLE AI RULES:
1. NEVER diagnose a concussion, mild TBI, or any medical condition.
2. NEVER claim certainty about the user's medical trajectory or healing speed.
3. NEVER advise on medications, supplements, or medical procedures.
4. NEVER override clinician instructions or recovery protocols.
5. NEVER dismiss any symptom or label emergency symptoms as harmless.
6. If the user mentions any red flag (vomiting, seizure, slurred speech, worsening severe headache, numbness), ALWAYS recommend urgent medical evaluation immediately.
7. Always emphasize cognitive pacing: resting before fatigue escalates, gentle recovery, and dark/low-stimulation breaks.
8. Output MUST be valid JSON with keys: "message", "action", "urgency" ("normal" | "caution" | "urgent"), and "disclaimer".
`.trim();

/**
 * List of forbidden diagnostic or overconfident phrases
 */
const FORBIDDEN_DIAGNOSTIC_PHRASES = [
  "you have concussion relapse",
  "you have worsening tbi",
  "diagnosed with",
  "you are clinically improving",
  "you are cured",
  "take medication",
  "stop taking medication",
  "fda approved",
  "we guarantee",
  "you are completely safe",
];

/**
 * Validates AI generated output before rendering to user
 */
export function validateAIOutput(rawOutput: unknown): AIResponsePayload {
  // 1. Zod schema validation
  const parsed = AIResponseSchema.safeParse(rawOutput);
  if (!parsed.success) {
    return getSafeFallbackResponse("AI response format was unverified. Providing standard pacing guidance.");
  }

  const data = parsed.data;
  const lowerMessage = data.message.toLowerCase();
  const lowerAction = data.action.toLowerCase();

  // 2. Check for forbidden diagnostic claims
  for (const forbidden of FORBIDDEN_DIAGNOSTIC_PHRASES) {
    if (lowerMessage.includes(forbidden) || lowerAction.includes(forbidden)) {
      return getSafeFallbackResponse(
        "Response filtered due to non-compliant clinical language. Pacing guidance provided instead."
      );
    }
  }

  // 3. Ensure clinical disclaimer is attached
  return {
    message: data.message,
    action: data.action,
    urgency: data.urgency,
    disclaimer: CLINICAL_DISCLAIMER_TEXT,
    safetyPassed: true,
  };
}

/**
 * Conservative fallback response when validation or external model fails
 */
export function getSafeFallbackResponse(reason?: string): AIResponsePayload {
  return {
    message:
      "When managing cognitive fatigue, taking scheduled low-stimulation rest breaks helps protect recovery pacing.",
    action: "Consider resting in a quiet, low-light space for 5 to 10 minutes.",
    urgency: "normal",
    disclaimer: CLINICAL_DISCLAIMER_TEXT,
    safetyPassed: true,
  };
}
