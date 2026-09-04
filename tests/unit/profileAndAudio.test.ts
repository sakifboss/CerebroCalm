import { describe, it, expect } from "vitest";
import { calculateDaysPostInjury, getStageInfo } from "@/lib/profileEngine";
import { RECOVERY_STAGES } from "@/lib/constants";
import { startBrownNoise, stopBrownNoise, playCalmChime } from "@/lib/audioGenerator";

describe("Patient Profile & Clinical Stages", () => {
  it("calculates days post-injury accurately", () => {
    const today = new Date();
    const targetDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5);
    const yyyy = targetDate.getFullYear();
    const mm = String(targetDate.getMonth() + 1).padStart(2, "0");
    const dd = String(targetDate.getDate()).padStart(2, "0");
    const fiveDaysAgo = `${yyyy}-${mm}-${dd}`;

    const days = calculateDaysPostInjury(fiveDaysAgo);
    expect(days).toBe(5);
  });

  it("handles empty or missing injury date gracefully", () => {
    expect(calculateDaysPostInjury(undefined)).toBeNull();
    expect(calculateDaysPostInjury("")).toBeNull();
  });

  it("retrieves standard clinical return-to-activity stages", () => {
    const stage1 = getStageInfo(1);
    expect(stage1.name).toContain("Stage 1");
    expect(stage1.recommendedActivityMins).toBe(10);
    expect(stage1.recommendedBreakMins).toBe(5);

    const stage3 = getStageInfo(3);
    expect(stage3.recommendedActivityMins).toBe(20);
  });

  it("ensures all 5 clinical stages have valid non-zero parameters", () => {
    expect(RECOVERY_STAGES.length).toBe(5);
    for (const s of RECOVERY_STAGES) {
      expect(s.recommendedActivityMins).toBeGreaterThan(0);
      expect(s.recommendedBreakMins).toBeGreaterThan(0);
      expect(s.guidance.length).toBeGreaterThan(10);
    }
  });

  it("handles audio generation safely in test environments", () => {
    // Should not throw even in jsdom where Web Audio might be mock or absent
    expect(() => stopBrownNoise()).not.toThrow();
    expect(() => playCalmChime()).not.toThrow();
  });
});
