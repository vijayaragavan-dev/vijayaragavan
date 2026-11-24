export type SceneId = "hero" | "skills";

let activeScene: SceneId | null = null;
const ratios = new Map<SceneId, number>();
const listeners = new Set<() => void>();

let evaluationQueued = false;

function emit() {
  listeners.forEach((listener) => listener());
}

function setActiveScene(next: SceneId | null) {
  if (activeScene === next) return;
  activeScene = next;
  emit();
}

function scheduleEvaluation() {
  if (evaluationQueued) return;
  evaluationQueued = true;

  queueMicrotask(() => {
    evaluationQueued = false;
    evaluateActiveScene();
  });
}

function evaluateActiveScene() {
  const candidates = [...ratios.entries()]
    .filter(([, ratio]) => ratio > 0.05)
    .sort((a, b) => b[1] - a[1]);

  if (candidates.length === 0) {
    setActiveScene(null);
    return;
  }

  if (activeScene === null) {
    setActiveScene(candidates[0][0]);
    return;
  }

  const currentRatio = ratios.get(activeScene) ?? 0;

  if (currentRatio <= 0.03) {
    setActiveScene(candidates[0][0]);
    return;
  }

  const challenger = candidates.find(([id]) => id !== activeScene);
  if (challenger && challenger[1] > currentRatio + 0.12) {
    setActiveScene(challenger[0]);
  }
}

export function reportSceneVisibility(id: SceneId, ratio: number) {
  const normalized = Math.max(0, Math.min(1, ratio));
  if (ratios.get(id) === normalized) return;

  ratios.set(id, normalized);
  scheduleEvaluation();
}

export function clearSceneVisibility(id: SceneId) {
  if (!ratios.has(id)) return;
  ratios.delete(id);

  if (activeScene === id) {
    const next = [...ratios.entries()]
      .filter(([, ratio]) => ratio > 0.05)
      .sort((a, b) => b[1] - a[1])[0];
    setActiveScene(next ? next[0] : null);
  }
}

export function getActiveScene(): SceneId | null {
  return activeScene;
}

export function subscribeToActiveScene(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
