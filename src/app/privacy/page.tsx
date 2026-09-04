"use client";

import React, { useEffect, useState } from "react";
import { useSymptomStore } from "@/store/symptomStore";
import { usePacingStore } from "@/store/pacingStore";
import { ShieldCheck, Lock, HardDrive, Download, EyeOff, AlertTriangle } from "lucide-react";

export default function PrivacyPage() {
  const { entries, loadEntries } = useSymptomStore();
  const { sessionsHistory, loadHistory } = usePacingStore();
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    loadEntries();
    loadHistory();
  }, [loadEntries, loadHistory]);

  const handleExportData = () => {
    const exportData = {
      exportTimestamp: new Date().toISOString(),
      appName: "CerebroCalm",
      disclaimer: "Patient-exported personal recovery history. For clinician review.",
      symptoms: entries,
      pacingSessions: sessionsHistory,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cerebrocalm_export_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6 max-w-reading mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-1 text-center sm:text-left">
        <h1 className="text-xl sm:text-2xl font-bold text-calm-text">
          Privacy & Cryptography Architecture
        </h1>
        <p className="text-xs text-calm-text-muted leading-relaxed">
          How CerebroCalm protects sensitive recovery data using a local-first, zero-cloud baseline.
        </p>
      </div>

      {/* Local-First Architecture Badge */}
      <div className="p-5 bg-calm-bg-card border border-calm-border rounded-xl flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-calm-sage-surface border border-calm-sage/30 text-calm-sage">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-calm-text">
              On-Device AES-GCM 256-bit Encryption
            </h2>
            <span className="text-xs text-calm-text-muted">Web Crypto API (`crypto.subtle`)</span>
          </div>
        </div>

        <p className="text-xs text-calm-text leading-relaxed">
          Every symptom rating, timestamp, and context note is encrypted with a randomized 12-byte initialization vector (IV) directly in your browser before committing to IndexedDB.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
          <div className="p-3 bg-calm-bg-surface border border-calm-border rounded-lg text-xs">
            <span className="text-calm-text-muted block">Encrypted Records</span>
            <span className="text-base font-bold text-calm-sage">{entries.length}</span>
          </div>
          <div className="p-3 bg-calm-bg-surface border border-calm-border rounded-lg text-xs">
            <span className="text-calm-text-muted block">Cloud Transmission</span>
            <span className="text-base font-bold text-calm-text">0 Bytes (None)</span>
          </div>
          <div className="p-3 bg-calm-bg-surface border border-calm-border rounded-lg text-xs col-span-2 sm:col-span-1">
            <span className="text-calm-text-muted block">Telemetry Trackers</span>
            <span className="text-base font-bold text-calm-text">0 Trackers</span>
          </div>
        </div>
      </div>

      {/* Data Export Card */}
      <div className="p-5 bg-calm-bg-card border border-calm-border rounded-xl flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Download className="w-4 h-4 text-calm-sage" />
          <h2 className="text-sm font-semibold text-calm-text">
            Export Decrypted Records for Clinician
          </h2>
        </div>
        <p className="text-xs text-calm-text-muted leading-relaxed">
          Download your complete check-in history and pacing sessions as a portable JSON file to bring to your next neurology or sports medicine appointment.
        </p>

        <button
          onClick={handleExportData}
          className="flex items-center justify-center gap-2 py-3 px-5 bg-calm-bg-surface hover:bg-calm-bg-elevated border border-calm-sage text-calm-text font-semibold rounded-xl text-xs transition-colors min-h-touch self-start"
        >
          <Download className="w-4 h-4 text-calm-sage" />
          <span>{downloadSuccess ? "Downloaded Successfully" : "Export Recovery Data (.json)"}</span>
        </button>
      </div>

      {/* Threat Model Summary */}
      <div className="p-5 bg-calm-bg-card border border-calm-border rounded-xl flex flex-col gap-3">
        <div className="flex items-center gap-2 text-calm-amber">
          <AlertTriangle className="w-4 h-4" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-calm-text">
            Security Threat Model & Limitations
          </h2>
        </div>
        <p className="text-xs text-calm-text-muted leading-relaxed">
          <strong>Local-First Boundary:</strong> On-device encryption protects against forensic extraction from device backups or secondary browser tabs. However, it cannot defend against a root-compromised host device or malicious browser extensions with complete DOM inspection access. Please see <code className="text-calm-text bg-calm-bg-surface px-1 py-0.5 rounded">THREAT_MODEL.md</code> for the complete STRIDE analysis.
        </p>
      </div>
    </div>
  );
}
