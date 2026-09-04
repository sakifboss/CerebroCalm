import { PatientProfile, RecoveryStage } from "@/types/user";
import { RECOVERY_STAGES } from "./constants";

export function calculateDaysPostInjury(injuryDate?: string): number | null {
  if (!injuryDate || !injuryDate.trim()) return null;
  try {
    const parts = injuryDate.slice(0, 10).split("-").map(Number);
    if (parts.length < 3 || isNaN(parts[0]) || isNaN(parts[1]) || isNaN(parts[2])) {
      return null;
    }
    const injuryUtc = Date.UTC(parts[0], parts[1] - 1, parts[2]);
    const now = new Date();
    const todayUtc = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());

    const diffTime = todayUtc - injuryUtc;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 ? diffDays : 0;
  } catch (e) {
    return null;
  }
}

export function getStageInfo(stage: RecoveryStage) {
  return (
    RECOVERY_STAGES.find((s) => s.stage === stage) || RECOVERY_STAGES[0]
  );
}

export const DEFAULT_PATIENT_PROFILE: PatientProfile = {
  name: "",
  injuryDate: "",
  recoveryStage: 2,
  doctorName: "",
  doctorPhone: "",
  clinicName: "",
  hasCompletedOnboarding: false,
};
