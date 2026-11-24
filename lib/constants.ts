export const SECTION_IDS = [
  "home",
  "about",
  "skills",
  "projects",
  "coding",
  "achievements",
  "contact",
] as const;

export const SCROLL_OFFSET = -88;

export const EASE_OUT_SOFT = [0.22, 1, 0.36, 1] as const;
export const EASE_IN_OUT_SOFT = [0.65, 0, 0.35, 1] as const;

export const DPR_FULL = [1, 1.5] as const;
export const DPR_LITE = [1, 1.25] as const;

export const COVER_ACCENT_COLORS = {
  emerald: { a: "#34e0a1", b: "#8ef7c8" },
  violet: { a: "#8b7cff", b: "#b6aaff" },
  cyan: { a: "#58d8f5", b: "#22d3ee" },
} as const;

export const VISIBLE_STACK_CHIPS = 5;
