import { describe, it, expect } from "vitest";
import {
  calculateTimerProgress,
  sanitizePacingMinutes,
  getDefaultPacingConfig,
} from "@/lib/pacingEngine";

describe("Pacing Engine Calculations", () => {
  it("provides safe default pacing configuration", () => {
    const config = getDefaultPacingConfig();
    expect(config.activityMinutes).toBe(15);
    expect(config.breakMinutes).toBe(5);
  });

  it("calculates timer progress accurately", () => {
    // 15 minutes = 900 seconds. 450 seconds elapsed = 50%
    const progress = calculateTimerProgress(450, 15);
    expect(progress.percentage).toBe(50);
    expect(progress.remainingSeconds).toBe(450);
    expect(progress.formattedRemaining).toBe("07:30");
    expect(progress.isComplete).toBe(false);
  });

  it("handles timer completion correctly", () => {
    const progress = calculateTimerProgress(900, 15);
    expect(progress.percentage).toBe(100);
    expect(progress.remainingSeconds).toBe(0);
    expect(progress.formattedRemaining).toBe("00:00");
    expect(progress.isComplete).toBe(true);
  });

  it("sanitizes pacing minutes to prevent dangerous extremes", () => {
    // Activity should clamp between 5 and 60
    expect(sanitizePacingMinutes(2, "activity")).toBe(5);
    expect(sanitizePacingMinutes(120, "activity")).toBe(60);
    expect(sanitizePacingMinutes(25, "activity")).toBe(25);

    // Break should clamp between 2 and 30
    expect(sanitizePacingMinutes(0, "break")).toBe(2);
    expect(sanitizePacingMinutes(60, "break")).toBe(30);
    expect(sanitizePacingMinutes(10, "break")).toBe(10);
  });
});
