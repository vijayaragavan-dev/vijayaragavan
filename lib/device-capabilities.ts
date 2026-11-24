export type DeviceTier = "full" | "lite" | "no-3d";

export type CapabilityReport = {
  tier: DeviceTier;
  reason: string;
  webgl: boolean;
  reducedMotion: boolean;
  saveData: boolean;
  cores: number | null;
  memory: number | null;
  coarsePointer: boolean;
};

function hasWebGLSupport(): boolean {
  if (typeof window === "undefined") return false;

  try {
    const canvas = document.createElement("canvas");
    const context =
      canvas.getContext("webgl2") ?? canvas.getContext("webgl");

    if (!context) return false;

    const loseContext = (
      context as WebGLRenderingContext & {
        getExtension: (name: string) => { loseContext?: () => void } | null;
      }
    ).getExtension("WEBGL_lose_context");

    loseContext?.loseContext?.();
    return true;
  } catch {
    return false;
  }
}

export function detectDeviceCapabilities(): CapabilityReport {
  if (typeof window === "undefined") {
    return {
      tier: "lite",
      reason: "server",
      webgl: false,
      reducedMotion: false,
      saveData: false,
      cores: null,
      memory: null,
      coarsePointer: false,
    };
  }

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;

  const connection = (
    navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }
  ).connection;
  const saveData = Boolean(connection?.saveData);
  const cores =
    typeof navigator.hardwareConcurrency === "number"
      ? navigator.hardwareConcurrency
      : null;
  const memory =
    typeof (navigator as Navigator & { deviceMemory?: number })
      .deviceMemory === "number"
      ? ((navigator as Navigator & { deviceMemory?: number })
          .deviceMemory as number)
      : null;

  const base = { webgl: true, reducedMotion, saveData, cores, memory, coarsePointer };

  if (saveData) {
    return { ...base, webgl: false, tier: "no-3d", reason: "save-data" };
  }

  const webgl = hasWebGLSupport();
  if (!webgl) {
    return { ...base, webgl: false, tier: "no-3d", reason: "no-webgl" };
  }

  if (cores !== null && cores <= 2) {
    return { ...base, webgl, tier: "no-3d", reason: "low-core-count" };
  }

  if (
    (cores !== null && cores < 4) ||
    (memory !== null && memory < 4) ||
    (coarsePointer && window.innerWidth < 768)
  ) {
    return { ...base, webgl, tier: "lite", reason: "constrained-device" };
  }

  return { ...base, webgl, tier: "full", reason: "capable-device" };
}
