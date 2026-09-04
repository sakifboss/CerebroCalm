import { describe, it, expect } from "vitest";
import { parseVoiceTranscript } from "@/lib/voice";

describe("Voice Input NLP Parser", () => {
  it("correctly extracts numerical ratings for headache and sensory sensitivity", () => {
    const transcript = "My headache is 3 and light sensitivity is 4";
    const result = parseVoiceTranscript(transcript);

    expect(result.headache).toBe(3);
    expect(result.sensorySensitivity).toBe(4);
    expect(result.confidence).toBeGreaterThan(0.7);
    expect(result.isAmbiguous).toBe(false);
  });

  it("handles word numbers like 'two' and 'four'", () => {
    const transcript = "My head pain is two and brain fog is four";
    const result = parseVoiceTranscript(transcript);

    expect(result.headache).toBe(2);
    expect(result.cognitiveFatigue).toBe(4);
  });

  it("detects mood keywords accurately", () => {
    const transcript = "Headache 1, feeling calm";
    const result = parseVoiceTranscript(transcript);

    expect(result.headache).toBe(1);
    expect(result.mood).toBe("calm");
  });

  it("flags ambiguous or unrecognized speech for explicit confirmation", () => {
    const ambiguousTranscript = "I don't really know maybe later";
    const result = parseVoiceTranscript(ambiguousTranscript);

    expect(result.isAmbiguous).toBe(true);
    expect(result.confidence).toBeLessThan(0.5);
    expect(result.headache).toBeUndefined();
  });
});
