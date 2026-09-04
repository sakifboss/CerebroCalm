import { SymptomEntry, SymptomTrendPoint } from "@/types/symptom";

export interface TrendAnalysisResult {
  dailyPoints: SymptomTrendPoint[];
  sevenDayMovingAverage: number;
  overallAverage: number;
  totalEntries: number;
  slope: number; // change per entry
  direction: "easing" | "stable" | "elevating";
  variability: number; // standard deviation
  interpretation: string;
}

/**
 * Group entries by calendar date (YYYY-MM-DD) and compute daily averages
 */
export function aggregateDailySymptoms(entries: SymptomEntry[]): SymptomTrendPoint[] {
  const groups = new Map<string, SymptomEntry[]>();

  for (const entry of entries) {
    const dateStr = entry.timestamp.slice(0, 10);
    const list = groups.get(dateStr) || [];
    list.push(entry);
    groups.set(dateStr, list);
  }

  const points: SymptomTrendPoint[] = [];

  for (const [date, list] of groups.entries()) {
    const count = list.length;
    const avgHeadache = list.reduce((sum, e) => sum + e.headache, 0) / count;
    const avgSensory = list.reduce((sum, e) => sum + e.sensorySensitivity, 0) / count;
    const avgFatigue = list.reduce((sum, e) => sum + e.cognitiveFatigue, 0) / count;
    const totalScore = avgHeadache + avgSensory + avgFatigue;

    points.push({
      date,
      averageHeadache: Number(avgHeadache.toFixed(1)),
      averageSensory: Number(avgSensory.toFixed(1)),
      averageFatigue: Number(avgFatigue.toFixed(1)),
      totalScore: Number(totalScore.toFixed(1)),
      entryCount: count,
    });
  }

  return points.sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Perform transparent statistical trend analysis on symptom logs
 */
export function analyzeSymptomTrends(entries: SymptomEntry[]): TrendAnalysisResult {
  if (!entries || entries.length === 0) {
    return {
      dailyPoints: [],
      sevenDayMovingAverage: 0,
      overallAverage: 0,
      totalEntries: 0,
      slope: 0,
      direction: "stable",
      variability: 0,
      interpretation: "Log symptoms over a few days to view personal patterns.",
    };
  }

  const dailyPoints = aggregateDailySymptoms(entries);
  const totalScores = dailyPoints.map((p) => p.totalScore);
  const totalEntries = entries.length;

  const sum = totalScores.reduce((acc, v) => acc + v, 0);
  const overallAverage = Number((sum / totalScores.length).toFixed(1));

  // 7-day moving average (last up to 7 days)
  const last7 = totalScores.slice(-7);
  const sevenDayMovingAverage = Number(
    (last7.reduce((acc, v) => acc + v, 0) / last7.length).toFixed(1)
  );

  // Variability (Standard Deviation of totalScore)
  const variance =
    totalScores.reduce((acc, v) => acc + Math.pow(v - overallAverage, 2), 0) / totalScores.length;
  const variability = Number(Math.sqrt(variance).toFixed(2));

  // Simple Linear Regression slope across daily points
  let slope = 0;
  if (dailyPoints.length > 1) {
    const n = dailyPoints.length;
    const xMean = (n - 1) / 2;
    const yMean = overallAverage;

    let numerator = 0;
    let denominator = 0;

    for (let i = 0; i < n; i++) {
      const xDiff = i - xMean;
      numerator += xDiff * (totalScores[i] - yMean);
      denominator += xDiff * xDiff;
    }

    slope = denominator !== 0 ? Number((numerator / denominator).toFixed(3)) : 0;
  }

  // Determine direction
  let direction: "easing" | "stable" | "elevating" = "stable";
  if (slope < -0.15) {
    direction = "easing";
  } else if (slope > 0.15) {
    direction = "elevating";
  }

  // Plain-language, responsible interpretation
  let interpretation = "Your recent entries show a consistent, stable pacing pattern.";
  if (direction === "easing") {
    interpretation = "Recent entries show lower symptom scores compared to earlier entries.";
  } else if (direction === "elevating") {
    interpretation =
      "Recent entries reflect higher scores; consider reviewing your daily activity duration.";
  }

  return {
    dailyPoints,
    sevenDayMovingAverage,
    overallAverage,
    totalEntries,
    slope,
    direction,
    variability,
    interpretation,
  };
}
