"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSettingsStore } from "@/store/settingsStore";
import {
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Lock,
  User,
  Mail,
  Loader2,
  Sparkles,
  PartyPopper,
  RotateCcw,
} from "lucide-react";

interface FormErrors {
  name?: string;
  email?: string;
  general?: string;
}

export const RegistrationCard: React.FC = () => {
  const router = useRouter();
  const { updateProfile, setDemoMode } = useSettingsStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [registeredUser, setRegisteredUser] = useState<{ name: string; email: string } | null>(null);

  // Client-side quick validation indicators
  const isNameValid = name.trim().length >= 2;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Client-side checks
    const newErrors: FormErrors = {};
    if (!name.trim()) {
      newErrors.name = "Please enter your name.";
    } else if (name.trim().length < 2) {
      newErrors.name = "Please enter your name.";
    }

    if (!email.trim()) {
      newErrors.email = "Please enter a valid email address.";
    } else if (!isEmailValid) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim() }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        if (res.status === 409) {
          setErrors({ email: "This email is already registered." });
        } else if (data && data.error) {
          if (data.error.toLowerCase().includes("name")) {
            setErrors({ name: data.error });
          } else if (data.error.toLowerCase().includes("email")) {
            setErrors({ email: data.error });
          } else {
            setErrors({ general: data.error });
          }
        } else {
          setErrors({ general: "Something went wrong. Please try again." });
        }
        setIsSubmitting(false);
        return;
      }

      // Success
      const registeredName = data?.user?.name || name.trim();
      const registeredEmail = data?.user?.email || email.trim();

      // Update local profile store
      updateProfile({
        name: registeredName,
        hasCompletedOnboarding: true,
      });

      setRegisteredUser({ name: registeredName, email: registeredEmail });
      setIsSubmitting(false);
    } catch {
      setErrors({ general: "Something went wrong. Please try again." });
      setIsSubmitting(false);
    }
  };

  const handleQuickJudgeDemo = () => {
    const demoName = "Alex Taylor";
    const eightDaysAgo = new Date(Date.now() - 8 * 24 * 3600 * 1000).toISOString().slice(0, 10);

    updateProfile({
      name: demoName,
      injuryDate: eightDaysAgo,
      recoveryStage: 2,
      doctorName: "Dr. Marcus Thorne, Neurologist",
      doctorPhone: "555-0144",
      clinicName: "Metro Concussion Clinic",
      hasCompletedOnboarding: true,
    });
    setDemoMode(true);
    setRegisteredUser({ name: demoName, email: "alex.taylor@demo.test" });
  };

  const handleResetForAnother = () => {
    setName("");
    setEmail("");
    setErrors({});
    setRegisteredUser(null);
  };

  return (
    <div id="register-card" className="w-full max-w-lg mx-auto scroll-mt-24">
      <div className="relative p-6 sm:p-9 bg-calm-bg-card border border-calm-border/80 rounded-3xl shadow-xl backdrop-blur-sm transition-all duration-300">
        {/* Soft Card Glow */}
        <div className="absolute -inset-px rounded-3xl bg-gradient-to-b from-calm-sage/20 via-transparent to-transparent pointer-events-none opacity-50" />

        {!registeredUser ? (
          /* ================= FORM STATE ================= */
          <div className="relative flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col gap-1.5 text-center sm:text-left">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl sm:text-3xl font-bold text-calm-text tracking-tight">
                  Reserve Your Spot
                </h2>
                {/* 1-Click Judge Demo Button */}
                <button
                  type="button"
                  onClick={handleQuickJudgeDemo}
                  className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-calm-sage-surface border border-calm-sage/30 text-[11px] font-semibold text-calm-sage hover:bg-calm-sage hover:text-calm-bg-deep transition-all"
                  title="Instant Evaluation for Hackathon Judges"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Judge Demo</span>
                </button>
              </div>
              <p className="text-xs sm:text-sm text-calm-text-muted">
                Enter your details to complete your registration.
              </p>
            </div>

            {/* General Error Banner */}
            {errors.general && (
              <div className="p-3 bg-calm-emergency-surface/50 border border-calm-emergency/40 rounded-xl flex items-center gap-2 text-xs text-calm-emergency animate-fade-in">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errors.general}</span>
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleRegister} className="flex flex-col gap-4.5" noValidate>
              {/* Field 1: Full Name */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="user-name"
                  className="text-xs font-semibold text-calm-text flex items-center justify-between"
                >
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-calm-sage" />
                    <span>Full Name</span>
                  </span>
                  {isNameValid && (
                    <span className="text-[11px] text-calm-sage font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Valid</span>
                    </span>
                  )}
                </label>
                <div className="relative">
                  <input
                    id="user-name"
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                    }}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    className={`w-full p-3.5 bg-calm-bg-surface border rounded-xl text-sm text-calm-text placeholder:text-calm-text-dim transition-all focus:outline-none min-h-touch ${
                      errors.name
                        ? "border-calm-emergency focus:border-calm-emergency focus:ring-2 focus:ring-calm-emergency/20"
                        : "border-calm-border hover:border-calm-border-focus focus:border-calm-sage focus:ring-2 focus:ring-calm-sage/20"
                    }`}
                  />
                </div>
                {errors.name && (
                  <span className="text-[11px] text-calm-emergency font-medium flex items-center gap-1 mt-0.5">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.name}</span>
                  </span>
                )}
              </div>

              {/* Field 2: Email Address */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="user-email"
                  className="text-xs font-semibold text-calm-text flex items-center justify-between"
                >
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-calm-sage" />
                    <span>Email Address</span>
                  </span>
                  {isEmailValid && (
                    <span className="text-[11px] text-calm-sage font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Valid</span>
                    </span>
                  )}
                </label>
                <div className="relative">
                  <input
                    id="user-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className={`w-full p-3.5 bg-calm-bg-surface border rounded-xl text-sm text-calm-text placeholder:text-calm-text-dim transition-all focus:outline-none min-h-touch ${
                      errors.email
                        ? "border-calm-emergency focus:border-calm-emergency focus:ring-2 focus:ring-calm-emergency/20"
                        : "border-calm-border hover:border-calm-border-focus focus:border-calm-sage focus:ring-2 focus:ring-calm-sage/20"
                    }`}
                  />
                </div>
                {errors.email && (
                  <span className="text-[11px] text-calm-emergency font-medium flex items-center gap-1 mt-0.5">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.email}</span>
                  </span>
                )}
              </div>

              {/* Submit CTA Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-4 px-6 bg-calm-sage text-calm-bg-deep font-bold rounded-xl text-base shadow-md hover:opacity-95 active:scale-[0.99] disabled:opacity-60 disabled:pointer-events-none transition-all min-h-touch flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Registering...</span>
                  </>
                ) : (
                  <>
                    <span>Register Now</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              {/* Mobile Judge Demo Button */}
              <button
                type="button"
                onClick={handleQuickJudgeDemo}
                className="sm:hidden w-full py-2 text-center text-xs text-calm-sage font-medium hover:underline flex items-center justify-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Quick Judge Demo Access</span>
              </button>

              {/* Privacy Message */}
              <div className="flex items-center justify-center gap-1.5 text-xs text-calm-text-dim pt-1">
                <Lock className="w-3 h-3 text-calm-sage/80" />
                <span>Your information is kept private and secure.</span>
              </div>
            </form>
          </div>
        ) : (
          /* ================= SUCCESS STATE ================= */
          <div className="relative flex flex-col items-center text-center gap-5 py-4 animate-fade-in">
            {/* Animated Celebration Icon */}
            <div className="w-16 h-16 rounded-2xl bg-calm-sage-surface border-2 border-calm-sage/40 flex items-center justify-center text-calm-sage shadow-md">
              <CheckCircle2 className="w-9 h-9 animate-pulse" />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-calm-sage-surface border border-calm-sage/30 text-xs text-calm-sage font-semibold mx-auto mb-1">
                <PartyPopper className="w-3.5 h-3.5" />
                <span>Registration confirmed</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-calm-text tracking-tight">
                You're Registered!
              </h3>
              <p className="text-base font-semibold text-calm-sage">
                Welcome, {registeredUser.name}!
              </p>
              <p className="text-xs sm:text-sm text-calm-text-muted max-w-sm mt-1">
                Thanks for signing up. Your registration has been successfully received.
              </p>
            </div>

            {/* Primary Action: Go to Platform */}
            <div className="w-full flex flex-col gap-2.5 pt-2">
              <button
                onClick={() => router.push("/")}
                className="w-full py-3.5 px-6 bg-calm-sage text-calm-bg-deep font-bold rounded-xl text-sm shadow-md hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer min-h-touch"
              >
                <span>Enter CerebroCalm Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Secondary Action: Register Another Person */}
              <button
                type="button"
                onClick={handleResetForAnother}
                className="w-full py-2.5 px-4 bg-calm-bg-surface hover:bg-calm-bg-elevated border border-calm-border text-calm-text-muted hover:text-calm-text rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Register Another Person</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
