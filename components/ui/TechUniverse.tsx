"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { RotateCcw } from "lucide-react";
import TechIcon, {
  techBrandColor,
  techMarkIsWide,
} from "@/components/ui/TechIcon";
import { useDocumentVisible } from "@/hooks/useDocumentVisible";
import { useInView } from "@/hooks/useInView";
import { useReducedMotionPreference } from "@/hooks/useReducedMotion";
import type { SkillGroup } from "@/data/skills";

type TechUniverseProps = {
  group: SkillGroup;
};

type CssVars = CSSProperties & Record<`--${string}`, string | number>;

type LayoutItem = {
  x: number;
  y: number;
  z: number;
  scale: number;
  rx: number;
  ry: number;
  rz: number;
  duration: number;
  delay: number;
};

type Rotation = {
  rx: number;
  ry: number;
  vx: number;
  vy: number;
  raf: number | null;
};

type ObjectDrag = {
  active: boolean;
  pointerId: number;
  index: number;
  lastX: number;
  lastY: number;
  lastTime: number;
  moved: number;
};

type Orbit = {
  active: boolean;
  pointerId: number;
  lastX: number;
  lastY: number;
  lastTime: number;
  rx: number;
  ry: number;
  vx: number;
  vy: number;
  raf: number | null;
};

type TransitionPhase = "idle" | "out" | "in";

const ACCENT_HEX: Record<SkillGroup["accent"], string> = {
  emerald: "#34e0a1",
  violet: "#8b7cff",
  cyan: "#58d8f5",
};

const DEFAULT_ORBIT_X = -4;
const DEFAULT_ORBIT_Y = 0;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/**
 * A compact 3D constellation for the selected group. The first object is the
 * focal artifact; the rest orbit it on two alternating rings so depth stays
 * readable even when a group has nine technologies.
 */
function buildLayout(count: number): LayoutItem[] {
  if (count <= 0) return [];

  const layout: LayoutItem[] = [
    {
      x: 50,
      y: 47,
      z: 60,
      scale: 1.08,
      rx: -14,
      ry: 24,
      rz: -2,
      duration: 7.2,
      delay: 0,
    },
  ];

  const others = count - 1;

  for (let index = 0; index < others; index += 1) {
    const spread = (index / Math.max(others, 1)) * Math.PI * 2;
    const angle =
      -Math.PI / 2 + spread + (others <= 4 ? 0 : Math.PI / 8);
    const ring = others <= 4 ? 1 : index % 2 === 0 ? 1 : 0.82;
    const baseRadius = others <= 2 ? 29 : others <= 4 ? 33 : 34;
    const radius = baseRadius * ring;
    const wobble = Math.sin(index * 2.1) * 2.6;
    const x = 50 + Math.cos(angle) * radius * 1.12 + wobble;
    const y = 48 + Math.sin(angle) * radius * (others <= 4 ? 0.94 : 0.88);
    const z = -24 - (index % 4) * 20 + (index % 3) * 6;
    const scale = 0.78 + ((index * 7) % 5) * 0.045;

    layout.push({
      x: clamp(x, 13, 87),
      y: clamp(y, 18, 78),
      z,
      scale,
      rx: -22 + ((index * 5) % 3) * 6,
      ry:
        (index % 2 === 0 ? 1 : -1) *
        (26 + ((index * 3) % 4) * 5),
      rz: (index % 2 === 0 ? 1 : -1) * (1.5 + (index % 3) * 1.1),
      duration: 6.4 + (index % 4) * 0.7,
      delay: (index + 1) * 0.55,
    });
  }

  return layout;
}

export default function TechUniverse({ group }: TechUniverseProps) {
  const accentHex = ACCENT_HEX[group.accent] ?? ACCENT_HEX.emerald;
  const reducedMotion = useReducedMotionPreference();
  const documentVisible = useDocumentVisible();
  const { ref: inViewRef, inView } = useInView<HTMLDivElement>({
    threshold: 0.05,
    once: false,
  });
  const hintId = useId();

  const [renderGroup, setRenderGroup] = useState(group);
  const [phase, setPhase] = useState<TransitionPhase>("idle");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(0);

  const renderIdRef = useRef(group.id);
  const timersRef = useRef<number[]>([]);
  const stageRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const rotationsRef = useRef<Rotation[]>([]);
  const lastDragAtRef = useRef(0);

  const objectDragRef = useRef<ObjectDrag>({
    active: false,
    pointerId: -1,
    index: -1,
    lastX: 0,
    lastY: 0,
    lastTime: 0,
    moved: 0,
  });

  const orbitRef = useRef<Orbit>({
    active: false,
    pointerId: -1,
    lastX: 0,
    lastY: 0,
    lastTime: 0,
    rx: DEFAULT_ORBIT_X,
    ry: DEFAULT_ORBIT_Y,
    vx: 0,
    vy: 0,
    raf: null,
  });

  const parallaxState = useRef({ x: 0, y: 0 });

  const layout = useMemo(
    () => buildLayout(renderGroup.skills.length),
    [renderGroup.skills.length],
  );

  const active = documentVisible && inView;

  const applyOrbit = useCallback(() => {
    const world = worldRef.current;
    if (!world) return;
    const orbit = orbitRef.current;
    world.style.setProperty("--wx", `${orbit.rx}deg`);
    world.style.setProperty("--wy", `${orbit.ry}deg`);
  }, []);

  const applyParallax = useCallback(() => {
    const parallax = parallaxRef.current;
    if (!parallax) return;
    parallax.style.setProperty("--px", `${parallaxState.current.x}deg`);
    parallax.style.setProperty("--py", `${parallaxState.current.y}deg`);
  }, []);

  // The idle sway is a compositor-only CSS animation; pausing it keeps the
  // current phase, so it resumes exactly where it stopped instead of snapping.
  const idleTimerRef = useRef<number | null>(null);

  const pauseIdleMotion = useCallback(() => {
    if (idleTimerRef.current !== null) {
      window.clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
    stageRef.current?.setAttribute("data-idle-paused", "true");
  }, []);

  const scheduleIdleMotion = useCallback(() => {
    if (idleTimerRef.current !== null) {
      window.clearTimeout(idleTimerRef.current);
    }
    idleTimerRef.current = window.setTimeout(() => {
      idleTimerRef.current = null;
      stageRef.current?.removeAttribute("data-idle-paused");
    }, 2400);
  }, []);

  useEffect(
    () => () => {
      if (idleTimerRef.current !== null) {
        window.clearTimeout(idleTimerRef.current);
      }
    },
    [],
  );

  // Swap the rendered group behind a short exit transition so the old
  // objects leave before the new constellation arrives.
  useEffect(() => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];

    if (group.id === renderIdRef.current) {
      setPhase("idle");
      return;
    }

    setPhase("out");

    const outTimer = window.setTimeout(() => {
      renderIdRef.current = group.id;
      setRenderGroup(group);
      setSelectedIndex(0);
      setPhase("in");

      const idleTimer = window.setTimeout(() => setPhase("idle"), 620);
      timersRef.current.push(idleTimer);
    }, 180);

    timersRef.current.push(outTimer);

    return () => {
      timersRef.current.forEach((timer) => window.clearTimeout(timer));
      timersRef.current = [];
    };
  }, [group]);

  // Reset the per-object rotation model whenever the rendered set changes.
  useEffect(() => {
    rotationsRef.current.forEach((rotation) => {
      if (rotation.raf) window.cancelAnimationFrame(rotation.raf);
    });

    rotationsRef.current = layout.map((item) => ({
      rx: item.rx,
      ry: item.ry,
      vx: 0,
      vy: 0,
      raf: null,
    }));

    layout.forEach((item, index) => {
      const button = buttonRefs.current[index];
      if (!button) return;
      button.style.setProperty("--rx", `${item.rx}deg`);
      button.style.setProperty("--ry", `${item.ry}deg`);
    });

    const rotations = rotationsRef.current;
    return () => {
      rotations.forEach((rotation) => {
        if (rotation.raf) window.cancelAnimationFrame(rotation.raf);
      });
    };
  }, [layout, renderGroup.id]);

  useEffect(() => {
    applyOrbit();
    applyParallax();
  }, [applyOrbit, applyParallax]);

  useEffect(() => {
    const orbit = orbitRef.current;

    return () => {
      if (orbit.raf) window.cancelAnimationFrame(orbit.raf);
    };
  }, []);

  const startObjectInertia = useCallback((index: number) => {
    const rotation = rotationsRef.current[index];
    const button = buttonRefs.current[index];
    if (!rotation || !button) return;

    if (rotation.raf) window.cancelAnimationFrame(rotation.raf);

    const step = () => {
      rotation.ry = clamp(rotation.ry + rotation.vy, -78, 78);
      rotation.rx = clamp(rotation.rx + rotation.vx, -58, 58);
      rotation.vy *= 0.93;
      rotation.vx *= 0.9;

      button.style.setProperty("--rx", `${rotation.rx}deg`);
      button.style.setProperty("--ry", `${rotation.ry}deg`);

      if (Math.abs(rotation.vy) > 0.03 || Math.abs(rotation.vx) > 0.03) {
        rotation.raf = window.requestAnimationFrame(step);
      } else {
        rotation.raf = null;
      }
    };

    rotation.raf = window.requestAnimationFrame(step);
  }, []);

  const resetObject = useCallback(
    (index: number) => {
      const rotation = rotationsRef.current[index];
      const item = layout[index];
      if (!rotation || !item) return;

      if (rotation.raf) {
        window.cancelAnimationFrame(rotation.raf);
        rotation.raf = null;
      }

      rotation.rx = item.rx;
      rotation.ry = item.ry;
      rotation.vx = 0;
      rotation.vy = 0;

      const button = buttonRefs.current[index];
      if (button) {
        button.style.setProperty("--rx", `${item.rx}deg`);
        button.style.setProperty("--ry", `${item.ry}deg`);
      }
    },
    [layout],
  );

  const resetView = useCallback(() => {
    const orbit = orbitRef.current;
    if (orbit.raf) {
      window.cancelAnimationFrame(orbit.raf);
      orbit.raf = null;
    }

    orbit.active = false;
    orbit.rx = DEFAULT_ORBIT_X;
    orbit.ry = DEFAULT_ORBIT_Y;
    orbit.vx = 0;
    orbit.vy = 0;

    stageRef.current?.removeAttribute("data-orbiting");
    applyOrbit();

    parallaxState.current = { x: 0, y: 0 };
    applyParallax();

    layout.forEach((_, index) => resetObject(index));
    scheduleIdleMotion();
  }, [
    applyOrbit,
    applyParallax,
    layout,
    resetObject,
    scheduleIdleMotion,
  ]);

  const startOrbitInertia = useCallback(() => {
    const orbit = orbitRef.current;
    if (orbit.raf) window.cancelAnimationFrame(orbit.raf);

    const step = () => {
      orbit.ry = clamp(orbit.ry + orbit.vy, -34, 34);
      orbit.rx = clamp(orbit.rx + orbit.vx, -18, 18);
      orbit.vy *= 0.94;
      orbit.vx *= 0.9;

      applyOrbit();

      if (Math.abs(orbit.vy) > 0.02 || Math.abs(orbit.vx) > 0.02) {
        orbit.raf = window.requestAnimationFrame(step);
      } else {
        orbit.raf = null;
        stageRef.current?.removeAttribute("data-orbiting");
      }
    };

    orbit.raf = window.requestAnimationFrame(step);
  }, [applyOrbit]);

  const handleStagePointerDown = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    pauseIdleMotion();

    const orbit = orbitRef.current;
    if (orbit.raf) {
      window.cancelAnimationFrame(orbit.raf);
      orbit.raf = null;
    }

    orbit.active = true;
    orbit.pointerId = event.pointerId;
    orbit.lastX = event.clientX;
    orbit.lastY = event.clientY;
    orbit.lastTime = event.timeStamp;
    orbit.vx = 0;
    orbit.vy = 0;

    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.dataset.orbiting = "true";

    if (parallaxState.current.x !== 0 || parallaxState.current.y !== 0) {
      parallaxState.current = { x: 0, y: 0 };
      applyParallax();
    }
  };

  const handleStagePointerMove = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    const orbit = orbitRef.current;

    if (orbit.active && orbit.pointerId === event.pointerId) {
      const dx = event.clientX - orbit.lastX;
      const dy = event.clientY - orbit.lastY;
      orbit.lastX = event.clientX;
      orbit.lastY = event.clientY;

      orbit.ry = clamp(orbit.ry + dx * 0.32, -34, 34);
      orbit.rx = clamp(orbit.rx + dy * 0.2, -18, 18);

      const now = event.timeStamp;
      const elapsed = Math.max(now - orbit.lastTime, 1);
      orbit.vy = ((dx * 0.32) / elapsed) * 16;
      orbit.vx = ((dy * 0.2) / elapsed) * 16;
      orbit.lastTime = now;

      applyOrbit();
      return;
    }

    if (reducedMotion || event.pointerType !== "mouse") return;

    const rect = event.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const nx = clamp((event.clientX - rect.left) / rect.width - 0.5, -0.5, 0.5);
    const ny = clamp((event.clientY - rect.top) / rect.height - 0.5, -0.5, 0.5);

    parallaxState.current = { x: -ny * 5, y: nx * 7 };
    applyParallax();
  };

  const handleStagePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const orbit = orbitRef.current;
    if (!orbit.active || orbit.pointerId !== event.pointerId) return;

    orbit.active = false;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    scheduleIdleMotion();

    if (reducedMotion) {
      event.currentTarget.removeAttribute("data-orbiting");
    } else {
      startOrbitInertia();
    }
  };

  const handleStagePointerCancel = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    const orbit = orbitRef.current;
    if (!orbit.active || orbit.pointerId !== event.pointerId) return;

    orbit.active = false;
    orbit.vx = 0;
    orbit.vy = 0;
    if (orbit.raf) {
      window.cancelAnimationFrame(orbit.raf);
      orbit.raf = null;
    }
    event.currentTarget.removeAttribute("data-orbiting");
    scheduleIdleMotion();
  };

  const handleStagePointerLeave = () => {
    if (orbitRef.current.active) return;
    if (reducedMotion) return;
    if (parallaxState.current.x === 0 && parallaxState.current.y === 0) return;

    parallaxState.current = { x: 0, y: 0 };
    applyParallax();
  };

  const handleObjectPointerDown = (
    event: ReactPointerEvent<HTMLButtonElement>,
    index: number,
  ) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    event.stopPropagation();
    pauseIdleMotion();

    const rotation = rotationsRef.current[index];
    if (!rotation) return;

    if (rotation.raf) {
      window.cancelAnimationFrame(rotation.raf);
      rotation.raf = null;
    }
    rotation.vx = 0;
    rotation.vy = 0;

    const drag = objectDragRef.current;
    drag.active = true;
    drag.pointerId = event.pointerId;
    drag.index = index;
    drag.lastX = event.clientX;
    drag.lastY = event.clientY;
    drag.lastTime = event.timeStamp;
    drag.moved = 0;

    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.dataset.dragging = "true";
  };

  const handleObjectPointerMove = (
    event: ReactPointerEvent<HTMLButtonElement>,
  ) => {
    const drag = objectDragRef.current;
    if (!drag.active || drag.pointerId !== event.pointerId) return;

    const dx = event.clientX - drag.lastX;
    const dy = event.clientY - drag.lastY;
    drag.lastX = event.clientX;
    drag.lastY = event.clientY;
    drag.moved += Math.abs(dx) + Math.abs(dy);

    const rotation = rotationsRef.current[drag.index];
    if (!rotation) return;

    const sensitivity = event.pointerType === "touch" ? 0.5 : 0.42;

    rotation.ry = clamp(rotation.ry + dx * sensitivity, -78, 78);
    rotation.rx = clamp(rotation.rx + dy * sensitivity * 0.8, -58, 58);

    const now = event.timeStamp;
    const elapsed = Math.max(now - drag.lastTime, 1);
    rotation.vy = ((dx * sensitivity) / elapsed) * 16;
    rotation.vx = ((dy * sensitivity * 0.8) / elapsed) * 16;
    drag.lastTime = now;

    const button = event.currentTarget;
    button.style.setProperty("--rx", `${rotation.rx}deg`);
    button.style.setProperty("--ry", `${rotation.ry}deg`);
  };

  const handleObjectPointerUp = (
    event: ReactPointerEvent<HTMLButtonElement>,
  ) => {
    const drag = objectDragRef.current;
    if (!drag.active || drag.pointerId !== event.pointerId) return;

    drag.active = false;
    event.currentTarget.dataset.dragging = "false";
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    scheduleIdleMotion();

    if (drag.moved > 6) {
      lastDragAtRef.current = event.timeStamp;
      if (!reducedMotion) startObjectInertia(drag.index);
    }
  };

  const handleObjectPointerCancel = (
    event: ReactPointerEvent<HTMLButtonElement>,
  ) => {
    const drag = objectDragRef.current;
    if (!drag.active || drag.pointerId !== event.pointerId) return;

    drag.active = false;
    event.currentTarget.dataset.dragging = "false";
    event.currentTarget.removeAttribute("data-dragging");
    scheduleIdleMotion();
  };

  const handleObjectClick = (
    event: ReactMouseEvent<HTMLButtonElement>,
    index: number,
  ) => {
    if (event.detail > 1) return;
    if (event.timeStamp - lastDragAtRef.current < 220) return;
    setSelectedIndex((current) => (current === index ? null : index));
  };

  const handleObjectDoubleClick = (
    event: ReactMouseEvent<HTMLButtonElement>,
    index: number,
  ) => {
    event.stopPropagation();
    resetObject(index);
    scheduleIdleMotion();
  };

  const handleObjectKeyDown = (
    event: ReactKeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    const rotation = rotationsRef.current[index];
    const button = buttonRefs.current[index];
    if (!rotation || !button) return;

    const step = event.shiftKey ? 4 : 12;

    switch (event.key) {
      case "ArrowLeft":
        rotation.ry -= step;
        break;
      case "ArrowRight":
        rotation.ry += step;
        break;
      case "ArrowUp":
        rotation.rx -= step;
        break;
      case "ArrowDown":
        rotation.rx += step;
        break;
      case "Home":
      case "r":
      case "R":
        event.preventDefault();
        resetObject(index);
        return;
      default:
        return;
    }

    event.preventDefault();
    rotation.ry = clamp(rotation.ry, -78, 78);
    rotation.rx = clamp(rotation.rx, -58, 58);
    button.style.setProperty("--rx", `${rotation.rx}deg`);
    button.style.setProperty("--ry", `${rotation.ry}deg`);
    pauseIdleMotion();
    scheduleIdleMotion();
  };

  const selectedSkill =
    selectedIndex !== null ? renderGroup.skills[selectedIndex] : null;
  const selectedColor = selectedSkill
    ? (techBrandColor(selectedSkill.icon) ?? accentHex)
    : accentHex;
  const total = renderGroup.skills.length;
  const markSize =
    total <= 5
      ? "clamp(56px, 18vw, 72px)"
      : total <= 7
        ? "clamp(50px, 16vw, 62px)"
        : "clamp(46px, 14vw, 56px)";

  return (
    <div
      ref={inViewRef}
      className="tech-universe"
      style={{ "--universe-accent": accentHex } as CssVars}
    >
      <div className="tech-universe-topbar">
        <p className="tech-universe-hint" id={hintId}>
          Drag to rotate
          <span className="tech-universe-hint-orbit">
            {" "}
            · drag space to orbit
          </span>
        </p>
        <button
          type="button"
          className="tech-universe-reset"
          onClick={resetView}
          aria-label="Reset 3D technology view"
        >
          <RotateCcw size={11} aria-hidden="true" />
          Reset
        </button>
      </div>

      <div
        ref={stageRef}
        className="tech-universe-stage"
        data-phase={phase}
        data-active={active ? "true" : "false"}
        data-reduced-motion={reducedMotion ? "true" : "false"}
        role="group"
        aria-label={`Interactive 3D ${renderGroup.label} technology objects`}
        aria-describedby={`${hintId} ${hintId}-keys`}
        onPointerDown={handleStagePointerDown}
        onPointerMove={handleStagePointerMove}
        onPointerUp={handleStagePointerUp}
        onPointerCancel={handleStagePointerCancel}
        onPointerLeave={handleStagePointerLeave}
      >
        <div className="tech-universe-backdrop" aria-hidden="true">
          <span className="tech-universe-stars" />
          <span className="tech-universe-grid" />
          <span className="tech-universe-orbit tech-universe-orbit--one" />
          <span className="tech-universe-orbit tech-universe-orbit--two" />
          <span className="tech-universe-core" />
        </div>

        <div ref={parallaxRef} className="tech-universe-parallax">
          <div className="tech-universe-idle">
            <div ref={worldRef} className="tech-universe-world">
              {renderGroup.skills.map((skill, index) => {
                const item = layout[index];
                if (!item) return null;

                const color = techBrandColor(skill.icon) ?? accentHex;
                const wide = techMarkIsWide(skill.icon);
                const selected = selectedIndex === index;

                return (
                  <div
                    key={`${renderGroup.id}-${skill.name}`}
                    className="tech-object"
                    data-selected={selected ? "true" : undefined}
                    data-wide={wide ? "true" : undefined}
                    data-learning={skill.learning ? "true" : undefined}
                    data-label={item.y > 64 ? "top" : "bottom"}
                    style={
                      {
                        "--x": item.x,
                        "--y": item.y,
                        "--z": item.z,
                        "--scale": item.scale,
                        "--i": index,
                        "--rx": `${item.rx}deg`,
                        "--ry": `${item.ry}deg`,
                        "--rz": `${item.rz}deg`,
                        "--mark-size": markSize,
                        "--float-duration": `${item.duration}s`,
                        "--float-delay": `${item.delay}s`,
                        "--drift-duration": `${(item.duration * 2.2).toFixed(2)}s`,
                        "--tech-color": color,
                      } as CssVars
                    }
                  >
                    <div className="tech-object-entry">
                      <div className="tech-object-float">
                        <span
                          className="tech-object-aura"
                          aria-hidden="true"
                        />
                        <span
                          className="tech-object-ring"
                          aria-hidden="true"
                        />
                        <span
                          className="tech-object-pool"
                          aria-hidden="true"
                        />

                        <div className="tech-object-drift">
                          <button
                            ref={(node) => {
                              buttonRefs.current[index] = node;
                              if (!node) return;
                              const rotation = rotationsRef.current[index];
                              if (!rotation) return;
                              node.style.setProperty("--rx", `${rotation.rx}deg`);
                              node.style.setProperty("--ry", `${rotation.ry}deg`);
                            }}
                            type="button"
                            className="tech-object-button"
                            data-index={index}
                            data-learning={skill.learning ? "true" : undefined}
                            aria-pressed={selected}
                            aria-label={`${skill.name}${
                              skill.learning ? " — learning" : ""
                            }`}
                            title={`${skill.name} — drag to rotate, double-click to reset`}
                            onClick={(event) => handleObjectClick(event, index)}
                            onDoubleClick={(event) =>
                              handleObjectDoubleClick(event, index)
                            }
                            onKeyDown={(event) =>
                              handleObjectKeyDown(event, index)
                            }
                            onPointerDown={(event) =>
                              handleObjectPointerDown(event, index)
                            }
                            onPointerMove={handleObjectPointerMove}
                            onPointerUp={handleObjectPointerUp}
                            onPointerCancel={handleObjectPointerCancel}
                          >
                            <span className="tech-object-visual">
                              {[4, 3, 2, 1].map((depth) => (
                                <span
                                  key={depth}
                                  className="tech-object-layer"
                                  style={
                                    {
                                      "--depth": depth,
                                      filter: `brightness(${
                                        0.18 + (4 - depth) * 0.07
                                      })`,
                                    } as CssVars
                                  }
                                  aria-hidden="true"
                                >
                                  <TechIcon
                                    iconId={skill.icon}
                                    name={skill.name}
                                    bare
                                    decorative
                                    className="tech-object-mark"
                                  />
                                </span>
                              ))}
                              <span
                                className="tech-object-edge"
                                aria-hidden="true"
                              >
                                <TechIcon
                                  iconId={skill.icon}
                                  name={skill.name}
                                  bare
                                  decorative
                                  className="tech-object-mark"
                                />
                              </span>
                              <span
                                className="tech-object-face"
                                aria-hidden="true"
                              >
                                <TechIcon
                                  iconId={skill.icon}
                                  name={skill.name}
                                  bare
                                  decorative
                                  className="tech-object-mark"
                                />
                              </span>
                            </span>
                          </button>
                        </div>

                        <span
                          className="tech-object-label"
                          aria-hidden="true"
                        >
                          {skill.name}
                        </span>
                      </div>
                    </div>
                  </div>
                );
            })}
            </div>
          </div>
        </div>
      </div>

      <p id={`${hintId}-keys`} className="sr-only">
        Focus a technology object and use the arrow keys to rotate it. Press R
        or Home to reset its rotation. Press Enter or Space to select it.
      </p>

      <div className="tech-universe-readout" aria-live="polite" aria-atomic>
        <span
          className="tech-universe-readout-dot"
          style={{ background: selectedColor, color: selectedColor }}
          aria-hidden="true"
        />
        <div className="tech-universe-readout-copy">
          <p className="tech-universe-readout-name">
            {selectedSkill ? selectedSkill.name : "Select an artifact"}
          </p>
          <p className="tech-universe-readout-meta">
            {renderGroup.code} · {renderGroup.label} ·{" "}
            {selectedSkill
              ? selectedSkill.learning
                ? "learning"
                : "core"
              : `${total} objects`}
          </p>
        </div>
        <span className="tech-universe-readout-index" aria-hidden="true">
          {selectedIndex !== null
            ? `${String(selectedIndex + 1).padStart(2, "0")} / ${String(
                total,
              ).padStart(2, "0")}`
            : `${total} objects`}
        </span>
      </div>
    </div>
  );
}
