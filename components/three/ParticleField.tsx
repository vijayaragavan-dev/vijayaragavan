"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { prefersReducedMotion } from "@/hooks/useReducedMotion";

type ParticleFieldProps = {
  count?: number;
  color?: string;
  radius?: number;
  height?: number;
  depth?: number;
  opacity?: number;
};

const vertexShader = `
  uniform float uTime;
  varying float vFade;

  void main() {
    vec3 pos = position;
    pos.y += sin(uTime * 0.11 + position.x * 1.6) * 0.34;
    pos.x += cos(uTime * 0.08 + position.y * 1.2) * 0.24;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    float scale = 0.8 + 1.6 * fract(sin(position.x * 12.9898 + position.y * 78.233) * 43758.5453);
    gl_PointSize = scale * (24.0 / max(1.0, -mvPosition.z));
    vFade = smoothstep(22.0, 5.0, -mvPosition.z);
  }
`;

const fragmentShader = `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vFade;

  void main() {
    vec2 coord = gl_PointCoord - 0.5;
    float distanceToCenter = length(coord);
    float alpha = smoothstep(0.5, 0.04, distanceToCenter) * vFade * uOpacity;
    gl_FragColor = vec4(uColor, alpha);
  }
`;

function seededRandom(seed: number) {
  let value = seed;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

export default function ParticleField({
  count = 240,
  color = "#34e0a1",
  radius = 11,
  height = 6.5,
  depth = 4.5,
  opacity = 0.55,
}: ParticleFieldProps) {
  const material = useRef<THREE.ShaderMaterial>(null);

  const geometry = useMemo(() => {
    const random = seededRandom(1337 + count);
    const positions = new Float32Array(count * 3);

    for (let index = 0; index < count; index += 1) {
      positions[index * 3] = (random() - 0.5) * 2 * radius;
      positions[index * 3 + 1] = (random() - 0.5) * 2 * height;
      positions[index * 3 + 2] = (random() - 0.5) * 2 * depth;
    }

    const buffer = new THREE.BufferGeometry();
    buffer.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return buffer;
  }, [count, radius, height, depth]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: opacity },
    }),
    [color, opacity],
  );

  useFrame((state) => {
    if (prefersReducedMotion()) return;

    if (material.current) {
      material.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={material}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
