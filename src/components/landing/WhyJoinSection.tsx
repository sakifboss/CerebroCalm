"use client";

import React from "react";
import { BookOpen, Users, Lightbulb } from "lucide-react";

export const WhyJoinSection: React.FC = () => {
  const cards = [
    {
      icon: BookOpen,
      title: "Learn",
      description: "Discover new ideas, validated techniques, and practical knowledge.",
    },
    {
      icon: Users,
      title: "Connect",
      description: "Meet people, share experiences, and navigate recovery together.",
    },
    {
      icon: Lightbulb,
      title: "Create",
      description: "Turn ideas into meaningful projects and personalized daily routines.",
    },
  ];

  return (
    <section id="why-join" className="w-full max-w-3xl mx-auto py-12 flex flex-col gap-6">
      <div className="flex flex-col items-center text-center gap-1.5">
        <span className="text-xs font-bold uppercase tracking-wider text-calm-sage">
          The Experience
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-calm-text tracking-tight">
          Why Join?
        </h2>
        <p className="text-xs sm:text-sm text-calm-text-muted max-w-md">
          A calm, focused environment built for sustainable pacing and personal growth.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="p-5 bg-calm-bg-card border border-calm-border/80 hover:border-calm-sage/40 rounded-2xl flex flex-col gap-3 transition-all duration-200 hover:-translate-y-0.5 shadow-sm group"
            >
              <div className="w-10 h-10 rounded-xl bg-calm-bg-surface border border-calm-border text-calm-sage flex items-center justify-center group-hover:border-calm-sage/50 transition-colors">
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-base font-bold text-calm-text">
                  {card.title}
                </h3>
                <p className="text-xs text-calm-text-muted leading-relaxed">
                  {card.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
