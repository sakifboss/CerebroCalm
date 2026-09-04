import { describe, it, expect } from "vitest";
import {
  SymptomEntrySchema,
  PacingSessionSchema,
  AIResponseSchema,
} from "@/lib/validation";

describe("Runtime Validation Schemas", () => {
  it("accepts valid symptom entries", () => {
    const validEntry = {
      id: "sym_123",
      timestamp: "2026-09-04T12:00:00.000Z",
      headache: 3,
      sensorySensitivity: 2,
      cognitiveFatigue: 4,
      mood: "frustrated",
      note: "Read screens for 20 mins",
      source: "manual",
    };

    const parsed = SymptomEntrySchema.safeParse(validEntry);
    expect(parsed.success).toBe(true);
  });

  it("rejects impossible symptom values outside 1-5 scale", () => {
    const invalidEntry = {
      id: "sym_124",
      timestamp: "2026-09-04T12:00:00.000Z",
      headache: 8, // Out of range!
      sensorySensitivity: 2,
      cognitiveFatigue: 0, // Out of range!
      mood: "calm",
      source: "manual",
    };

    const parsed = SymptomEntrySchema.safeParse(invalidEntry);
    expect(parsed.success).toBe(false);
  });

  it("rejects invalid moods", () => {
    const invalidMood = {
      id: "sym_125",
      timestamp: "2026-09-04T12:00:00.000Z",
      headache: 1,
      sensorySensitivity: 1,
      cognitiveFatigue: 1,
      mood: "super_excited_manic", // Invalid mood
      source: "manual",
    };

    const parsed = SymptomEntrySchema.safeParse(invalidMood);
    expect(parsed.success).toBe(false);
  });

  it("enforces AI response schema structure and non-empty disclaimer", () => {
    const validAI = {
      message: "Take a break",
      action: "Dark Sanctuary",
      urgency: "normal",
      disclaimer: "Educational only",
    };

    const parsed = AIResponseSchema.safeParse(validAI);
    expect(parsed.success).toBe(true);
  });
});
