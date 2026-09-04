import { SymptomScale, MoodType } from "@/types/symptom";

export interface ParsedVoiceSymptom {
  headache?: SymptomScale;
  sensorySensitivity?: SymptomScale;
  cognitiveFatigue?: SymptomScale;
  mood?: MoodType;
  rawTranscript: string;
  confidence: number;
  isAmbiguous: boolean;
  notes?: string;
}

/**
 * Checks whether the browser supports Web Speech API
 */
export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === "undefined") return false;
  return "webkitSpeechRecognition" in window || "SpeechRecognition" in window;
}

/**
 * Deterministic NLP parser for symptom voice transcripts
 * Extracts ratings (1-5) and mood states from spoken utterances.
 */
export function parseVoiceTranscript(transcript: string): ParsedVoiceSymptom {
  const text = transcript.toLowerCase();
  const result: ParsedVoiceSymptom = {
    rawTranscript: transcript,
    confidence: 0.5,
    isAmbiguous: false,
  };

  // Helper to find numbers following keywords
  const extractScale = (keywords: string[]): SymptomScale | undefined => {
    for (const kw of keywords) {
      const idx = text.indexOf(kw);
      if (idx !== -1) {
        // Look at substring after keyword
        const slice = text.slice(idx, idx + 40);
        // Match numbers 1-5 either as digits or words
        const match = slice.match(/\b([1-5]|one|two|three|four|five)\b/);
        if (match) {
          const val = match[1];
          switch (val) {
            case "1":
            case "one":
              return 1;
            case "2":
            case "two":
              return 2;
            case "3":
            case "three":
              return 3;
            case "4":
            case "four":
              return 4;
            case "5":
            case "five":
              return 5;
          }
        }
      }
    }
    return undefined;
  };

  // Extract Headache rating
  result.headache = extractScale(["headache", "head is", "head pain", "head"]);

  // Extract Sensory sensitivity
  result.sensorySensitivity = extractScale([
    "sensitivity",
    "sensory",
    "light",
    "sound",
    "noise",
    "lights",
  ]);

  // Extract Cognitive fatigue / brain fog
  result.cognitiveFatigue = extractScale([
    "fog",
    "brain fog",
    "fatigue",
    "foggy",
    "exhaustion",
    "concentration",
  ]);

  // Mood detection
  if (text.includes("calm") || text.includes("peaceful") || text.includes("relaxed")) {
    result.mood = "calm";
  } else if (text.includes("overwhelmed") || text.includes("too much")) {
    result.mood = "overwhelmed";
  } else if (text.includes("frustrated") || text.includes("annoyed")) {
    result.mood = "frustrated";
  } else if (text.includes("exhausted") || text.includes("wiped out")) {
    result.mood = "exhausted";
  } else if (text.includes("anxious") || text.includes("worried")) {
    result.mood = "anxious";
  } else if (text.includes("okay") || text.includes("fine") || text.includes("alright")) {
    result.mood = "okay";
  }

  // Determine ambiguity
  const detectedCount = [
    result.headache,
    result.sensorySensitivity,
    result.cognitiveFatigue,
    result.mood,
  ].filter((v) => v !== undefined).length;

  if (detectedCount === 0) {
    result.isAmbiguous = true;
    result.confidence = 0.2;
  } else if (detectedCount >= 2) {
    result.isAmbiguous = false;
    result.confidence = 0.9;
  } else {
    // Single item detected: still requires user confirmation
    result.isAmbiguous = true;
    result.confidence = 0.6;
  }

  return result;
}

/**
 * Creates and wraps Web Speech Recognition instance
 */
export function createSpeechRecognizer(
  onResult: (parsed: ParsedVoiceSymptom) => void,
  onError: (errorMsg: string) => void,
  onEnd: () => void
): { start: () => void; stop: () => void } | null {
  if (!isSpeechRecognitionSupported()) {
    onError("Speech recognition is not supported in this browser. Please use the quick tactile buttons.");
    return null;
  }

  // @ts-ignore
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.continuous = false; // Never record continuously
  recognition.interimResults = false;
  recognition.lang = "en-US";
  recognition.maxAlternatives = 1;

  recognition.onresult = (event: any) => {
    if (event.results && event.results[0] && event.results[0][0]) {
      const transcript = event.results[0][0].transcript;
      const parsed = parseVoiceTranscript(transcript);
      onResult(parsed);
    }
  };

  recognition.onerror = (event: any) => {
    onError(`Speech error: ${event.error || "Could not capture audio clearly."}`);
  };

  recognition.onend = () => {
    onEnd();
  };

  return {
    start: () => {
      try {
        recognition.start();
      } catch (err) {
        console.warn("Speech recognition already active or permission denied.", err);
      }
    },
    stop: () => {
      try {
        recognition.stop();
      } catch (err) {
        // Ignore
      }
    },
  };
}
