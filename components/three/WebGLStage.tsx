"use client";

import {
  Component,
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactElement,
  type ReactNode,
} from "react";
import {
  clearSceneVisibility,
  getActiveScene,
  reportSceneVisibility,
  subscribeToActiveScene,
  type SceneId,
} from "@/lib/webgl-lifecycle";
import { cn } from "@/lib/utils";

type WebGLStageProps = {
  id: SceneId;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  interactive?: boolean;
  onError?: () => void;
};

class SceneErrorBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}

function useNearViewport(
  ref: React.RefObject<HTMLDivElement | null>,
  rootMargin: string,
): { near: boolean; hasBeenNear: boolean } {
  const [near, setNear] = useState(false);
  const [hasBeenNear, setHasBeenNear] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setNear(entry.isIntersecting);
        if (entry.isIntersecting) setHasBeenNear(true);
      },
      { rootMargin, threshold: 0 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, rootMargin]);

  return { near, hasBeenNear };
}

export default function WebGLStage({
  id,
  children,
  className,
  disabled = false,
  interactive = false,
  onError,
}: WebGLStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const { near, hasBeenNear } = useNearViewport(containerRef, "350px");

  const activeScene = useSyncExternalStore(
    subscribeToActiveScene,
    getActiveScene,
    () => null,
  );
  const isActive = activeScene === id;

  useEffect(() => {
    if (disabled) return;
    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        reportSceneVisibility(
          id,
          entry.isIntersecting ? entry.intersectionRatio : 0,
        );
      },
      {
        threshold: [0, 0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
      },
    );

    observer.observe(element);
    return () => {
      observer.disconnect();
      clearSceneVisibility(id);
    };
  }, [id, disabled]);

  useEffect(() => {
    const handleContextLost = () => {
      if (isActive) setFailed(true);
    };

    window.addEventListener("vj:webgl-context-lost", handleContextLost);
    return () =>
      window.removeEventListener("vj:webgl-context-lost", handleContextLost);
  }, [isActive]);

  useEffect(() => {
    if (failed) onError?.();
  }, [failed, onError]);

  const showScene = !disabled && !failed && (near || hasBeenNear);

  return (
    <div
      ref={containerRef}
      className={cn(
        interactive ? "pointer-events-auto" : "pointer-events-none",
        className,
      )}
      aria-hidden="true"
      role="presentation"
      data-scene={id}
      data-active={showScene ? "true" : "false"}
    >
      {showScene && (
        <SceneErrorBoundary onError={() => setFailed(true)}>
          {isValidElement(children)
            ? cloneElement(
                children as ReactElement<{ active?: boolean }>,
                { active: isActive },
              )
            : children}
        </SceneErrorBoundary>
      )}
    </div>
  );
}
