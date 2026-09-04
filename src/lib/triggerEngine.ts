import { SymptomEntry, SymptomTrigger, TriggerCorrelation } from "@/types/symptom";

export const TRIGGER_METADATA: Record<SymptomTrigger, { label: string; icon: string; description: string }> = {
  screens: {
    label: "Screen Exertion",
    icon: "🖥️",
    description: "Reading on monitors, phones, or virtual meetings",
  },
  lighting: {
    label: "Harsh / Fluorescent Glare",
    icon: "💡",
    description: "Overhead lighting, supermarket glare, or flicker",
  },
  noise: {
    label: "Loud Noise / Crowds",
    icon: "🔊",
    description: "Noisy rooms, traffic, or simultaneous chatter",
  },
  motion: {
    label: "Vehicle Motion / Travel",
    icon: "🚗",
    description: "Riding in cars, trains, or head movement",
  },
  poor_sleep: {
    label: "Sleep Disruption",
    icon: "💤",
    description: "Insomnia, waking with headache, or restlessness",
  },
  physical: {
    label: "Physical Exertion",
    icon: "🏃",
    description: "Bending over, heavy lifting, or cardio strain",
  },
};

/**
 * Calculates transparent statistical correlation between tagged triggers and fatigue spikes.
 * Uses explainable difference-of-means math (no black-box AI).
 */
export function analyzeTriggerCorrelations(entries: SymptomEntry[]): TriggerCorrelation[] {
  if (!entries || entries.length < 2) {
    return [];
  }

  const baselineFatigue =
    entries.reduce((sum, e) => sum + e.cognitiveFatigue, 0) / entries.length;

  const triggerStats = new Map<
    SymptomTrigger,
    { count: number; fatigueSum: number }
  >();

  // Initialize
  (Object.keys(TRIGGER_METADATA) as SymptomTrigger[]).forEach((trig) => {
    triggerStats.set(trig, { count: 0, fatigueSum: 0 });
  });

  for (const entry of entries) {
    if (entry.triggers && entry.triggers.length > 0) {
      for (const t of entry.triggers) {
        const current = triggerStats.get(t);
        if (current) {
          current.count += 1;
          current.fatigueSum += entry.cognitiveFatigue;
        }
      }
    }
  }

  const results: TriggerCorrelation[] = [];

  for (const [trig, stats] of triggerStats.entries()) {
    if (stats.count > 0) {
      const avgWhenPresent = stats.fatigueSum / stats.count;
      const delta = Number((avgWhenPresent - baselineFatigue).toFixed(2));

      results.push({
        trigger: trig,
        label: TRIGGER_METADATA[trig].label,
        count: stats.count,
        averageFatigueWhenPresent: Number(avgWhenPresent.toFixed(1)),
        averageFatigueBaseline: Number(baselineFatigue.toFixed(1)),
        delta,
      });
    }
  }

  // Sort descending by delta (highest fatigue impact first)
  return results.sort((a, b) => b.delta - a.delta);
}
