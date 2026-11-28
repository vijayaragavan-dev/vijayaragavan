"use client";

import { useEffect, useMemo, useRef } from "react";
import {
  Canvas,
  useFrame,
  useThree,
  type RootState,
} from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import ParticleField from "./ParticleField";
import { useDocumentVisible } from "@/hooks/useDocumentVisible";
import {
  prefersReducedMotion,
  useReducedMotionPreference,
} from "@/hooks/useReducedMotion";
import { skillGroups } from "@/data/skills";
import type { DeviceTier } from "@/lib/device-capabilities";

type SkillConstellationProps = {
  tier: Exclude<DeviceTier, "no-3d">;
  selectedIndex: number;
  onSelect: (index: number) => void;
  active?: boolean;
};

const NODE_POSITIONS: [number, number, number][] = [
  [0, 3.15, -0.35],
  [2.75, 1.55, 0.35],
  [3.15, -0.95, -0.25],
  [1.7, -2.9, 0.35],
  [-1.7, -2.9, -0.35],
  [-3.15, -0.95, 0.25],
  [-2.75, 1.55, -0.35],
];

const ACCENT_COLORS: Record<string, string> = {
  emerald: "#34e0a1",
  violet: "#8b7cff",
  cyan: "#58d8f5",
};

type DragState = {
  dragging: boolean;
  moved: number;
};

/** Seconds of stillness before the autonomous rotation eases back in. */
const IDLE_RESUME_DELAY = 2.4;
/** Time constants for easing the autonomous rotation in and out. */
const IDLE_EASE_IN = 0.95;
const IDLE_EASE_OUT = 0.18;
/** Inertia decay per second, matched to the previous per-frame feel. */
const INERTIA_DECAY = 3.7;
/**
 * The constellation is a nearly flat ring. A full 360 deg yaw would turn it
 * edge-on every quarter turn, collapsing the nodes and colliding the labels,
 * so the autonomous pass drifts through a bounded arc instead. The manual
 * drag range is unchanged, and this amplitude keeps the default composition
 * (plus the usual ~20 deg of manual offset) inside the range that stays
 * readable; only a deliberately extreme manual angle can reach the edge-on
 * band, exactly as it could before this change.
 */
const AUTO_YAW_AMPLITUDE = 0.32;

function Core() {
  const core = useRef<THREE.Group>(null);
  const halo = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (prefersReducedMotion()) return;

    const dt = Math.min(delta, 0.05);
    if (!core.current) return;
    core.current.rotation.y += dt * 0.14;
    core.current.rotation.x += dt * 0.03;

    if (halo.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.4) * 0.035;
      halo.current.scale.setScalar(pulse);
    }
  });

  return (
    <group>
      <group ref={core}>
        <mesh>
          <sphereGeometry args={[0.68, 48, 48]} />
          <meshPhysicalMaterial
            color="#0b2a22"
            emissive="#34e0a1"
            emissiveIntensity={0.85}
            roughness={0.18}
            metalness={0.55}
            clearcoat={1}
            clearcoatRoughness={0.18}
            transparent
            opacity={0.94}
          />
        </mesh>
        <mesh scale={1.16}>
          <icosahedronGeometry args={[0.68, 1]} />
          <meshBasicMaterial
            color="#8ef7c8"
            wireframe
            transparent
            opacity={0.22}
            toneMapped={false}
          />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.24, 24, 24]} />
          <meshBasicMaterial color="#f2fffa" toneMapped={false} />
        </mesh>
        <mesh rotation={[Math.PI / 2.2, 0.3, 0]} raycast={() => null}>
          <torusGeometry args={[1.02, 0.007, 6, 96]} />
          <meshBasicMaterial
            color="#6ff2c8"
            transparent
            opacity={0.55}
            toneMapped={false}
          />
        </mesh>
        <mesh rotation={[Math.PI / 1.55, -0.4, 0.6]} raycast={() => null}>
          <torusGeometry args={[1.28, 0.005, 6, 96]} />
          <meshBasicMaterial
            color="#8b7cff"
            transparent
            opacity={0.35}
            toneMapped={false}
          />
        </mesh>
      </group>

      <mesh ref={halo} scale={1.7} raycast={() => null}>
        <sphereGeometry args={[0.95, 32, 32]} />
        <meshBasicMaterial
          color="#34e0a1"
          transparent
          opacity={0.075}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <pointLight color="#34e0a1" intensity={26} distance={8} decay={2} />
    </group>
  );
}

function createLabelTexture(text: string, accent: string) {
  const scale = 2;
  const fontSize = 26 * scale;
  const paddingX = 16 * scale;
  const paddingY = 9 * scale;
  const tracking = 2.4 * scale;
  const font = `600 ${fontSize}px ui-monospace, SFMono-Regular, Menlo, monospace`;

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) return null;

  context.font = font;
  const glyphs = [...text];
  const textWidth =
    glyphs.reduce((total, glyph) => total + context.measureText(glyph).width, 0) +
    tracking * Math.max(glyphs.length - 1, 0);

  canvas.width = Math.ceil(textWidth + paddingX * 2 + 2);
  canvas.height = Math.ceil(fontSize + paddingY * 2 + 2);

  context.font = font;
  context.textBaseline = "middle";
  context.fillStyle = "rgba(7, 9, 13, 0.74)";
  context.strokeStyle = `${accent}59`;
  context.lineWidth = 1.5 * scale;
  context.beginPath();
  context.roundRect(
    1,
    1,
    canvas.width - 2,
    canvas.height - 2,
    (canvas.height - 2) / 2,
  );
  context.fill();
  context.stroke();

  let cursor = paddingX;
  context.fillStyle = "rgba(224, 243, 241, 0.86)";
  for (const glyph of glyphs) {
    context.fillText(glyph, cursor, canvas.height / 2 + scale);
    cursor += context.measureText(glyph).width + tracking;
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  texture.needsUpdate = true;

  return { texture, aspect: canvas.width / canvas.height };
}

function NodeLabel({
  text,
  accent,
  selected,
}: {
  text: string;
  accent: string;
  selected: boolean;
}) {
  const label = useMemo(() => createLabelTexture(text, accent), [accent, text]);
  const height = 0.3;

  useEffect(() => {
    if (!label) return;
    return () => label.texture.dispose();
  }, [label]);

  if (!label) return null;

  return (
    <sprite
      position={[0, -0.86, 0]}
      scale={[height * label.aspect, height, 1]}
      renderOrder={20}
      raycast={() => null}
    >
      <spriteMaterial
        map={label.texture}
        transparent
        depthTest={false}
        depthWrite={false}
        opacity={selected ? 0.98 : 0.82}
        toneMapped={false}
      />
    </sprite>
  );
}

type OrbitalNodeProps = {
  index: number;
  position: [number, number, number];
  selected: boolean;
  label: string;
  code: string;
  accent: string;
  showLabel: boolean;
  onSelect: (index: number) => void;
  dragState: React.RefObject<DragState>;
};

function OrbitalNode({
  index,
  position,
  selected,
  label,
  code,
  accent,
  showLabel,
  onSelect,
  dragState,
}: OrbitalNodeProps) {
  const node = useRef<THREE.Group>(null);
  const ringMesh = useRef<THREE.Mesh>(null);
  const sphereMaterial = useRef<THREE.MeshStandardMaterial>(null);
  const wireMaterial = useRef<THREE.MeshBasicMaterial>(null);
  const ringMaterial = useRef<THREE.MeshBasicMaterial>(null);
  const glowMaterial = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const targetScale = selected ? 1.22 : 1;

    if (node.current) {
      const next = THREE.MathUtils.damp(
        node.current.scale.x,
        targetScale,
        7,
        dt,
      );
      node.current.scale.setScalar(next);
    }

    if (sphereMaterial.current) {
      sphereMaterial.current.emissiveIntensity = THREE.MathUtils.damp(
        sphereMaterial.current.emissiveIntensity,
        selected ? 1.9 : 0.95,
        6,
        dt,
      );
    }

    if (wireMaterial.current) {
      wireMaterial.current.opacity = THREE.MathUtils.damp(
        wireMaterial.current.opacity,
        selected ? 0.55 : 0.24,
        6,
        dt,
      );
    }

    if (ringMaterial.current) {
      ringMaterial.current.opacity = THREE.MathUtils.damp(
        ringMaterial.current.opacity,
        selected ? 0.95 : 0.4,
        6,
        dt,
      );
    }

    if (glowMaterial.current) {
      glowMaterial.current.opacity = THREE.MathUtils.damp(
        glowMaterial.current.opacity,
        selected ? 0.2 : 0.09,
        6,
        dt,
      );
    }

    if (ringMesh.current && !prefersReducedMotion()) {
      ringMesh.current.rotation.z += dt * 0.32;
    }
  });

  const select = () => {
    if (
      dragState.current &&
      (dragState.current.dragging || dragState.current.moved > 8)
    ) {
      return;
    }
    onSelect(index);
  };

  return (
    <group position={position}>
      <group ref={node}>
        <mesh>
          <sphereGeometry args={[0.33, 32, 32]} />
          <meshStandardMaterial
            ref={sphereMaterial}
            color="#0a2720"
            emissive={accent}
            emissiveIntensity={0.95}
            roughness={0.24}
            metalness={0.48}
            toneMapped={false}
          />
        </mesh>
        <mesh scale={1.55} raycast={() => null}>
          <icosahedronGeometry args={[0.33, 1]} />
          <meshBasicMaterial
            ref={wireMaterial}
            color={accent}
            wireframe
            transparent
            opacity={0.24}
            toneMapped={false}
          />
        </mesh>
        <mesh
          ref={ringMesh}
          rotation={[Math.PI / 2, 0, 0]}
          raycast={() => null}
        >
          <torusGeometry args={[0.52, 0.006, 6, 64]} />
          <meshBasicMaterial
            ref={ringMaterial}
            color={accent}
            transparent
            opacity={0.4}
            toneMapped={false}
          />
        </mesh>
        <mesh scale={1.5} raycast={() => null}>
          <sphereGeometry args={[0.42, 24, 24]} />
          <meshBasicMaterial
            ref={glowMaterial}
            color={accent}
            transparent
            opacity={0.09}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        <mesh
          onClick={(event) => {
            event.stopPropagation();
            select();
          }}
          onPointerOver={(event) => {
            event.stopPropagation();
            if (!dragState.current?.dragging) onSelect(index);
          }}
        >
          <sphereGeometry args={[0.62, 12, 12]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      </group>

      {showLabel && (
        <NodeLabel
          text={`${code} · ${label}`}
          accent={accent}
          selected={selected}
        />
      )}
    </group>
  );
}

function DragController({
  group,
  dragState,
  speed,
  reducedMotion,
}: {
  group: React.RefObject<THREE.Group | null>;
  dragState: React.RefObject<DragState>;
  speed: number;
  reducedMotion: boolean;
}) {
  const { gl } = useThree();
  const rotation = useRef({
    x: -0.04,
    y: 0.12,
    autoPhase: 0,
    velocityX: 0,
    velocityY: 0,
    idleWeight: 0,
    lastInteraction: Number.NEGATIVE_INFINITY,
  });

  useEffect(() => {
    const canvas = gl.domElement;
    let lastX = 0;
    let lastY = 0;

    const handleDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      dragState.current.dragging = true;
      dragState.current.moved = 0;
      rotation.current.lastInteraction = performance.now() / 1000;
      lastX = event.clientX;
      lastY = event.clientY;
      rotation.current.velocityX = 0;
      rotation.current.velocityY = 0;
    };

    const handleMove = (event: PointerEvent) => {
      if (!dragState.current.dragging) return;

      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      lastX = event.clientX;
      lastY = event.clientY;

      dragState.current.moved += Math.abs(dx) + Math.abs(dy);
      rotation.current.lastInteraction = performance.now() / 1000;

      if (Math.abs(dx) >= Math.abs(dy)) {
        rotation.current.y += dx * 0.004;
        rotation.current.velocityY = dx * 0.004;
      } else if (event.pointerType === "mouse") {
        rotation.current.x = THREE.MathUtils.clamp(
          rotation.current.x + dy * 0.002,
          -0.38,
          0.38,
        );
        rotation.current.velocityX = dy * 0.002;
      }
    };

    const handleUp = () => {
      if (!dragState.current.dragging) return;
      dragState.current.dragging = false;
      rotation.current.lastInteraction = performance.now() / 1000;
    };

    canvas.addEventListener("pointerdown", handleDown);
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    window.addEventListener("pointercancel", handleUp);

    return () => {
      canvas.removeEventListener("pointerdown", handleDown);
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("pointercancel", handleUp);
    };
  }, [gl, dragState]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const state = rotation.current;
    const dragging = dragState.current.dragging;

    // The autonomous rotation only applies to the horizontal axis, so the
    // user's tilt and the existing composition are never altered.
    const now = performance.now() / 1000;
    const idleFor = now - state.lastInteraction;
    const idleTarget =
      !dragging && !reducedMotion && idleFor >= IDLE_RESUME_DELAY ? 1 : 0;
    const ease = idleTarget > state.idleWeight ? IDLE_EASE_IN : IDLE_EASE_OUT;
    state.idleWeight +=
      (idleTarget - state.idleWeight) * (1 - Math.exp(-dt / ease));

    const autoAngularSpeed = speed / AUTO_YAW_AMPLITUDE;
    state.autoPhase += autoAngularSpeed * state.idleWeight * dt;
    const autoYaw = Math.sin(state.autoPhase) * AUTO_YAW_AMPLITUDE;

    if (!dragging) {
      // Frame-time based so the drift and inertia feel identical at any
      // refresh rate; the previous per-frame values are scaled by 60fps.
      state.y += state.velocityY * 60 * dt;
      state.x = THREE.MathUtils.clamp(
        state.x + state.velocityX * 60 * dt,
        -0.38,
        0.38,
      );
      const decay = Math.exp(-INERTIA_DECAY * dt);
      state.velocityY *= decay;
      state.velocityX *= decay;
    } else {
      state.idleWeight = 0;
    }

    if (group.current) {
      group.current.rotation.set(state.x, state.y + autoYaw, 0);
    }
  });

  return null;
}

function Constellation({
  selectedIndex,
  onSelect,
  speed,
  reducedMotion,
}: {
  selectedIndex: number;
  onSelect: (index: number) => void;
  speed: number;
  reducedMotion: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const dragState = useRef<DragState>({ dragging: false, moved: 0 });
  const { size } = useThree();
  const fitScale = THREE.MathUtils.clamp(
    size.width / size.height / 1.15,
    0.82,
    1,
  );
  const showLabels = size.width >= 640;

  const nodeAccents = useMemo(
    () =>
      skillGroups.map(
        (groupItem) => ACCENT_COLORS[groupItem.accent] ?? "#34e0a1",
      ),
    [],
  );

  return (
    <>
      <ambientLight intensity={0.9} />
      <directionalLight position={[4, 5, 7]} intensity={1.1} color="#d8fff5" />
      <pointLight position={[4.5, 3.5, 6]} intensity={22} color="#8b7cff" distance={20} decay={2} />
      <pointLight position={[-4.5, -2.5, 5]} intensity={20} color="#34e0a1" distance={20} decay={2} />
      <DragController
        group={group}
        dragState={dragState}
        speed={speed}
        reducedMotion={reducedMotion}
      />

      <group scale={fitScale}>
      <group ref={group}>
        <Core />

        <mesh rotation={[Math.PI / 2.4, 0.15, 0]} raycast={() => null}>
          <torusGeometry args={[3.55, 0.0045, 6, 180]} />
          <meshBasicMaterial
            color="#6ff2c8"
            transparent
            opacity={0.18}
            toneMapped={false}
          />
        </mesh>
        <mesh rotation={[Math.PI / 1.7, -0.28, 0.5]} raycast={() => null}>
          <torusGeometry args={[3.95, 0.0035, 6, 180]} />
          <meshBasicMaterial
            color="#8b7cff"
            transparent
            opacity={0.13}
            toneMapped={false}
          />
        </mesh>

        {skillGroups.map((groupItem, index) => {
          const position = NODE_POSITIONS[index] ?? [0, 0, 0];
          const accent = nodeAccents[index] ?? "#34e0a1";
          const selected = selectedIndex === index;
          const nextIndex = (index + 1) % skillGroups.length;
          const nextPosition = NODE_POSITIONS[nextIndex] ?? [0, 0, 0];

          return (
            <group key={groupItem.id}>
              <Line
                points={[[0, 0, 0], position]}
                color={accent}
                lineWidth={selected ? 1.5 : 0.6}
                transparent
                opacity={selected ? 0.62 : 0.2}
              />
              <Line
                points={[position, nextPosition]}
                color={accent}
                lineWidth={0.5}
                transparent
                opacity={0.09}
              />
              <OrbitalNode
                index={index}
                position={position as [number, number, number]}
                selected={selected}
                label={groupItem.shortLabel.toUpperCase()}
                code={groupItem.code}
                accent={accent}
                showLabel={showLabels}
                onSelect={onSelect}
                dragState={dragState}
              />
            </group>
          );
        })}

        <ParticleField
          count={150}
          color="#34e0a1"
          radius={7.5}
          height={4.8}
          depth={3}
          opacity={0.42}
        />
      </group>
      </group>
    </>
  );
}

export default function SkillConstellation({
  tier,
  selectedIndex,
  onSelect,
  active = true,
}: SkillConstellationProps) {
  const visible = useDocumentVisible();
  const reducedMotion = useReducedMotionPreference();
  // Peak arc speed in rad/s. Slow enough to read as a living scene, never as
  // a carousel; the lighter tier is a touch slower so small screens stay calm.
  const rotationSpeed = tier === "full" ? 0.03 : 0.024;

  const handleCreated = ({ gl }: RootState) => {
    gl.domElement.addEventListener(
      "webglcontextlost",
      (event) => {
        event.preventDefault();
        window.dispatchEvent(new Event("vj:webgl-context-lost"));
      },
      { once: true },
    );
  };

  return (
    <Canvas
      camera={{ position: [0, 0.15, 10.4], fov: 46, near: 0.1, far: 40 }}
      dpr={[1, tier === "full" ? 1.6 : 1.25] as [number, number]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        stencil: false,
      }}
      frameloop={visible && active ? "always" : "never"}
      performance={{ min: 0.6 }}
      onCreated={handleCreated}
      className="drag-surface"
    >
      <Constellation
        selectedIndex={selectedIndex}
        onSelect={onSelect}
        speed={rotationSpeed}
        reducedMotion={reducedMotion}
      />
    </Canvas>
  );
}
