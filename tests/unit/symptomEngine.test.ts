import { describe, it, expect } from "vitest";
import { assessCognitiveLoad } from "@/lib/symptomEngine";
import { SymptomEntry } from "@/types/symptom";

describe("Symptom & Cognitive Fatigue Engine", () => {
  it("returns NORMAL baseline when no entries exist", () => {
    const result = assessCognitiveLoad([]);
    expect(result.state).toBe("NORMAL");
    expect(result.suggestedAction).toBe("CONTINUE");
  });

  it("detects COGNITIVE_LOAD_HIGH when fatigue increases consecutively", () => {
    const entries: SymptomEntry[] = [
      {
        id: "1",
        timestamp: "2026-09-04T10:00:00.000Z",
        headache: 2,
        sensorySensitivity: 2,
        cognitiveFatigue: 2,
        mood: "calm",
        source: "manual",
      },
      {
        id: "2",
        timestamp: "2026-09-04T12:00:00.000Z",
        headache: 3,
        sensorySensitivity: 3,
        cognitiveFatigue: 4,
        mood: "frustrated",
        source: "manual",
      },
    ];

    const result = assessCognitiveLoad(entries);
    expect(result.state).toBe("COGNITIVE_LOAD_HIGH");
    expect(result.suggestedAction).toBe("ENTER_RECOVERY");
    expect(result.contributingFactors.length).toBeGreaterThan(0);
    // Never diagnose
    expect(result.reason).not.toContain("TBI");
  });

  it("detects COGNITIVE_LOAD_HIGH when any symptom reaches severe score (4 or 5)", () => {
    const entries: SymptomEntry[] = [
      {
        id: "1",
        timestamp: "2026-09-04T10:00:00.000Z",
        headache: 4,
        sensorySensitivity: 2,
        cognitiveFatigue: 2,
        mood: "okay",
        source: "manual",
      },
    ];

    const result = assessCognitiveLoad(entries);
    expect(result.state).toBe("COGNITIVE_LOAD_HIGH");
    expect(result.suggestedAction).toBe("ENTER_RECOVERY");
  });

  it("retains NORMAL status for stable low ratings", () => {
    const entries: SymptomEntry[] = [
      {
        id: "1",
        timestamp: "2026-09-03T10:00:00.000Z",
        headache: 2,
        sensorySensitivity: 1,
        cognitiveFatigue: 2,
        mood: "calm",
        source: "manual",
      },
      {
        id: "2",
        timestamp: "2026-09-04T10:00:00.000Z",
        headache: 2,
        sensorySensitivity: 1,
        cognitiveFatigue: 1,
        mood: "calm",
        source: "manual",
      },
    ];

    const result = assessCognitiveLoad(entries);
    expect(result.state).toBe("NORMAL");
    expect(result.suggestedAction).toBe("CONTINUE");
  });
});
