/**
 * CerebroCalm Screenless Speech Synthesis Module
 * Provides gentle, low-speed voice guidance for patients with severe photophobia.
 * Runs 100% on-device via Web Speech API (zero cloud audio transmission).
 */

export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function stopSpeaking(): void {
  if (isSpeechSynthesisSupported()) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {
      // Ignore
    }
  }
}

export function speakText(
  text: string,
  options?: {
    rate?: number;
    pitch?: number;
    volume?: number;
    onEnd?: () => void;
  }
): boolean {
  if (!isSpeechSynthesisSupported()) return false;

  try {
    window.speechSynthesis.cancel(); // Stop any pending utterances

    const utterance = new SpeechSynthesisUtterance(text);
    // Unhurried, low-glare auditory pacing
    utterance.rate = options?.rate ?? 0.85;
    utterance.pitch = options?.pitch ?? 0.95;
    utterance.volume = options?.volume ?? 0.8;

    if (options?.onEnd) {
      utterance.onend = options.onEnd;
    }

    // Try to pick a soothing voice if available
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(
      (v) => v.lang.startsWith("en") && (v.name.includes("Natural") || v.name.includes("Samantha") || v.name.includes("Daniel") || v.name.includes("Google"))
    ) || voices.find((v) => v.lang.startsWith("en"));

    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.warn("Speech synthesis could not speak:", err);
    return false;
  }
}
