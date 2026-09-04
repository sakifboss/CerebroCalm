import { create } from "zustand";
import { PacingSession, PacingStatus } from "@/types/pacing";
import { savePacingSessionLocally, loadPacingSessionsLocally } from "@/lib/storage";

interface PacingState {
  currentSession: PacingSession | null;
  status: PacingStatus;
  secondsRemaining: number;
  totalSeconds: number;
  isSanctuaryActive: boolean;
  sessionsHistory: PacingSession[];

  startActivity: (minutes: number) => void;
  startBreak: (minutes: number) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  tick: () => void;
  endSession: () => Promise<void>;
  openSanctuary: () => void;
  closeSanctuary: () => void;
  loadHistory: () => Promise<void>;
}

export const usePacingStore = create<PacingState>((set, get) => ({
  currentSession: null,
  status: "idle",
  secondsRemaining: 15 * 60,
  totalSeconds: 15 * 60,
  isSanctuaryActive: false,
  sessionsHistory: [],

  startActivity: (minutes) => {
    const totalSeconds = Math.max(60, minutes * 60);
    const session: PacingSession = {
      id: `pace_${Date.now()}`,
      startTime: new Date().toISOString(),
      plannedActivityMinutes: minutes,
      plannedBreakMinutes: 5,
      actualActivitySeconds: 0,
      actualBreakSeconds: 0,
      status: "active",
    };

    set({
      currentSession: session,
      status: "active",
      secondsRemaining: totalSeconds,
      totalSeconds: totalSeconds,
      isSanctuaryActive: false,
    });
  },

  startBreak: (minutes) => {
    const totalSeconds = Math.max(60, minutes * 60);
    const current = get().currentSession;
    if (current) {
      current.status = "break";
    }

    set({
      status: "break",
      secondsRemaining: totalSeconds,
      totalSeconds: totalSeconds,
      isSanctuaryActive: true, // Automatically open dark sanctuary during breaks
    });
  },

  pauseTimer: () => {
    set((state) => ({
      status: "paused",
      currentSession: state.currentSession
        ? { ...state.currentSession, status: "paused" }
        : null,
    }));
  },

  resumeTimer: () => {
    set((state) => ({
      status: "active",
      currentSession: state.currentSession
        ? { ...state.currentSession, status: "active" }
        : null,
    }));
  },

  tick: () => {
    const { status, secondsRemaining, currentSession } = get();
    if (status !== "active" && status !== "break") return;

    if (secondsRemaining <= 1) {
      if (status === "active") {
        // Activity ended -> transition to break automatically
        const breakMins = currentSession?.plannedBreakMinutes || 5;
        get().startBreak(breakMins);
      } else {
        // Break ended
        get().endSession();
      }
    } else {
      set({ secondsRemaining: secondsRemaining - 1 });
      if (currentSession) {
        if (status === "active") {
          currentSession.actualActivitySeconds += 1;
        } else if (status === "break") {
          currentSession.actualBreakSeconds += 1;
        }
      }
    }
  },

  endSession: async () => {
    const { currentSession } = get();
    if (currentSession) {
      currentSession.endTime = new Date().toISOString();
      currentSession.status = "completed";
      await savePacingSessionLocally(currentSession);
      const history = await loadPacingSessionsLocally();
      set({
        currentSession: null,
        status: "idle",
        sessionsHistory: history,
        isSanctuaryActive: false,
      });
    } else {
      set({ status: "idle", isSanctuaryActive: false });
    }
  },

  openSanctuary: () => set({ isSanctuaryActive: true }),
  closeSanctuary: () => set({ isSanctuaryActive: false }),

  loadHistory: async () => {
    const history = await loadPacingSessionsLocally();
    set({ sessionsHistory: history });
  },
}));
