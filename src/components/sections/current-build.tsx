"use client";

import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { CONTENT } from "@/lib/constants";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { ShimmerButton } from "@/components/ui/shimmer-button";

// ============================================
// TYPES & CONSTANTS
// ============================================

type CallStep =
  | "incoming"
  | "answering"
  | "greeting"
  | "customer-request"
  | "ai-asks"
  | "customer-details"
  | "ai-checking"
  | "ai-confirms"
  | "booked"
  | "sms-sent";

const STEP_DURATIONS: Record<CallStep, number> = {
  incoming: 2800,
  answering: 1400,
  greeting: 2600,
  "customer-request": 2600,
  "ai-asks": 2600,
  "customer-details": 2600,
  "ai-checking": 1800,
  "ai-confirms": 3200,
  booked: 3000,
  "sms-sent": 2200,
};

const STEP_ORDER: CallStep[] = [
  "incoming",
  "answering",
  "greeting",
  "customer-request",
  "ai-asks",
  "customer-details",
  "ai-checking",
  "ai-confirms",
  "booked",
  "sms-sent",
];

// ============================================
// ORGANIC WAVEFORM — Circular orb visualizer
// ============================================

function OrbWaveform({ intensity = 1 }: { intensity?: number }) {
  const bars = 32;
  return (
    <div className="relative w-20 h-20 flex items-center justify-center">
      {/* Ambient glow behind orb */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(10,132,255,0.15) 0%, transparent 70%)",
        }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Circular bar ring */}
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {[...Array(bars)].map((_, i) => {
          const angle = (i / bars) * 360;
          const rad = (angle * Math.PI) / 180;
          const innerR = 28;
          const x1 = 50 + Math.cos(rad) * innerR;
          const y1 = 50 + Math.sin(rad) * innerR;
          return (
            <motion.line
              key={i}
              x1={x1}
              y1={y1}
              x2={x1}
              y2={y1}
              stroke="url(#waveGrad)"
              strokeWidth={1.8}
              strokeLinecap="round"
              animate={{
                x2: [
                  50 + Math.cos(rad) * (innerR + 4 * intensity),
                  50 + Math.cos(rad) * (innerR + 14 * intensity),
                  50 + Math.cos(rad) * (innerR + 6 * intensity),
                  50 + Math.cos(rad) * (innerR + 12 * intensity),
                  50 + Math.cos(rad) * (innerR + 4 * intensity),
                ],
                y2: [
                  50 + Math.sin(rad) * (innerR + 4 * intensity),
                  50 + Math.sin(rad) * (innerR + 14 * intensity),
                  50 + Math.sin(rad) * (innerR + 6 * intensity),
                  50 + Math.sin(rad) * (innerR + 12 * intensity),
                  50 + Math.sin(rad) * (innerR + 4 * intensity),
                ],
              }}
              transition={{
                duration: 1.6 + Math.sin(i * 0.5) * 0.4,
                repeat: Infinity,
                delay: (i / bars) * 0.8,
                ease: "easeInOut",
              }}
            />
          );
        })}
        <defs>
          <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0A84FF" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#5AC8FA" stopOpacity="0.5" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

// ============================================
// INLINE BAR WAVEFORM — for active call header
// ============================================

function BarWaveform() {
  return (
    <div className="flex items-center gap-[1.5px] h-3">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="w-[2px] rounded-full bg-[#30D158]"
          animate={{ height: [3, 10, 5, 12, 3] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.12,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// ============================================
// PULSE RINGS — expanding rings for incoming
// ============================================

function PulseRings() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute w-24 h-24 rounded-full border border-[#0A84FF]/20"
          initial={{ scale: 0.8, opacity: 0.6 }}
          animate={{ scale: 2.5, opacity: 0 }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            delay: i * 0.8,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

// ============================================
// TRANSCRIPT BUBBLE — iMessage-style
// ============================================

interface TranscriptBubbleProps {
  sender: "customer" | "ai";
  text: string;
  delay?: number;
  typing?: boolean;
}

function TranscriptBubble({
  sender,
  text,
  delay = 0,
  typing = false,
}: TranscriptBubbleProps) {
  const isAI = sender === "ai";
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.4,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={`flex items-end gap-1.5 ${isAI ? "flex-row-reverse" : ""}`}
    >
      {/* Avatar */}
      <div
        className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center ${
          isAI
            ? "bg-gradient-to-br from-[#0A84FF] to-[#5AC8FA] shadow-[0_0_8px_rgba(10,132,255,0.3)]"
            : "bg-[#1c1c1e] border border-white/[0.08]"
        }`}
      >
        {isAI ? (
          <svg
            className="w-2.5 h-2.5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
            />
          </svg>
        ) : (
          <span className="text-[7px] font-semibold text-white/40">C</span>
        )}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[80%] px-3 py-[7px] ${
          isAI
            ? "rounded-[16px] rounded-br-[4px] bg-[#0A84FF] shadow-[0_1px_3px_rgba(0,0,0,0.3),0_0_12px_rgba(10,132,255,0.15)]"
            : "rounded-[16px] rounded-bl-[4px] bg-[#1c1c1e] border border-white/[0.06] shadow-[0_1px_3px_rgba(0,0,0,0.2)]"
        }`}
      >
        {typing ? (
          <div className="flex gap-[3px] py-0.5 px-0.5">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-[5px] h-[5px] rounded-full bg-white/50"
                animate={{ opacity: [0.25, 0.9, 0.25], y: [0, -3, 0] }}
                transition={{
                  duration: 0.7,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        ) : (
          <p
            className={`text-[11px] leading-[1.45] font-normal ${
              isAI ? "text-white" : "text-white/70"
            }`}
          >
            {text}
          </p>
        )}
      </div>
    </motion.div>
  );
}

// ============================================
// CALL INTERFACE — Full E2E Demo
// ============================================

function CallInterface() {
  const [step, setStep] = useState<CallStep>("incoming");
  const [callTime, setCallTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const stepIndex = useMemo(() => STEP_ORDER.indexOf(step), [step]);

  const advanceStep = useCallback(() => {
    setStep((prev) => {
      const idx = STEP_ORDER.indexOf(prev);
      if (idx === STEP_ORDER.length - 1) {
        setCallTime(0);
        return STEP_ORDER[0];
      }
      return STEP_ORDER[idx + 1];
    });
  }, []);

  useEffect(() => {
    const timeout = setTimeout(advanceStep, STEP_DURATIONS[step]);
    return () => clearTimeout(timeout);
  }, [step, advanceStep]);

  useEffect(() => {
    const isActive = stepIndex >= 2;
    if (isActive) {
      timerRef.current = setInterval(() => setCallTime((t) => t + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [stepIndex]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const showTranscript = stepIndex >= 2 && step !== "booked" && step !== "sms-sent";

  return (
    <div className="w-full h-full bg-black flex flex-col relative overflow-hidden">
      {/* Ambient background that shifts with call state */}
      <div className="absolute inset-0 pointer-events-none">
        <AnimatePresence mode="wait">
          {step === "incoming" && (
            <motion.div
              key="bg-incoming"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 30%, rgba(10,132,255,0.08) 0%, transparent 60%)",
              }}
            />
          )}
          {(stepIndex >= 1 && step !== "booked" && step !== "sms-sent") && (
            <motion.div
              key="bg-active"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 20%, rgba(48,209,88,0.04) 0%, transparent 50%)",
              }}
            />
          )}
          {(step === "booked" || step === "sms-sent") && (
            <motion.div
              key="bg-success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 40%, rgba(48,209,88,0.06) 0%, transparent 50%)",
              }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* iOS Status Bar */}
      <div className="relative z-10 flex items-center justify-between px-6 pt-14 pb-1 flex-shrink-0">
        <span className="text-[11px] font-semibold text-white/90 tabular-nums">
          9:41
        </span>
        <div className="flex items-center gap-1">
          {/* Signal bars */}
          <div className="flex items-end gap-[1px]">
            {[3, 5, 7, 9].map((h, i) => (
              <div
                key={i}
                className="w-[3px] rounded-[0.5px] bg-white/90"
                style={{ height: `${h}px` }}
              />
            ))}
          </div>
          {/* WiFi */}
          <svg className="w-[13px] h-[13px] text-white/90 ml-0.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 18c.71 0 1.29.57 1.29 1.29S12.71 20.57 12 20.57s-1.29-.57-1.29-1.29S11.29 18 12 18zm0-4.29c2.07 0 3.94.84 5.29 2.2l-1.82 1.82A5.14 5.14 0 0012 16.14c-1.42 0-2.71.58-3.64 1.52l-1.82-1.82A7.43 7.43 0 0112 13.71zm0-4.28c3.21 0 6.11 1.3 8.21 3.41l-1.82 1.82A9.14 9.14 0 0012 12c-2.53 0-4.82 1.03-6.47 2.68L3.71 12.86A11.43 11.43 0 0112 9.43z" />
          </svg>
          {/* Battery */}
          <div className="ml-0.5 flex items-center">
            <div className="w-[22px] h-[10px] rounded-[2.5px] border border-white/40 relative p-[1.5px]">
              <div className="h-full w-[80%] rounded-[1px] bg-white/90" />
            </div>
            <div className="w-[1.5px] h-[4px] bg-white/40 rounded-r-full ml-[0.5px]" />
          </div>
        </div>
      </div>

      {/* App header bar */}
      <div className="relative z-10 flex items-center justify-between px-4 py-2 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div
            className="w-[22px] h-[22px] rounded-md flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #0A84FF, #5AC8FA)",
              boxShadow: "0 0 8px rgba(10,132,255,0.3)",
            }}
          >
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
            </svg>
          </div>
          <span className="text-[11px] font-semibold text-white/80 tracking-tight">
            OdisAI
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-[6px] h-[6px] rounded-full bg-[#30D158] shadow-[0_0_6px_rgba(48,209,88,0.5)]" />
          <span className="text-[9px] font-medium text-white/30 tracking-wide uppercase">
            Live
          </span>
        </div>
      </div>

      {/* ─────────────── Main content area ─────────────── */}
      <div className="flex-1 relative z-10 flex flex-col overflow-hidden min-h-0">
        <AnimatePresence mode="wait">
          {/* ═══ INCOMING CALL ═══ */}
          {step === "incoming" && (
            <motion.div
              key="incoming"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.5 }}
              className="flex-1 flex flex-col items-center justify-center relative px-6"
            >
              <PulseRings />

              {/* Caller avatar */}
              <motion.div
                className="relative w-[72px] h-[72px] mb-5"
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <div
                  className="w-full h-full rounded-full flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, rgba(10,132,255,0.2), rgba(90,200,250,0.1))",
                    border: "1.5px solid rgba(10,132,255,0.3)",
                    boxShadow: "0 0 24px rgba(10,132,255,0.15), inset 0 0 12px rgba(10,132,255,0.08)",
                  }}
                >
                  <svg
                    className="w-8 h-8 text-[#0A84FF]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
              </motion.div>

              <p className="text-[15px] font-medium text-white/90 mb-1 tracking-tight">
                Incoming Call
              </p>
              <p className="text-[13px] text-white/40 tabular-nums mb-0.5">
                (555) 842-7291
              </p>
              <p className="text-[11px] text-white/25 mb-6">
                Sunnyvale Veterinary Clinic
              </p>

              {/* Answering indicator */}
              <motion.div
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0A84FF]/10 border border-[#0A84FF]/15"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <motion.div
                  className="w-[6px] h-[6px] rounded-full bg-[#0A84FF]"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span className="text-[10px] font-medium text-[#0A84FF]/80 tracking-wide">
                  AI Answering
                </span>
              </motion.div>
            </motion.div>
          )}

          {/* ═══ ANSWERING / CONNECTING ═══ */}
          {step === "answering" && (
            <motion.div
              key="answering"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex-1 flex flex-col items-center justify-center px-6"
            >
              <OrbWaveform intensity={0.6} />

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-[13px] font-medium text-[#30D158] mt-4"
              >
                Connected
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-[11px] text-white/30 mt-1"
              >
                AI is listening...
              </motion.p>
            </motion.div>
          )}

          {/* ═══ ACTIVE CONVERSATION ═══ */}
          {showTranscript && (
            <motion.div
              key="conversation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
              className="flex-1 flex flex-col min-h-0"
            >
              {/* Active call pill */}
              <div className="flex justify-center py-2 flex-shrink-0">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#1c1c1e] border border-white/[0.04]">
                  <BarWaveform />
                  <div className="w-px h-3 bg-white/[0.06]" />
                  <span className="text-[10px] text-white/40 tabular-nums font-medium">
                    {formatTime(callTime)}
                  </span>
                  <div className="w-px h-3 bg-white/[0.06]" />
                  <span className="text-[10px] text-white/25">(555) 842-7291</span>
                </div>
              </div>

              {/* Transcript — scrolls from bottom */}
              <div className="flex-1 flex flex-col justify-end px-4 pb-3 space-y-2 overflow-hidden">
                <TranscriptBubble
                  sender="ai"
                  text="Hi! Thanks for calling Sunnyvale Vet. I'm the OdisAI assistant — how can I help you today?"
                />

                {stepIndex >= STEP_ORDER.indexOf("customer-request") && (
                  <TranscriptBubble
                    sender="customer"
                    text="Hi, I need to schedule a checkup for my dog Max."
                    delay={0.08}
                  />
                )}

                {stepIndex >= STEP_ORDER.indexOf("ai-asks") && (
                  <TranscriptBubble
                    sender="ai"
                    text="Of course! What breed is Max, and do you have a preferred day?"
                    delay={0.08}
                  />
                )}

                {stepIndex >= STEP_ORDER.indexOf("customer-details") && (
                  <TranscriptBubble
                    sender="customer"
                    text="He's a Golden Retriever. Tomorrow afternoon if possible."
                    delay={0.08}
                  />
                )}

                {step === "ai-checking" && (
                  <TranscriptBubble
                    sender="ai"
                    text=""
                    typing={true}
                    delay={0.08}
                  />
                )}

                {stepIndex >= STEP_ORDER.indexOf("ai-confirms") && (
                  <TranscriptBubble
                    sender="ai"
                    text="I found a 2:30 PM slot tomorrow with Dr. Chen. Booking that for Max now — you'll get a text confirmation!"
                    delay={0.08}
                  />
                )}
              </div>
            </motion.div>
          )}

          {/* ═══ BOOKING CONFIRMED ═══ */}
          {step === "booked" && (
            <motion.div
              key="booked"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.5 }}
              className="flex-1 flex flex-col items-center justify-center px-5 relative"
            >
              {/* Success burst rings */}
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="absolute w-16 h-16 rounded-full border border-[#30D158]/20"
                  initial={{ scale: 0.5, opacity: 0.8 }}
                  animate={{ scale: 3, opacity: 0 }}
                  transition={{
                    duration: 1.6,
                    delay: i * 0.2,
                    ease: "easeOut",
                  }}
                />
              ))}

              {/* Checkmark */}
              <motion.div
                className="w-14 h-14 rounded-full flex items-center justify-center mb-4 relative"
                style={{
                  background: "linear-gradient(135deg, rgba(48,209,88,0.2), rgba(48,209,88,0.08))",
                  border: "1.5px solid rgba(48,209,88,0.3)",
                  boxShadow: "0 0 20px rgba(48,209,88,0.15)",
                }}
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 15,
                }}
              >
                <motion.svg
                  className="w-7 h-7 text-[#30D158]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <motion.path
                    d="M5 13l4 4L19 7"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
                  />
                </motion.svg>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-[14px] font-medium text-white/90 mb-4 tracking-tight"
              >
                Appointment Booked
              </motion.p>

              {/* Appointment card */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="w-full rounded-2xl overflow-hidden"
                style={{
                  background: "linear-gradient(180deg, rgba(28,28,30,0.9), rgba(28,28,30,0.7))",
                  border: "1px solid rgba(255,255,255,0.06)",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
                }}
              >
                <div className="px-4 py-3.5">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: "linear-gradient(135deg, rgba(10,132,255,0.2), rgba(10,132,255,0.08))",
                        border: "1px solid rgba(10,132,255,0.15)",
                      }}
                    >
                      <svg className="w-4 h-4 text-[#0A84FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[12px] font-medium text-white/90">
                        Wellness Checkup
                      </p>
                      <p className="text-[10px] text-white/35">
                        Max &middot; Golden Retriever
                      </p>
                    </div>
                  </div>

                  <div className="h-px bg-white/[0.04] -mx-4 mb-3" />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-[11px] text-white/50">Tomorrow, 2:30 PM</p>
                      <p className="text-[10px] text-white/25">Dr. Sarah Chen</p>
                    </div>
                    <div
                      className="px-2.5 py-1 rounded-full text-[9px] font-semibold tracking-wide"
                      style={{
                        background: "rgba(48,209,88,0.12)",
                        color: "#30D158",
                        border: "1px solid rgba(48,209,88,0.15)",
                      }}
                    >
                      CONFIRMED
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* ═══ SMS SENT ═══ */}
          {step === "sms-sent" && (
            <motion.div
              key="sms"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex-1 flex flex-col items-center justify-center px-5"
            >
              <motion.div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                style={{
                  background: "linear-gradient(135deg, rgba(10,132,255,0.15), rgba(10,132,255,0.06))",
                  border: "1.5px solid rgba(10,132,255,0.2)",
                  boxShadow: "0 0 16px rgba(10,132,255,0.1)",
                }}
                initial={{ scale: 0.8, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <svg className="w-5 h-5 text-[#0A84FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                </svg>
              </motion.div>

              <p className="text-[13px] font-medium text-white/80 mb-0.5">
                Confirmation Sent
              </p>
              <p className="text-[10px] text-white/25 mb-4">(555) 842-7291</p>

              {/* SMS preview bubble */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="w-full max-w-[220px] rounded-2xl overflow-hidden"
                style={{
                  background: "rgba(28,28,30,0.8)",
                  border: "1px solid rgba(255,255,255,0.04)",
                }}
              >
                <div className="px-3 py-2.5">
                  <p className="text-[9px] text-white/20 mb-1.5 font-medium">
                    SMS Preview
                  </p>
                  <p className="text-[10px] text-white/45 leading-[1.5]">
                    &quot;Your appointment for Max is confirmed — Tomorrow at
                    2:30 PM with Dr. Chen. Reply C to cancel.&quot;
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ─────────────── Bottom stats bar ─────────────── */}
      <div
        className="relative z-10 flex-shrink-0 flex items-center justify-around px-4 py-2.5 mx-3 mb-3 rounded-2xl"
        style={{
          background: "rgba(28,28,30,0.6)",
          border: "1px solid rgba(255,255,255,0.04)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="text-center flex-1">
          <p className="text-[14px] font-semibold text-white/90 tabular-nums leading-none mb-0.5">
            147
          </p>
          <p className="text-[7px] text-white/25 uppercase tracking-[0.1em] font-medium">
            Calls
          </p>
        </div>
        <div className="w-px h-5 bg-white/[0.06]" />
        <div className="text-center flex-1">
          <p className="text-[14px] font-semibold text-[#0A84FF] tabular-nums leading-none mb-0.5">
            98%
          </p>
          <p className="text-[7px] text-white/25 uppercase tracking-[0.1em] font-medium">
            Answered
          </p>
        </div>
        <div className="w-px h-5 bg-white/[0.06]" />
        <div className="text-center flex-1">
          <p className="text-[14px] font-semibold text-[#30D158] tabular-nums leading-none mb-0.5">
            43
          </p>
          <p className="text-[7px] text-white/25 uppercase tracking-[0.1em] font-medium">
            Booked
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================
// FEATURE CARD
// ============================================

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

function FeatureCard({ icon, title, description, delay }: FeatureProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="group relative"
    >
      <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all duration-300">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/20 flex items-center justify-center mb-4 group-hover:from-blue-500/30 group-hover:to-blue-600/20 transition-all duration-300">
          {icon}
        </div>
        <h3 className="text-base font-medium text-white mb-2">{title}</h3>
        <p className="text-sm text-white/50 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

const credentials = CONTENT.PROJECTS.CURRENT.credentials;

export function CurrentBuild() {
  const badgesRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(badgesRef, { once: true, margin: "-100px" });

  return (
    <section className="relative bg-[#0A0A0B] overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/[0.03] rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-purple-600/[0.02] rounded-full blur-[100px]" />
      </div>

      {/* Container Scroll Animation */}
      <ContainerScroll
        variant="iphone"
        titleComponent={
          <div className="mb-8">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block text-[0.625rem] tracking-[0.3em] uppercase text-white/40 mb-6"
            >
              Current Focus
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-[clamp(2.5rem,8vw,5rem)] font-light tracking-tight text-white leading-[1.1] mb-4"
            >
              {CONTENT.PROJECTS.CURRENT.name}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg text-white/50 max-w-xl mx-auto"
            >
              {CONTENT.PROJECTS.CURRENT.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-6"
            >
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs tracking-wide text-blue-400/90 bg-blue-500/10 border border-blue-500/20">
                {CONTENT.PROJECTS.CURRENT.role}
              </span>
            </motion.div>
          </div>
        }
      >
        <CallInterface />
      </ContainerScroll>

      {/* Features Grid */}
      <div className="relative z-10 container-portfolio -mt-32 md:-mt-48">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-24">
          <FeatureCard
            icon={
              <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            title="24/7 Availability"
            description="AI answers every call instantly—nights, weekends, holidays. Never miss a booking or emergency again."
            delay={0}
          />
          <FeatureCard
            icon={
              <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            }
            title="Smart Triage"
            description="Routes true emergencies to the ER while booking routine appointments—no hold times, no callbacks."
            delay={0.1}
          />
          <FeatureCard
            icon={
              <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            }
            title="Automated Follow-ups"
            description="Proactive discharge calls and appointment reminders keep clients engaged without staff effort."
            delay={0.2}
          />
        </div>

        {/* Recognition Badges */}
        <motion.div
          ref={badgesRef}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-[0.625rem] tracking-[0.3em] uppercase text-white/40 mb-6">
            Recognition
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {credentials.map((credential, index) => (
              <motion.span
                key={credential}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="px-4 py-2 text-xs text-white/50 bg-white/[0.03] border border-white/10 rounded-full hover:border-white/20 hover:text-white/70 transition-all duration-300"
              >
                {credential}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex justify-center pb-24"
        >
          <ShimmerButton
            shimmerColor="#60a5fa"
            shimmerSize="0.08em"
            background="rgba(96, 165, 250, 0.1)"
            borderRadius="12px"
            className="px-8 py-4 text-sm font-medium tracking-wide"
          >
            <span className="flex items-center gap-2">
              Learn more about OdisAI
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </ShimmerButton>
        </motion.div>
      </div>

      {/* Bottom gradient line */}
      <div className="container-portfolio">
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent origin-center"
        />
      </div>
    </section>
  );
}
