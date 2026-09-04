"use client";

import React from "react";
import { useSettingsStore } from "@/store/settingsStore";
import { calculateDaysPostInjury, getStageInfo } from "@/lib/profileEngine";
import { CLINICAL_DISCLAIMER_TEXT } from "@/lib/constants";
import { Printer, ArrowLeft, Building2, GraduationCap, CheckCircle2, Stethoscope } from "lucide-react";
import Link from "next/link";

export default function AccommodationsPage() {
  const { profile } = useSettingsStore();
  const daysPostInjury = calculateDaysPostInjury(profile.injuryDate);
  const stageInfo = getStageInfo(profile.recoveryStage);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-reading mx-auto pb-12">
      {/* Top Action Bar */}
      <div className="print:hidden flex items-center justify-between p-4 bg-calm-bg-card border border-calm-border rounded-xl">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs text-calm-text-dim hover:text-calm-text py-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2.5 bg-calm-sage text-calm-bg-deep font-bold rounded-xl text-xs hover:opacity-95 transition-all shadow-md min-h-touch"
        >
          <Printer className="w-4 h-4" />
          <span>Print Accommodation Letter</span>
        </button>
      </div>

      {/* Main Letter Container */}
      <div className="p-6 sm:p-10 bg-calm-bg-card print:bg-white print:text-black border border-calm-border print:border-none rounded-2xl flex flex-col gap-6 shadow-md print:shadow-none font-sans text-xs sm:text-sm">
        {/* Letter Head */}
        <div className="flex flex-col pb-4 border-b border-calm-border print:border-gray-300 gap-1">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-calm-sage print:text-emerald-800">
                Medical & Neuro-Recovery Accommodation Notice
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-calm-text print:text-black mt-1">
                Academic & Workplace Concussion Accommodations
              </h1>
            </div>
            <span className="text-xs text-calm-text-muted print:text-gray-600 font-mono">
              Date: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </span>
          </div>
          <span className="text-xs text-calm-text-dim print:text-gray-600">
            Reference: Clinical Return-to-Learn & Return-to-Work Consensus Protocol
          </span>
        </div>

        {/* Recipient Greeting */}
        <div className="flex flex-col gap-2 leading-relaxed">
          <p className="font-semibold text-calm-text print:text-black">
            To: Academic Administration / Human Resources / Supervisors
          </p>
          <p className="text-calm-text-muted print:text-gray-800">
            This letter outlines recommended accommodations for <strong>{profile.name}</strong>, who is currently undergoing clinical recovery following a mild traumatic brain injury (concussion). The patient is currently at <strong>{daysPostInjury !== null ? `Day ${daysPostInjury}` : "Active Stage"}</strong> of rehabilitation under <strong>{stageInfo.name}</strong>.
          </p>
        </div>

        {/* Stage-Based Accommodations Grid */}
        <div className="p-4 bg-calm-bg-surface print:bg-gray-50 border border-calm-border print:border-gray-200 rounded-xl flex flex-col gap-3">
          <span className="font-bold text-calm-text print:text-black uppercase tracking-wider text-xs">
            Mandatory Pacing & Environmental Accommodations:
          </span>

          <ul className="space-y-2.5 text-calm-text print:text-gray-800 text-xs">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-calm-sage print:text-emerald-700 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Structured Cognitive Pacing:</strong> Permitted mandatory 5-minute low-stimulation rest breaks every {stageInfo.recommendedActivityMins} minutes of reading, computer work, or classroom instruction.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-calm-sage print:text-emerald-700 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Photophobia & Lighting Mitigation:</strong> Allowance to wear tinted / blue-light glasses or a brimmed cap indoors. Seating positioned away from overhead fluorescent lighting where possible.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-calm-sage print:text-emerald-700 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Workload & Testing Modifications:</strong> Exemption from prolonged high-stakes examinations (&gt;45 mins continuous) and permission for audio recording or lecture slide access.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-calm-sage print:text-emerald-700 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Sensory Noise Reduction:</strong> Permission to use noise-canceling headphones during quiet study or computer tasks in shared office environments.
              </span>
            </li>
          </ul>
        </div>

        {/* Clinical Contact & Endorsement */}
        <div className="pt-4 border-t border-calm-border print:border-gray-300 flex flex-col sm:flex-row justify-between gap-6">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-calm-text-muted print:text-gray-600 font-semibold">Treating Physician / Concussion Clinic:</span>
            <span className="font-bold text-calm-text print:text-black">{profile.doctorName || "Treating Physician"}</span>
            <span className="text-xs text-calm-text-dim print:text-gray-700">{profile.clinicName || "Concussion Rehabilitation Clinic"}</span>
            {profile.doctorPhone && (
              <span className="text-xs text-calm-text-dim print:text-gray-700">Direct Phone: {profile.doctorPhone}</span>
            )}
          </div>

          <div className="flex flex-col justify-end">
            <div className="w-48 border-b border-dashed border-calm-border print:border-gray-500 pb-1 text-center">
              <span className="text-[10px] text-calm-text-muted print:text-gray-500">Clinician Signature / Seal</span>
            </div>
          </div>
        </div>

        {/* Educational Notice */}
        <div className="pt-2 text-[10px] text-calm-text-muted print:text-gray-500 leading-relaxed border-t border-calm-border print:border-gray-200">
          {CLINICAL_DISCLAIMER_TEXT} Generated via CerebroCalm Concussion Recovery Suite.
        </div>
      </div>
    </div>
  );
}
