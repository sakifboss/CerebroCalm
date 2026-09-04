import { describe, it, expect } from "vitest";
import {
  aggregateDailySymptoms,
  analyzeSymptomTrends,
} from "@/lib/trendAnalysis";
import { SymptomEntry } from "@/types/symptom";

describe("Trend Analysis Engine", () => {
  const mockEntries: SymptomEntry[] = [
    {
      id: "e1",
      timestamp: "2026-09-01T09:00:00.000Z",
      headache: 3,
      sensorySensitivity: 3,
      cognitiveFatigue: 3,
      mood: "okay",
      source: "manual",
    },
    {
      id: "e2",
      timestamp: "2026-09-01T15:00:00.000Z",
      headache: 2,
      sensorySensitivity: 2,
      cognitiveFatigue: 2,
      mood: "calm",
      source: "manual",
    },
    {
      id: "e3",
      timestamp: "2026-09-02T10:00:00.000Z",
      headache: 2,
      sensorySensitivity: 2,
      cognitiveFatigue: 2,
      mood: "calm",
      source: "manual",
    },
    {
      id: "e4",
      timestamp: "2026-09-03T10:00:00.000Z",
      headache: 1,
      sensorySensitivity: 1,
      cognitiveFatigue: 1,
      mood: "calm",
      source: "manual",
    },
  ];

  it("aggregates daily entries by calendar date correctly", () => {
    const daily = aggregateDailySymptoms(mockEntries);
    expect(daily.length).toBe(3); // 3 distinct dates: Sep 1, Sep 2, Sep 3

    // Sep 1 average: (3+2)/2 = 2.5 for each symptom, total = 7.5
    const sep1 = daily.find((d) => d.date === "2026-09-01");
    expect(sep1).toBeDefined();
    expect(sep1?.averageHeadache).toBe(2.5);
    expect(sep1?.totalScore).toBe(7.5);
    expect(sep1?.entryCount).toBe(2);
  });

  it("computes moving averages and non-diagnostic trend directions", () => {
    const trends = analyzeSymptomTrends(mockEntries);
    expect(trends.totalEntries).toBe(4);
    expect(trends.dailyPoints.length).toBe(3);
    expect(trends.sevenDayMovingAverage).toBeGreaterThan(0);
    expect(trends.slope).toBeLessThan(0); // Sep 1 (7.5) -> Sep 2 (6.0) -> Sep 3 (3.0) is easing
    expect(trends.direction).toBe("easing");
    expect(trends.interpretation).toContain("lower symptom scores");
  });

  it("handles empty history gracefully", () => {
    const trends = analyzeSymptomTrends([]);
    expect(trends.totalEntries).toBe(0);
    expect(trends.dailyPoints.length).toBe(0);
    expect(trends.sevenDayMovingAverage).toBe(0);
    expect(trends.direction).toBe("stable");
  });
});
