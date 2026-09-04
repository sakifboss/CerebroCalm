import { PacingConfig } from "@/types/pacing";
import { PACING_DEFAULTS } from "./constants";

export interface TimerProgress {
  totalSeconds: number;
  remainingSeconds: number;
  elapsedSeconds: number;
  percentage: number;
  formattedRemaining: string;
  isComplete: boolean;
}

export function getDefaultPacingConfig(): PacingConfig {
  return {
    activityMinutes: PACING_DEFAULTS.ACTIVITY_MINUTES,
    breakMinutes: PACING_DEFAULTS.BREAK_MINUTES,
    soundAlert: true,
    vibrationAlert: true,
    autoSanctuaryOnBreak: true,
  };
}

export function calculateTimerProgress(
  elapsedSeconds: number,
  targetMinutes: number
): TimerProgress {
  const totalSeconds = Math.max(1, targetMinutes * 60);
  const clampedElapsed = Math.min(totalSeconds, Math.max(0, elapsedSeconds));
  const remainingSeconds = Math.max(0, totalSeconds - clampedElapsed);
  const percentage = Math.round((clampedElapsed / totalSeconds) * 100);

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const formattedRemaining = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;

  return {
    totalSeconds,
    remainingSeconds,
    elapsedSeconds: clampedElapsed,
    percentage,
    formattedRemaining,
    isComplete: remainingSeconds === 0,
  };
}

/**
 * Validates configured pacing minutes within safe bounds
 */
export function sanitizePacingMinutes(
  minutes: number,
  type: "activity" | "break"
): number {
  if (type === "activity") {
    return Math.min(
      PACING_DEFAULTS.MAX_ACTIVITY_MINUTES,
      Math.max(PACING_DEFAULTS.MIN_ACTIVITY_MINUTES, Math.round(minutes))
    );
  }
  return Math.min(
    PACING_DEFAULTS.MAX_BREAK_MINUTES,
    Math.max(PACING_DEFAULTS.MIN_BREAK_MINUTES, Math.round(minutes))
  );
}
