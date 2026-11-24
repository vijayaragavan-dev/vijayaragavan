"use client";

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, type RootState } from "@react-three/fiber";
import * as THREE from "three";
import ParticleField from "./ParticleField";
import { useDocumentVisible } from "@/hooks/useDocumentVisible";
import { prefersReducedMotion } from "@/hooks/useReducedMotion";
import type { DeviceTier } from "@/lib/device-capabilities";

type HeroSceneProps = {
  tier: Exclude<DeviceTier, "no-3d">;
  active?: boolean;
};

type NetworkGeometry = {
  positions: Float32Array;
  colors: Float32Array;
  linePositions: Float32Array;
  scales: Float32Array;
};

function mulberry32(seed: number) {
  let value = seed;
  return () => {
    value |= 0;
    value = (value + 0x6d2b79f5) | 0;
    let result = Math.imul(value ^ (value >>> 15), 1 | value);
    result = (result + Math.imul(result ^ (result >>> 7), 61 | result)) ^ result;
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
}

function buildNetwork(nodeCount: number): NetworkGeometry {
  const random = mulberry32(90210);
  const positions = new Float32Array(nodeCount * 3);
  const colors = new Float32Array(nodeCount * 3);
  const scales = new Float32Array(nodeCount);

  const color = new THREE.Color();

  for (let index = 0; index < nodeCount; index += 1) {
    const theta = random() * Math.PI * 2;
    const phi = Math.acos(2 * random() - 1);
    const radial = Math.cbrt(random());

    positions[index * 3] = Math.sin(phi) * Math.cos(theta) * radial * 10;
    positions[index * 3 + 1] = Math.sin(phi) * Math.sin(theta) * radial * 5.5;
    positions[index * 3 + 2] = Math.cos(phi) * radial * 4.5;

    scales[index] = 0.55 + random() * 1.1;

    const roll = random();
    if (roll > 0.9) {
      color.set("#8b7cff");
    } else if (roll > 0.72) {
      color.set("#8ef7c8");
    } else {
      color.set("#34e0a1");
    }
    color.multiplyScalar(0.6 + random() * 0.5);

    colors[index * 3] = color.r;
    colors[index * 3 + 1] = color.g;
    colors[index * 3 + 2] = color.b;
  }

  const edgePositions: number[] = [];
  const maxEdges = 3200;
  const maxDistance = 2.35;
  const attempts = nodeCount * 14;

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    if (edgePositions.length / 6 >= maxEdges) break;

    const first = Math.floor(random() * nodeCount);
    const second = Math.floor(random() * nodeCount);
    if (first === second) continue;

    const ax = positions[first * 3];
    const ay = positions[first * 3 + 1];
    const az = positions[first * 3 + 2];
    const bx = positions[second * 3];
    const by = positions[second * 3 + 1];
    const bz = positions[second * 3 + 2];

    const distance = Math.hypot(ax - bx, ay - by, az - bz);
    if (distance > maxDistance || distance < 0.55) continue;

    edgePositions.push(ax, ay, az, bx, by, bz);
  }

  return {
    positions,
    colors,
    scales,
    linePositions: new Float32Array(edgePositions),
  };
}

function NetworkField({ nodeCount }: { nodeCount: number }) {
  const spinGroup = useRef<THREE.Group>(null);
  const tiltGroup = useRef<THREE.Group>(null);
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const data = useMemo(() => buildNetwork(nodeCount), [nodeCount]);

  const lineGeometry = useMemo(() => {
    const buffer = new THREE.BufferGeometry();
    buffer.setAttribute(
      "position",
      new THREE.BufferAttribute(data.linePositions, 3),
    );
    return buffer;
  }, [data.linePositions]);

  const lineMaterial = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: new THREE.Color("#34e0a1"),
        transparent: true,
        opacity: 0.09,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  );

  useEffect(() => () => {
    lineGeometry.dispose();
    lineMaterial.dispose();
  }, [lineGeometry, lineMaterial]);

  useLayoutEffect(() => {
    if (!mesh.current) return;
    const instanceColor = new THREE.Color();

    for (let index = 0; index < nodeCount; index += 1) {
      dummy.position.set(
        data.positions[index * 3],
        data.positions[index * 3 + 1],
        data.positions[index * 3 + 2],
      );
      const scale = data.scales[index];
      dummy.scale.setScalar(scale);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(index, dummy.matrix);
      instanceColor.setRGB(
        data.colors[index * 3],
        data.colors[index * 3 + 1],
        data.colors[index * 3 + 2],
      );
      mesh.current.setColorAt(index, instanceColor);
    }

    mesh.current.instanceMatrix.needsUpdate = true;
    if (mesh.current.instanceColor) {
      mesh.current.instanceColor.needsUpdate = true;
    }
  }, [data, dummy, nodeCount]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const time = state.clock.elapsedTime;
    const reduce = prefersReducedMotion();

    if (spinGroup.current && !reduce) {
      spinGroup.current.rotation.y += dt * 0.014;
      spinGroup.current.rotation.x = Math.sin(time * 0.05) * 0.04;
    }

    if (tiltGroup.current) {
      const targetX = state.pointer.y * 0.09;
      const targetY = state.pointer.x * 0.12;
      tiltGroup.current.rotation.x = THREE.MathUtils.lerp(
        tiltGroup.current.rotation.x,
        targetX,
        0.04,
      );
      tiltGroup.current.rotation.y = THREE.MathUtils.lerp(
        tiltGroup.current.rotation.y,
        targetY,
        0.04,
      );
    }
  });

  return (
    <group ref={tiltGroup}>
      <group ref={spinGroup}>
        <instancedMesh
          ref={mesh}
          args={[undefined, undefined, nodeCount]}
          frustumCulled={false}
        >
          <icosahedronGeometry args={[0.024, 0]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.62}
            depthWrite={false}
            toneMapped={false}
          />
        </instancedMesh>
        <lineSegments
          geometry={lineGeometry}
          material={lineMaterial}
          frustumCulled={false}
        />
        <ParticleField
          count={nodeCount > 700 ? 180 : 90}
          color="#34e0a1"
          radius={10}
          height={5.5}
          depth={4}
          opacity={0.32}
        />
      </group>
    </group>
  );
}

function OrbitalAccents({ tier }: { tier: HeroSceneProps["tier"] }) {
  const group = useRef<THREE.Group>(null);
  const innerRing = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const time = state.clock.elapsedTime;
    const reduce = prefersReducedMotion();

    if (group.current) {
      group.current.rotation.x = THREE.MathUtils.lerp(
        group.current.rotation.x,
        -0.12 + state.pointer.y * 0.08,
        0.03,
      );
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y,
        -0.18 + state.pointer.x * 0.1,
        0.03,
      );
      if (!reduce) group.current.position.y = Math.sin(time * 0.35) * 0.12;
    }

    if (innerRing.current && !reduce) {
      innerRing.current.rotation.z += dt * 0.05;
    }
  });

  return (
    <group ref={group} position={[3.5, 0.15, -1.2]}>
      <mesh rotation={[0.18, -0.22, -0.32]} raycast={() => null}>
        <torusGeometry args={[2.65, 0.012, 8, 180]} />
        <meshBasicMaterial
          color="#34e0a1"
          transparent
          opacity={0.32}
          toneMapped={false}
        />
      </mesh>
      <mesh ref={innerRing} rotation={[0.32, 0.12, 0.48]} raycast={() => null}>
        <torusGeometry args={[2.12, 0.006, 8, 160]} />
        <meshBasicMaterial
          color="#8b7cff"
          transparent
          opacity={0.28}
          toneMapped={false}
        />
      </mesh>
      <mesh rotation={[0.02, 0.4, 0.16]} raycast={() => null}>
        <torusGeometry args={[3.05, 0.004, 6, 180]} />
        <meshBasicMaterial
          color="#6ff2c8"
          transparent
          opacity={0.14}
          toneMapped={false}
        />
      </mesh>
      {tier === "full" && (
        <>
          <mesh position={[-2.1, 1.5, -0.4]} rotation={[0.2, 0.5, -0.2]}>
            <planeGeometry args={[0.9, 0.55]} />
            <meshBasicMaterial
              color="#34e0a1"
              transparent
              opacity={0.06}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
          <mesh position={[2.4, -1.7, 0.3]} rotation={[-0.3, -0.4, 0.25]}>
            <planeGeometry args={[1.1, 0.7]} />
            <meshBasicMaterial
              color="#8b7cff"
              transparent
              opacity={0.06}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
        </>
      )}
      <pointLight color="#34e0a1" intensity={6} distance={8} decay={2} />
    </group>
  );
}

export default function HeroScene({ tier, active = true }: HeroSceneProps) {
  const visible = useDocumentVisible();
  const nodeCount = tier === "full" ? 760 : 420;

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
      camera={{ position: [0, 0, 10], fov: 55, near: 0.1, far: 40 }}
      dpr={[1, tier === "full" ? 1.5 : 1.25] as [number, number]}
      gl={{
        antialias: false,
        alpha: true,
        powerPreference: "high-performance",
        stencil: false,
      }}
      frameloop={visible && active ? "always" : "never"}
      performance={{ min: 0.6 }}
      onCreated={handleCreated}
      style={{ pointerEvents: "none" }}
    >
      <fog attach="fog" args={["#07090d", 9, 19]} />
      <NetworkField nodeCount={nodeCount} />
      <OrbitalAccents tier={tier} />
    </Canvas>
  );
}
