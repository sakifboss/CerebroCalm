import { describe, it, expect } from "vitest";
import { analyzeTriggerCorrelations } from "@/lib/triggerEngine";
import { TRANSLATIONS } from "@/lib/i18n";
import { SymptomEntry } from "@/types/symptom";

describe("Smart Trigger Correlation & Advanced Recovery Tools", () => {
  it("calculates trigger correlation differences accurately", () => {
    const mockEntries: SymptomEntry[] = [
      {
        id: "1",
        timestamp: "2026-09-01T10:00:00.000Z",
        headache: 2,
        sensorySensitivity: 2,
        cognitiveFatigue: 2, // baseline low
        mood: "calm",
        source: "manual",
      },
      {
        id: "2",
        timestamp: "2026-09-02T10:00:00.000Z",
        headache: 3,
        sensorySensitivity: 3,
        cognitiveFatigue: 4, // spike with screen trigger
        triggers: ["screens"],
        mood: "frustrated",
        source: "manual",
      },
      {
        id: "3",
        timestamp: "2026-09-03T10:00:00.000Z",
        headache: 4,
        sensorySensitivity: 4,
        cognitiveFatigue: 4, // spike with screen and noise trigger
        triggers: ["screens", "noise"],
        mood: "overwhelmed",
        source: "manual",
      },
    ];

    const correlations = analyzeTriggerCorrelations(mockEntries);
    expect(correlations.length).toBeGreaterThan(0);

    const screenCorr = correlations.find((c) => c.trigger === "screens");
    expect(screenCorr).toBeDefined();
    expect(screenCorr?.count).toBe(2);
    // Baseline fatigue average is (2 + 4 + 4) / 3 = 3.33
    // Screen average is (4 + 4) / 2 = 4.0
    // Delta should be positive (fatigue increase)
    expect(screenCorr?.delta).toBeGreaterThan(0);
  });

  it("handles entries without triggers safely", () => {
    const entriesWithoutTriggers: SymptomEntry[] = [
      {
        id: "1",
        timestamp: "2026-09-01T10:00:00.000Z",
        headache: 1,
        sensorySensitivity: 1,
        cognitiveFatigue: 1,
        mood: "calm",
        source: "manual",
      },
      {
        id: "2",
        timestamp: "2026-09-02T10:00:00.000Z",
        headache: 2,
        sensorySensitivity: 2,
        cognitiveFatigue: 2,
        mood: "okay",
        source: "manual",
      },
    ];

    const correlations = analyzeTriggerCorrelations(entriesWithoutTriggers);
    expect(correlations.length).toBe(0);
  });

  it("ensures bilingual dictionaries have matching keys", () => {
    const enKeys = Object.keys(TRANSLATIONS.en).sort();
    const bnKeys = Object.keys(TRANSLATIONS.bn).sort();
    expect(enKeys).toEqual(bnKeys);
    expect(TRANSLATIONS.bn.appName).toBe("সেরিব্রোকাম");
  });
});
