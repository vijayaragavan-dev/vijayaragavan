"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Check, Info } from "lucide-react";
import { useReducedMotionPreference } from "@/hooks/useReducedMotion";

type ToastTone = "success" | "info" | "error";

type ToastState = {
  id: number;
  message: string;
  tone: ToastTone;
};

type ToastContextValue = {
  notify: (message: string, tone?: ToastTone) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }
  return context;
}

const toneIcon = {
  success: Check,
  info: Info,
  error: AlertCircle,
};

const toneColor = {
  success: "text-emerald-bright",
  info: "text-cyan",
  error: "text-red-300",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const timer = useRef<number | null>(null);
  const reduceMotion = useReducedMotionPreference();

  const clearTimer = useCallback(() => {
    if (timer.current !== null) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  const notify = useCallback(
    (message: string, tone: ToastTone = "info") => {
      clearTimer();
      setToast({ id: Date.now(), message, tone });
      timer.current = window.setTimeout(() => setToast(null), 3800);
    },
    [clearTimer],
  );

  useEffect(() => clearTimer, [clearTimer]);

  const Icon = toast ? toneIcon[toast.tone] : Info;

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-4 bottom-4 z-[100] flex justify-center sm:inset-x-auto sm:bottom-6 sm:right-6 sm:justify-end"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <AnimatePresence>
          {toast && (
            <motion.div
              key={toast.id}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
              transition={{ duration: reduceMotion ? 0.15 : 0.28 }}
              className="glass-strong flex max-w-sm items-center gap-3 rounded-xl border-white/12 px-4 py-3 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.95)]"
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] ${toneColor[toast.tone]}`}
              >
                <Icon size={14} aria-hidden="true" />
              </span>
              <p className="text-[13px] leading-snug text-ink/90">
                {toast.message}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
