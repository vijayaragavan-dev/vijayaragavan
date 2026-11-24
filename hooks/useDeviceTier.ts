"use client";

import { useSyncExternalStore } from "react";
import {
  detectDeviceCapabilities,
  type CapabilityReport,
} from "@/lib/device-capabilities";

let cachedReport: CapabilityReport | null = null;

function subscribe() {
  return () => {};
}

function getReportSnapshot(): CapabilityReport | null {
  if (typeof window === "undefined") return null;
  cachedReport ??= detectDeviceCapabilities();
  return cachedReport;
}

function getServerReportSnapshot(): CapabilityReport | null {
  return null;
}

export function useDeviceTier(): {
  tier: CapabilityReport["tier"] | null;
  report: CapabilityReport | null;
} {
  const report = useSyncExternalStore(
    subscribe,
    getReportSnapshot,
    getServerReportSnapshot,
  );

  return { tier: report?.tier ?? null, report };
}
