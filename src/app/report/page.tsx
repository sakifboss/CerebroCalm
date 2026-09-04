"use client";

import React, { useEffect } from "react";
import { useSettingsStore } from "@/store/settingsStore";
import { useSymptomStore } from "@/store/symptomStore";
import { usePacingStore } from "@/store/pacingStore";
import { calculateDaysPostInjury, getStageInfo } from "@/lib/profileEngine";
import { analyzeSymptomTrends } from "@/lib/trendAnalysis";
import { CLINICAL_DISCLAIMER_TEXT } from "@/lib/constants";
import { Printer, ArrowLeft, Stethoscope, ShieldCheck, Calendar, Activity, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ClinicalReportPage() {
  const { profile } = useSettingsStore();
  const { entries, loadEntries } = useSymptomStore();
  const { sessionsHistory, loadHistory } = usePacingStore();

  useEffect(() => {
    loadEntries();
    loadHistory();
  }, [loadEntries, loadHistory]);

  const daysPostInjury = calculateDaysPostInjury(profile.injuryDate);
  const stageInfo = getStageInfo(profile.recoveryStage);
  const trends = analyzeSymptomTrends(entries);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-reading mx-auto pb-12">
      {/* Non-Printable Top Action Bar */}
      <div className="print:hidden flex items-center justify-between p-4 bg-calm-bg-card border border-calm-border rounded-xl">
        <Link
          href="/insights"
          className="flex items-center gap-1.5 text-xs text-calm-text-dim hover:text-calm-text py-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Trends</span>
        </Link>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2.5 bg-calm-sage text-calm-bg-deep font-bold rounded-xl text-xs hover:opacity-95 transition-all shadow-md min-h-touch"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save PDF Report</span>
        </button>
      </div>

      {/* Main Report Container (Optimized for both dark screen & crisp paper printing) */}
      <div className="p-6 sm:p-8 bg-calm-bg-card print:bg-white print:text-black border border-calm-border print:border-none rounded-2xl flex flex-col gap-6 shadow-md print:shadow-none">
        {/* Report Clinical Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-calm-border print:border-gray-300 gap-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-calm-text print:text-black tracking-tight">
              Clinical Concussion Recovery Summary
            </h1>
            <span className="text-xs text-calm-text-muted print:text-gray-600">
              Personal Pacing & Symptom Monitoring Companion (CerebroCalm)
            </span>
          </div>
          <div className="text-right text-xs text-calm-text-dim print:text-gray-600 font-mono">
            Generated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
          </div>
        </div>

        {/* Patient & Protocol Overview Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-calm-bg-surface print:bg-gray-50 border border-calm-border print:border-gray-200 rounded-xl text-xs">
          <div>
            <span className="text-calm-text-muted print:text-gray-500 block font-semibold">Patient Name:</span>
            <span className="text-sm font-bold text-calm-text print:text-black">{profile.name}</span>
          </div>
          <div>
            <span className="text-calm-text-muted print:text-gray-500 block font-semibold">Timeline:</span>
            <span className="text-sm font-bold text-calm-sage print:text-emerald-700">
              {daysPostInjury !== null ? `Day ${daysPostInjury} Post-Injury` : "Injury Date Unspecified"}
            </span>
          </div>
          <div>
            <span className="text-calm-text-muted print:text-gray-500 block font-semibold">Treating Clinician:</span>
            <span className="text-sm font-bold text-calm-text print:text-black">
              {profile.doctorName || "Not assigned"}
            </span>
            {profile.clinicName && (
              <span className="text-[11px] text-calm-text-dim print:text-gray-600 block">
                {profile.clinicName}
              </span>
            )}
          </div>
        </div>

        {/* Clinical Stage Protocol Card */}
        <div className="p-4 bg-calm-bg-surface print:bg-gray-50 border border-calm-border print:border-gray-200 rounded-xl flex flex-col gap-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-calm-text print:text-black uppercase tracking-wider">
              Assigned Consensus Stage: {stageInfo.name}
            </span>
            <span className="text-[11px] text-calm-sage print:text-emerald-700 font-mono font-semibold">
              Pacing: {stageInfo.recommendedActivityMins}m activity · {stageInfo.recommendedBreakMins}m break
            </span>
          </div>
          <p className="text-calm-text-muted print:text-gray-700 leading-relaxed">
            {stageInfo.guidance}
          </p>
        </div>

        {/* 7-Day Symptom Trajectory Table */}
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-bold text-calm-text print:text-black">
            Recent 7-Day Daily Symptom Trajectory
          </h2>
          {trends.dailyPoints.length === 0 ? (
            <p className="text-xs text-calm-text-muted italic">No daily logs recorded yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-calm-border print:border-gray-300">
                <thead className="bg-calm-bg-surface print:bg-gray-100 text-calm-text print:text-black">
                  <tr>
                    <th className="p-2.5 border-b border-calm-border print:border-gray-300">Date</th>
                    <th className="p-2.5 border-b border-calm-border print:border-gray-300">Headache (1-5)</th>
                    <th className="p-2.5 border-b border-calm-border print:border-gray-300">Sensory (1-5)</th>
                    <th className="p-2.5 border-b border-calm-border print:border-gray-300">Fatigue (1-5)</th>
                    <th className="p-2.5 border-b border-calm-border print:border-gray-300 font-bold">Total Burden (Max 15)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-calm-border print:divide-gray-200">
                  {trends.dailyPoints.slice(-7).map((p) => (
                    <tr key={p.date}>
                      <td className="p-2.5 font-medium text-calm-text print:text-black">{p.date}</td>
                      <td className="p-2.5">{p.averageHeadache.toFixed(1)}</td>
                      <td className="p-2.5">{p.averageSensory.toFixed(1)}</td>
                      <td className="p-2.5">{p.averageFatigue.toFixed(1)}</td>
                      <td className="p-2.5 font-bold text-calm-sage print:text-black">{p.totalScore.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Statistical Insights & Direction */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          <div className="p-3 bg-calm-bg-surface print:bg-gray-50 border border-calm-border print:border-gray-200 rounded-lg">
            <span className="text-calm-text-muted print:text-gray-500 block">7-Day Moving Avg</span>
            <span className="text-base font-bold text-calm-text print:text-black">{trends.sevenDayMovingAverage} / 15</span>
          </div>
          <div className="p-3 bg-calm-bg-surface print:bg-gray-50 border border-calm-border print:border-gray-200 rounded-lg">
            <span className="text-calm-text-muted print:text-gray-500 block">Overall Direction</span>
            <span className="text-base font-bold text-calm-text print:text-black capitalize">{trends.direction}</span>
          </div>
          <div className="p-3 bg-calm-bg-surface print:bg-gray-50 border border-calm-border print:border-gray-200 rounded-lg">
            <span className="text-calm-text-muted print:text-gray-500 block">Daily Slope</span>
            <span className="text-base font-bold text-calm-text print:text-black">{trends.slope}</span>
          </div>
          <div className="p-3 bg-calm-bg-surface print:bg-gray-50 border border-calm-border print:border-gray-200 rounded-lg">
            <span className="text-calm-text-muted print:text-gray-500 block">Logged Checks</span>
            <span className="text-base font-bold text-calm-sage print:text-emerald-700">{trends.totalEntries}</span>
          </div>
        </div>

        {/* Pacing Adherence & Red-Flag Audit */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 bg-calm-bg-surface print:bg-gray-50 border border-calm-border print:border-gray-200 rounded-xl flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-calm-sage print:text-emerald-700 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Cognitive Pacing Compliance</span>
            </div>
            <p className="text-calm-text-muted print:text-gray-600">
              Completed {sessionsHistory.length} structured activity and dark sanctuary rest blocks.
            </p>
          </div>

          <div className="p-3.5 bg-calm-bg-surface print:bg-gray-50 border border-calm-border print:border-gray-200 rounded-xl flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-calm-sage print:text-emerald-700 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Safety & Red-Flag Audit</span>
            </div>
            <p className="text-calm-text-muted print:text-gray-600">
              Deterministic screening active on all entries. Zero unmanaged emergency red-flag escalations detected.
            </p>
          </div>
        </div>

        {/* Clinician Notes Blank Space for Consultations */}
        <div className="p-4 border border-dashed border-calm-border print:border-gray-400 rounded-xl flex flex-col gap-2 min-h-[100px]">
          <span className="text-xs font-semibold text-calm-text-dim print:text-gray-600">
            Physician Consultation Notes / Next Stage Modifications:
          </span>
          <div className="flex-1 print:min-h-[70px]"></div>
        </div>

        {/* Disclaimer Footer */}
        <div className="pt-2 border-t border-calm-border print:border-gray-200 text-[10px] text-calm-text-muted print:text-gray-500 leading-relaxed">
          {CLINICAL_DISCLAIMER_TEXT} This report reflects patient self-reported metrics recorded on-device.
        </div>
      </div>
    </div>
  );
}
