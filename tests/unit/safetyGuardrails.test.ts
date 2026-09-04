import { describe, it, expect } from "vitest";
import {
  evaluateRedFlags,
  validateAIOutput,
  getSafeFallbackResponse,
} from "@/lib/safetyGuardrails";
import { CLINICAL_DISCLAIMER_TEXT } from "@/lib/constants";

describe("Safety Guardrails & Red-Flag Detection", () => {
  it("detects severe maximum intensity headache as a red flag", () => {
    const result = evaluateRedFlags(undefined, { headache: 5 });
    expect(result.isRedFlag).toBe(true);
    expect(result.alert).toBeDefined();
    expect(result.alert?.requiresImmediateEvaluation).toBe(true);
    expect(result.alert?.matchedSymptoms).toContain("Severe maximum intensity headache");
  });

  it("detects red flag emergency keywords in notes", () => {
    const notesWithRedFlag = "I feel awful, started vomiting repeatedly this afternoon.";
    const result = evaluateRedFlags(notesWithRedFlag);
    expect(result.isRedFlag).toBe(true);
    expect(result.alert?.matchedSymptoms.some((s) => s.includes("vomit"))).toBe(true);
  });

  it("detects slurred speech and seizure keywords", () => {
    const speech = "My partner noticed my words are slurred and I felt a convulsion.";
    const result = evaluateRedFlags(speech);
    expect(result.isRedFlag).toBe(true);
    expect(result.alert?.matchedSymptoms.some((s) => s.includes("slurred"))).toBe(true);
  });

  it("passes safe normal symptom reports without red flags", () => {
    const safeNote = "Mild eye tiredness after looking at spreadsheets. Took a 10 min break.";
    const result = evaluateRedFlags(safeNote, { headache: 2 });
    expect(result.isRedFlag).toBe(false);
    expect(result.alert).toBeUndefined();
  });

  it("filters forbidden diagnostic claims from AI responses", () => {
    const unsafeAIResponse = {
      message: "You have concussion relapse and your condition is medically deteriorating.",
      action: "Take medication immediately.",
      urgency: "urgent",
      disclaimer: "None",
    };

    const validated = validateAIOutput(unsafeAIResponse);
    expect(validated.message).not.toContain("concussion relapse");
    expect(validated.disclaimer).toBe(CLINICAL_DISCLAIMER_TEXT);
  });

  it("validates compliant structured AI responses", () => {
    const compliantResponse = {
      message: "Taking regular breaks helps maintain steady recovery pacing.",
      action: "Consider resting for 5 minutes in a quiet room.",
      urgency: "normal",
      disclaimer: CLINICAL_DISCLAIMER_TEXT,
    };

    const validated = validateAIOutput(compliantResponse);
    expect(validated.safetyPassed).toBe(true);
    expect(validated.message).toBe(compliantResponse.message);
  });
});
