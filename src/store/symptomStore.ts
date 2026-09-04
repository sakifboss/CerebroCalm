import { create } from "zustand";
import { SymptomEntry } from "@/types/symptom";
import { CognitiveLoadAssessment } from "@/types/safety";
import { PredictionOutput } from "@/lib/ml/modelTypes";
import {
  saveSymptomLocally,
  loadSymptomsLocally,
  wipeAllLocalData,
  clearDemoDataLocally,
} from "@/lib/storage";
import { assessCognitiveLoad } from "@/lib/symptomEngine";
import { predictCognitiveFatigue } from "@/lib/ml/fatiguePrediction";
import { evaluateRedFlags } from "@/lib/safetyGuardrails";
import { useSettingsStore } from "./settingsStore";

interface SymptomState {
  entries: SymptomEntry[];
  isLoading: boolean;
  error: string | null;
  assessment: CognitiveLoadAssessment;
  prediction: PredictionOutput;

  loadEntries: () => Promise<void>;
  addEntry: (entry: Omit<SymptomEntry, "id" | "timestamp">) => Promise<SymptomEntry>;
  clearAllEntries: () => Promise<void>;
  injectSyntheticDemoData: (scenario: "stable" | "escalation") => Promise<void>;
  clearDemoEntries: () => Promise<void>;
}

export const useSymptomStore = create<SymptomState>((set, get) => ({
  entries: [],
  isLoading: false,
  error: null,
  assessment: {
    state: "NORMAL",
    reason: "No entries yet.",
    suggestedAction: "CONTINUE",
    contributingFactors: [],
  },
  prediction: {
    hasSufficientData: false,
    recommendation: "Not enough personal data yet.",
    contributingFactors: [],
    confidenceScore: 0,
    disclaimer: "",
  },

  loadEntries: async () => {
    set({ isLoading: true, error: null });
    try {
      const items = await loadSymptomsLocally();
      const assessment = assessCognitiveLoad(items);
      const prediction = predictCognitiveFatigue(items);
      set({ entries: items, assessment, prediction, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || "Failed to load entries", isLoading: false });
    }
  },

  addEntry: async (entryInput) => {
    // Check for red flags in notes or ratings
    const redFlagCheck = evaluateRedFlags(entryInput.note, {
      headache: entryInput.headache,
    });

    if (redFlagCheck.isRedFlag && redFlagCheck.alert) {
      useSettingsStore.getState().triggerRedFlag(redFlagCheck.alert);
    }

    const newEntry: SymptomEntry = {
      ...entryInput,
      id: `sym_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
    };

    // Save with AES-GCM encryption in IndexedDB
    await saveSymptomLocally(newEntry, true);

    const updatedEntries = [...get().entries, newEntry];
    const assessment = assessCognitiveLoad(updatedEntries);
    const prediction = predictCognitiveFatigue(updatedEntries);

    set({
      entries: updatedEntries,
      assessment,
      prediction,
    });

    return newEntry;
  },

  clearAllEntries: async () => {
    await wipeAllLocalData();
    set({
      entries: [],
      assessment: {
        state: "NORMAL",
        reason: "All local data reset.",
        suggestedAction: "CONTINUE",
        contributingFactors: [],
      },
      prediction: {
        hasSufficientData: false,
        recommendation: "Not enough personal data yet.",
        contributingFactors: [],
        confidenceScore: 0,
        disclaimer: "",
      },
    });
  },

  injectSyntheticDemoData: async (scenario) => {
    const now = Date.now();
    const oneHour = 3600 * 1000;
    const oneDay = 24 * oneHour;

    let synthetic: SymptomEntry[] = [];

    if (scenario === "stable") {
      // 5 days of calm, gentle ratings
      synthetic = [
        {
          id: `demo_s1_${now}`,
          timestamp: new Date(now - 4 * oneDay).toISOString(),
          headache: 2,
          sensorySensitivity: 2,
          cognitiveFatigue: 2,
          mood: "calm",
          note: "[DEMO] Rested well, walked in shade",
          source: "demo",
          isDemo: true,
        },
        {
          id: `demo_s2_${now}`,
          timestamp: new Date(now - 3 * oneDay).toISOString(),
          headache: 2,
          sensorySensitivity: 1,
          cognitiveFatigue: 2,
          mood: "calm",
          note: "[DEMO] Low screen day, steady pacing",
          source: "demo",
          isDemo: true,
        },
        {
          id: `demo_s3_${now}`,
          timestamp: new Date(now - 2 * oneDay).toISOString(),
          headache: 1,
          sensorySensitivity: 2,
          cognitiveFatigue: 2,
          mood: "okay",
          note: "[DEMO] Audiobooks only",
          source: "demo",
          isDemo: true,
        },
        {
          id: `demo_s4_${now}`,
          timestamp: new Date(now - 1 * oneDay).toISOString(),
          headache: 2,
          sensorySensitivity: 1,
          cognitiveFatigue: 1,
          mood: "calm",
          note: "[DEMO] Gentle morning breathing",
          source: "demo",
          isDemo: true,
        },
      ];
    } else {
      // Escalating fatigue scenario (triggering COGNITIVE_LOAD_HIGH)
      synthetic = [
        {
          id: `demo_e1_${now}`,
          timestamp: new Date(now - 3 * oneHour).toISOString(),
          headache: 2,
          sensorySensitivity: 2,
          cognitiveFatigue: 2,
          mood: "okay",
          note: "[DEMO] Baseline check before reading email",
          source: "demo",
          isDemo: true,
        },
        {
          id: `demo_e2_${now}`,
          timestamp: new Date(now - 1 * oneHour).toISOString(),
          headache: 3,
          sensorySensitivity: 3,
          cognitiveFatigue: 3,
          mood: "frustrated",
          note: "[DEMO] Started feeling mental strain during call",
          source: "demo",
          isDemo: true,
        },
        {
          id: `demo_e3_${now}`,
          timestamp: new Date().toISOString(),
          headache: 4,
          sensorySensitivity: 4,
          cognitiveFatigue: 4,
          mood: "overwhelmed",
          note: "[DEMO] Rapid fatigue escalation, needs immediate dark rest",
          source: "demo",
          isDemo: true,
        },
      ];
    }

    for (const item of synthetic) {
      await saveSymptomLocally(item, true);
    }

    const current = get().entries.filter((e) => !e.isDemo);
    const combined = [...current, ...synthetic];
    const assessment = assessCognitiveLoad(combined);
    const prediction = predictCognitiveFatigue(combined);

    set({ entries: combined, assessment, prediction });
  },

  clearDemoEntries: async () => {
    await clearDemoDataLocally();
    const realEntries = get().entries.filter((e) => !e.isDemo);
    const assessment = assessCognitiveLoad(realEntries);
    const prediction = predictCognitiveFatigue(realEntries);
    set({ entries: realEntries, assessment, prediction });
  },
}));
