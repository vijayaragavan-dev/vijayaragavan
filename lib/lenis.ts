import type Lenis from "lenis";

let lenisInstance: Lenis | null = null;

export function setLenisInstance(instance: Lenis | null) {
  lenisInstance = instance;
}

export function getLenisInstance(): Lenis | null {
  return lenisInstance;
}

export function scrollToSection(id: string, offset = -88) {
  if (typeof window === "undefined") return;

  const element = document.getElementById(id);
  if (!element) return;

  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (lenisInstance) {
    lenisInstance.scrollTo(element, { offset, duration: prefersReduced ? 0 : 1.2 });
    return;
  }

  element.scrollIntoView({
    behavior: prefersReduced ? "auto" : "smooth",
    block: "start",
  });
}

export function scrollToTop() {
  if (typeof window === "undefined") return;

  if (lenisInstance) {
    lenisInstance.scrollTo(0, { duration: 1.2 });
    return;
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}
