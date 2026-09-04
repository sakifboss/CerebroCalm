import { z } from "zod";
import { CLINICAL_DISCLAIMER_TEXT } from "./constants";

export const SymptomScaleSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
]);

export const MoodSchema = z.enum([
  "calm",
  "okay",
  "frustrated",
  "overwhelmed",
  "anxious",
  "exhausted",
]);

export const SymptomEntrySchema = z.object({
  id: z.string().min(1),
  timestamp: z.string().datetime({ offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}T/)),
  headache: SymptomScaleSchema,
  sensorySensitivity: SymptomScaleSchema,
  cognitiveFatigue: SymptomScaleSchema,
  mood: MoodSchema,
  note: z.string().max(300).optional(),
  source: z.enum(["manual", "voice", "demo"]),
  isDemo: z.boolean().optional(),
});

export const PacingSessionSchema = z.object({
  id: z.string().min(1),
  startTime: z.string(),
  endTime: z.string().optional(),
  plannedActivityMinutes: z.number().min(1).max(120),
  plannedBreakMinutes: z.number().min(1).max(60),
  actualActivitySeconds: z.number().min(0),
  actualBreakSeconds: z.number().min(0),
  symptomBefore: z
    .object({
      headache: SymptomScaleSchema,
      cognitiveFatigue: SymptomScaleSchema,
    })
    .optional(),
  symptomAfter: z
    .object({
      headache: SymptomScaleSchema,
      cognitiveFatigue: SymptomScaleSchema,
    })
    .optional(),
  status: z.enum(["idle", "active", "break", "paused", "completed"]),
  notes: z.string().max(300).optional(),
});

export const AIResponseSchema = z.object({
  message: z.string().min(1),
  action: z.string().min(1),
  urgency: z.enum(["normal", "caution", "urgent"]),
  disclaimer: z.string().min(1),
  safetyPassed: z.boolean().default(true),
});

export type ValidatedSymptomEntry = z.infer<typeof SymptomEntrySchema>;
export type ValidatedPacingSession = z.infer<typeof PacingSessionSchema>;
export type ValidatedAIResponse = z.infer<typeof AIResponseSchema>;

export function validateSymptomEntry(data: unknown): ValidatedSymptomEntry {
  return SymptomEntrySchema.parse(data);
}

export function safeParseSymptomEntry(data: unknown) {
  return SymptomEntrySchema.safeParse(data);
}
