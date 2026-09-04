"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log privately or handle gracefully without leaking sensitive health metrics
    console.error("ErrorBoundary caught an unhandled client error:", error.message);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[300px] flex items-center justify-center p-6">
          <div className="max-w-md w-full p-6 bg-calm-bg-card border border-calm-border rounded-2xl text-center flex flex-col items-center gap-4">
            <div className="p-3 bg-calm-amber-surface border border-calm-amber-muted rounded-xl text-calm-amber">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-calm-text">
              {this.props.fallbackTitle || "Something interrupted this view"}
            </h2>
            <p className="text-xs text-calm-text-muted leading-relaxed">
              To protect your session and avoid visual strain, the interface paused. Your saved symptom checks and pacing settings remain safely stored on your device.
            </p>
            <button
              onClick={this.handleReset}
              className="flex items-center gap-2 px-5 py-3 bg-calm-sage text-calm-bg-deep font-semibold rounded-xl text-sm transition-colors min-h-touch"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload Safely</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
