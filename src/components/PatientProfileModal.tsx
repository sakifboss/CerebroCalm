"use client";

import React, { useState } from "react";
import { useSettingsStore } from "@/store/settingsStore";
import { RECOVERY_STAGES } from "@/lib/constants";
import { RecoveryStage } from "@/types/user";
import { User, Calendar, Stethoscope, Phone, Building2, Check, Sparkles, X } from "lucide-react";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PatientProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { profile, updateProfile } = useSettingsStore();

  const [name, setName] = useState(profile.name);
  const [injuryDate, setInjuryDate] = useState(profile.injuryDate || "");
  const [recoveryStage, setRecoveryStage] = useState<RecoveryStage>(profile.recoveryStage);
  const [doctorName, setDoctorName] = useState(profile.doctorName || "");
  const [doctorPhone, setDoctorPhone] = useState(profile.doctorPhone || "");
  const [clinicName, setClinicName] = useState(profile.clinicName || "");
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: name.trim() || "Recovery Patient",
      injuryDate: injuryDate || undefined,
      recoveryStage,
      doctorName: doctorName.trim() || undefined,
      doctorPhone: doctorPhone.trim() || undefined,
      clinicName: clinicName.trim() || undefined,
      hasCompletedOnboarding: true,
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  const handleApplyDemoProfile = () => {
    setName("Alex Taylor");
    // 8 days ago
    const eightDaysAgo = new Date(Date.now() - 8 * 24 * 3600 * 1000).toISOString().slice(0, 10);
    setInjuryDate(eightDaysAgo);
    setRecoveryStage(2);
    setDoctorName("Dr. Marcus Thorne, Neurologist");
    setDoctorPhone("555-0144");
    setClinicName("Metro Concussion & Neuro Center");
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
    >
      <div className="w-full max-w-lg bg-calm-bg-card border border-calm-border rounded-2xl p-6 shadow-2xl flex flex-col gap-5 my-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-calm-sage-surface border border-calm-sage/30 text-calm-sage">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 id="profile-modal-title" className="text-lg font-bold text-calm-text">
                Patient Profile & Recovery Stage
              </h2>
              <span className="text-xs text-calm-text-muted">
                Private on-device profile · Zero cloud transmission
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-calm-text-muted hover:text-calm-text min-h-touch flex items-center justify-center"
            aria-label="Close profile dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demo Fast-Fill Button for Judges */}
        <button
          type="button"
          onClick={handleApplyDemoProfile}
          className="flex items-center justify-center gap-2 p-2.5 bg-calm-bg-surface hover:bg-calm-bg-elevated border border-calm-sage/40 rounded-xl text-xs font-semibold text-calm-sage transition-colors min-h-touch"
        >
          <Sparkles className="w-4 h-4" />
          <span>Auto-Fill Sample Clinical Profile (For Judges)</span>
        </button>

        <form onSubmit={handleSave} className="flex flex-col gap-4">
          {/* Patient Name */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="p-name" className="text-xs font-semibold text-calm-text">
              Preferred Name / Call Name
            </label>
            <input
              id="p-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex"
              className="p-3 bg-calm-bg-surface border border-calm-border rounded-xl text-sm text-calm-text focus:border-calm-sage focus:outline-none min-h-touch"
              required
            />
          </div>

          {/* Date of Injury */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="p-injury" className="text-xs font-semibold text-calm-text flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-calm-sage" />
              <span>Date of Concussion / Impact (Optional)</span>
            </label>
            <input
              id="p-injury"
              type="date"
              value={injuryDate}
              onChange={(e) => setInjuryDate(e.target.value)}
              className="p-3 bg-calm-bg-surface border border-calm-border rounded-xl text-sm text-calm-text focus:border-calm-sage focus:outline-none min-h-touch"
            />
            <span className="text-[11px] text-calm-text-muted">
              Used to calculate "Days Post-Injury" for clinician reports.
            </span>
          </div>

          {/* Recovery Stage Selector */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-calm-text">
              Current Return-to-Activity Stage (Consensus Protocol)
            </label>
            <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
              {RECOVERY_STAGES.map((s) => (
                <button
                  key={s.stage}
                  type="button"
                  onClick={() => setRecoveryStage(s.stage)}
                  className={`p-3 rounded-xl border text-left transition-colors flex flex-col gap-1 min-h-touch ${
                    recoveryStage === s.stage
                      ? "bg-calm-bg-elevated border-calm-sage text-calm-text"
                      : "bg-calm-bg-surface border-calm-border text-calm-text-dim hover:border-calm-border-focus"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-calm-text">{s.name}</span>
                    <span className="text-[10px] text-calm-sage font-mono">
                      {s.recommendedActivityMins}m on / {s.recommendedBreakMins}m rest
                    </span>
                  </div>
                  <span className="text-[11px] text-calm-text-muted leading-tight">
                    {s.shortDesc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Primary Doctor & Clinic Contact */}
          <div className="p-3.5 bg-calm-bg-surface border border-calm-border rounded-xl flex flex-col gap-3">
            <span className="text-xs font-bold text-calm-text uppercase tracking-wider flex items-center gap-1.5">
              <Stethoscope className="w-3.5 h-3.5 text-calm-sage" />
              <span>In Case of Emergency (ICE) Doctor Contact</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="flex flex-col gap-1">
                <label htmlFor="p-docname" className="text-[11px] text-calm-text-muted">Doctor / Neurologist Name</label>
                <input
                  id="p-docname"
                  type="text"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  placeholder="e.g. Dr. Vance, MD"
                  className="p-2 bg-calm-bg-card border border-calm-border rounded-lg text-xs text-calm-text focus:border-calm-sage focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="p-docphone" className="text-[11px] text-calm-text-muted">Direct Clinic Phone</label>
                <input
                  id="p-docphone"
                  type="tel"
                  value={doctorPhone}
                  onChange={(e) => setDoctorPhone(e.target.value)}
                  placeholder="e.g. 555-0199"
                  className="p-2 bg-calm-bg-card border border-calm-border rounded-lg text-xs text-calm-text focus:border-calm-sage focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-xl font-bold text-sm transition-all min-h-touch flex items-center justify-center gap-2 bg-calm-sage text-calm-bg-deep hover:opacity-95 shadow-md"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Profile Saved Securely</span>
              </>
            ) : (
              <span>Save Local Profile</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
