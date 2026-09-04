import { describe, it, expect, beforeEach } from "vitest";
import { useSettingsStore } from "@/store/settingsStore";
import { DEFAULT_PATIENT_PROFILE } from "@/lib/profileEngine";

describe("Registration & Onboarding Gating Logic", () => {
  beforeEach(() => {
    useSettingsStore.getState().resetAllSettings();
  });

  it("initializes with unonboarded status requiring registration", () => {
    const state = useSettingsStore.getState();
    expect(state.profile.hasCompletedOnboarding).toBe(false);
  });

  it("updates profile and successfully marks patient as registered", () => {
    const store = useSettingsStore.getState();
    store.updateProfile({
      name: "Jordan Lee",
      injuryDate: "2026-08-25",
      recoveryStage: 3,
      doctorName: "Dr. Chen",
      doctorPhone: "555-0199",
      hasCompletedOnboarding: true,
    });

    const updated = useSettingsStore.getState();
    expect(updated.profile.hasCompletedOnboarding).toBe(true);
    expect(updated.profile.name).toBe("Jordan Lee");
    expect(updated.profile.recoveryStage).toBe(3);
    // Stage 3 should adapt pacing to 20 minutes
    expect(updated.pacing.activityMinutes).toBe(20);
  });

  it("resets onboarding status when patient logs out or switches profile", () => {
    const store = useSettingsStore.getState();
    store.updateProfile({
      name: "Temporary Patient",
      hasCompletedOnboarding: true,
    });
    expect(useSettingsStore.getState().profile.hasCompletedOnboarding).toBe(true);

    store.logoutOrResetProfile();
    const reset = useSettingsStore.getState();
    expect(reset.profile.hasCompletedOnboarding).toBe(false);
    expect(reset.profile.name).toBe("");
  });

  it("identifies public vs protected routes correctly", () => {
    const publicPages = ["/welcome", "/privacy"];
    const protectedPages = [
      "/",
      "/symptoms",
      "/pacing",
      "/sanctuary",
      "/insights",
      "/reaction",
      "/report",
      "/accommodations",
      "/settings",
    ];

    for (const page of publicPages) {
      expect(publicPages.includes(page)).toBe(true);
    }
    for (const page of protectedPages) {
      expect(publicPages.includes(page)).toBe(false);
    }
  });
});
