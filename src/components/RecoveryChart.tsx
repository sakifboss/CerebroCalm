"use client";

import React, { useState } from "react";
import { SymptomTrendPoint } from "@/types/symptom";
import { Table, BarChart2 } from "lucide-react";

interface RecoveryChartProps {
  data: SymptomTrendPoint[];
  sevenDayAverage: number;
}

export const RecoveryChart: React.FC<RecoveryChartProps> = ({ data, sevenDayAverage }) => {
  const [showTableFallback, setShowTableFallback] = useState(false);

  if (!data || data.length === 0) {
    return (
      <div className="p-8 bg-calm-bg-card border border-calm-border rounded-xl text-center">
        <p className="text-sm text-calm-text-muted">
          No symptom trends recorded yet. Log your daily checks to view personal recovery patterns.
        </p>
      </div>
    );
  }

  // Chart Dimensions
  const height = 180;
  const width = 460;
  const padding = 35;
  const maxScore = 15; // Max possible sum: 5 + 5 + 5 = 15

  const points = data.slice(-7); // Last 7 days
  const stepX = points.length > 1 ? (width - padding * 2) / (points.length - 1) : 0;

  const svgCoordinates = points.map((p, idx) => {
    const x = points.length === 1 ? width / 2 : padding + idx * stepX;
    // Scale y: 0 is at bottom (height - padding), 15 is at top (padding)
    const y = height - padding - (p.totalScore / maxScore) * (height - padding * 2);
    return { x, y, point: p };
  });

  const polylinePoints = svgCoordinates.map((c) => `${c.x},${c.y}`).join(" ");

  return (
    <div className="flex flex-col gap-4 p-5 bg-calm-bg-card border border-calm-border rounded-xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-calm-text">Symptom Burden Trend</h3>
          <span className="text-xs text-calm-text-muted">
            Combined daily score (Headache + Sensory + Fatigue, max 15)
          </span>
        </div>

        <button
          onClick={() => setShowTableFallback(!showTableFallback)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-calm-bg-surface border border-calm-border text-calm-text-muted hover:text-calm-text rounded-lg text-xs min-h-touch"
          aria-label={showTableFallback ? "Show chart view" : "Show accessible data table"}
        >
          {showTableFallback ? (
            <>
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Chart</span>
            </>
          ) : (
            <>
              <Table className="w-3.5 h-3.5" />
              <span>Table</span>
            </>
          )}
        </button>
      </div>

      {showTableFallback ? (
        /* Accessible Screen-Reader Friendly Table */
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-calm-text-muted">
            <thead className="bg-calm-bg-surface text-calm-text uppercase border-b border-calm-border">
              <tr>
                <th className="p-2.5">Date</th>
                <th className="p-2.5">Headache</th>
                <th className="p-2.5">Sensory</th>
                <th className="p-2.5">Fatigue</th>
                <th className="p-2.5">Total (Max 15)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-calm-border">
              {points.map((p) => (
                <tr key={p.date} className="hover:bg-calm-bg-surface/50">
                  <td className="p-2.5 font-medium text-calm-text">{p.date}</td>
                  <td className="p-2.5">{p.averageHeadache.toFixed(1)}</td>
                  <td className="p-2.5">{p.averageSensory.toFixed(1)}</td>
                  <td className="p-2.5">{p.averageFatigue.toFixed(1)}</td>
                  <td className="p-2.5 font-bold text-calm-sage">{p.totalScore.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Accessible SVG Line Chart */
        <div className="relative w-full overflow-hidden">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto max-h-56 select-none"
            role="img"
            aria-label="Daily symptom burden chart over the last 7 recorded days"
          >
            {/* Horizontal Gridlines */}
            {[3, 6, 9, 12].map((val) => {
              const y = height - padding - (val / maxScore) * (height - padding * 2);
              return (
                <g key={val}>
                  <line
                    x1={padding}
                    y1={y}
                    x2={width - padding}
                    y2={y}
                    stroke="#38322D"
                    strokeDasharray="3 3"
                    strokeWidth="1"
                  />
                  <text
                    x={padding - 8}
                    y={y + 3}
                    fill="#A8A29E"
                    fontSize="9"
                    textAnchor="end"
                  >
                    {val}
                  </text>
                </g>
              );
            })}

            {/* Line connecting points */}
            {points.length > 1 && (
              <polyline
                fill="none"
                stroke="#A7F3D0"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={polylinePoints}
              />
            )}

            {/* Data Points */}
            {svgCoordinates.map((coord, idx) => (
              <g key={idx}>
                <circle
                  cx={coord.x}
                  cy={coord.y}
                  r="4.5"
                  fill="#1C1917"
                  stroke="#A7F3D0"
                  strokeWidth="2.5"
                />
                <text
                  x={coord.x}
                  y={height - 10}
                  fill="#D6C7A1"
                  fontSize="10"
                  textAnchor="middle"
                >
                  {coord.point.date.slice(5)}
                </text>
              </g>
            ))}
          </svg>
        </div>
      )}

      {/* Transparent Disclaimer */}
      <div className="pt-2 border-t border-calm-border flex items-center justify-between text-xs text-calm-text-muted">
        <span>7-Day Average Burden: <strong className="text-calm-text">{sevenDayAverage} / 15</strong></span>
        <span className="italic">Personal trend, not a medical prediction.</span>
      </div>
    </div>
  );
};
