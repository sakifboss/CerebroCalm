import { NextRequest, NextResponse } from "next/server";
import { evaluateRedFlags, validateAIOutput, getSafeFallbackResponse, RESPONSIBLE_AI_SYSTEM_PROMPT } from "@/lib/safetyGuardrails";
import { CLINICAL_DISCLAIMER_TEXT } from "@/lib/constants";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, recentFatigue, recentHeadache } = body;

    // 1. DETERMINISTIC SAFETY GATE: Evaluate red flags before any AI logic
    const redFlagResult = evaluateRedFlags(message, {
      headache: recentHeadache,
    });

    if (redFlagResult.isRedFlag && redFlagResult.alert) {
      return NextResponse.json({
        message:
          "Emergency warning signs detected. Deterministic safety guardrails have superseded AI assistance. Please seek urgent medical evaluation.",
        action: "Call 911 or visit the nearest emergency facility immediately.",
        urgency: "urgent",
        disclaimer: CLINICAL_DISCLAIMER_TEXT,
        safetyPassed: false,
        emergencyAlert: redFlagResult.alert,
      });
    }

    // 2. Data Minimization: Do not store or forward IP, user identifiers, or raw histories
    const apiKey = process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Offline / Local Heuristic Safe Coach (Works with zero cloud dependencies)
      const isFatigued = (recentFatigue || 0) >= 3 || (recentHeadache || 0) >= 3;
      const rawFallback = {
        message: isFatigued
          ? "Your recent ratings suggest cognitive fatigue is accumulating. Following your clinician's pacing limits and taking sensory rest helps avoid symptom flare-ups."
          : "Pacing consistently during periods of lower symptoms helps maintain stability. Remember to rest before fatigue develops.",
        action: isFatigued
          ? "Pause complex tasks and take a 5 to 10-minute break in Dark Sanctuary."
          : "Continue with clinician-guided light activities.",
        urgency: isFatigued ? "caution" : "normal",
        disclaimer: CLINICAL_DISCLAIMER_TEXT,
        safetyPassed: true,
      };

      const validated = validateAIOutput(rawFallback);
      return NextResponse.json(validated);
    }

    // If API key is present in future deployment, external LLM call would be executed here
    // with RESPONSIBLE_AI_SYSTEM_PROMPT, and then piped through validateAIOutput.
    const safeOutput = getSafeFallbackResponse();
    return NextResponse.json(validateAIOutput(safeOutput));
  } catch (error: any) {
    return NextResponse.json(getSafeFallbackResponse(), { status: 200 });
  }
}
