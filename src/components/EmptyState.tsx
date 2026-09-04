import React from "react";
import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionText,
  actionHref,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-calm-bg-card border border-calm-border rounded-2xl text-center max-w-reading mx-auto">
      <div className="p-3 bg-calm-bg-surface border border-calm-border rounded-xl text-calm-sage mb-3">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-calm-text">{title}</h3>
      <p className="text-xs text-calm-text-muted mt-1.5 leading-relaxed max-w-sm">
        {description}
      </p>
      {actionText && actionHref && (
        <Link
          href={actionHref}
          className="mt-4 px-4 py-2.5 bg-calm-bg-surface hover:bg-calm-bg-elevated border border-calm-sage text-calm-text text-xs font-semibold rounded-xl transition-colors min-h-touch flex items-center justify-center"
        >
          {actionText}
        </Link>
      )}
    </div>
  );
};
