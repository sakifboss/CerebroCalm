"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { CLINICAL_DISCLAIMER_TEXT } from "@/lib/constants";
import { AlertCircle } from "lucide-react";

export const ClinicalDisclaimer: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const pathname = usePathname();
  if (pathname === "/welcome") return null;
  if (compact) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-calm-bg-surface border border-calm-border rounded-lg text-xs text-calm-text-muted">
        <AlertCircle className="w-3.5 h-3.5 text-calm-amber flex-shrink-0" />
        <span className="truncate">
          Educational recovery tool. Not a substitute for clinician care.
        </span>
      </div>
    );
  }

  return (
    <div
      role="note"
      aria-label="Clinical Disclaimer"
      className="p-4 bg-calm-bg-surface border border-calm-border rounded-xl flex items-start gap-3"
    >
      <AlertCircle className="w-5 h-5 text-calm-amber flex-shrink-0 mt-0.5" />
      <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold text-calm-text uppercase tracking-wider">
          Educational Notice
        </span>
        <p className="text-xs text-calm-text-muted leading-relaxed max-w-reading">
          {CLINICAL_DISCLAIMER_TEXT}
        </p>
      </div>
    </div>
  );
};
