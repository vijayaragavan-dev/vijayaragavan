"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { List, Orbit } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import SectionHeading from "@/components/ui/SectionHeading";
import SkillChip from "@/components/ui/SkillChip";
import TechUniverse from "@/components/ui/TechUniverse";
import WebGLStage from "@/components/three/WebGLStage";
import { useDeviceTier } from "@/hooks/useDeviceTier";
import {
  skillGroups,
  totalSkillCount,
  type SkillGroupId,
} from "@/data/skills";
import { cn } from "@/lib/utils";

const SkillConstellation = dynamic(
  () => import("@/components/three/SkillConstellation"),
  { ssr: false },
);

const groupNotes: Record<SkillGroupId, string> = {
  programming:
    "Core languages used for problem solving, coursework and project builds.",
  frontend:
    "Interfaces built with semantic structure, responsive layout and interaction.",
  backend:
    "Server-side fundamentals: APIs, architecture and a growing Spring Boot practice.",
  database:
    "Relational and document stores, supported by database fundamentals.",
  fundamentals:
    "The computer science base that sits underneath practical development.",
  aiml:
    "Machine learning foundations with a growing Python data toolkit.",
  genai:
    "Modern generative and agentic AI concepts, from prompting to retrieval.",
};

const accentClasses = {
  emerald: {
    text: "text-emerald-bright",
    border: "border-emerald/30",
    surface: "bg-emerald/[0.08]",
    dot: "bg-emerald-bright",
  },
  violet: {
    text: "text-violet",
    border: "border-violet/30",
    surface: "bg-violet/[0.08]",
    dot: "bg-violet",
  },
  cyan: {
    text: "text-cyan",
    border: "border-cyan/30",
    surface: "bg-cyan/[0.08]",
    dot: "bg-cyan",
  },
} as const;

export default function Skills() {
  const { tier } = useDeviceTier();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [view, setView] = useState<"scene" | "list">("scene");
  const [sceneFailed, setSceneFailed] = useState(false);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const selectedGroup = skillGroups[selectedIndex] ?? skillGroups[0];
  const accent = accentClasses[selectedGroup.accent];
  const learningSkills = selectedGroup.skills.filter((skill) => skill.learning);

  const sceneTier = tier === "full" || tier === "lite" ? tier : null;
  const detectionPending = tier === null;
  const autoList = !detectionPending && (sceneTier === null || sceneFailed);
  const showSceneView = !autoList && view === "scene";
  const canOffer3D = !detectionPending && sceneTier !== null && !sceneFailed;

  const handleTabKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    let nextIndex = index;

    switch (event.key) {
      case "ArrowRight":
        nextIndex = (index + 1) % skillGroups.length;
        break;
      case "ArrowLeft":
        nextIndex = (index - 1 + skillGroups.length) % skillGroups.length;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = skillGroups.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    setSelectedIndex(nextIndex);
    tabRefs.current[nextIndex]?.focus();
  };

  const fallbackReason = sceneFailed
    ? "The 3D view is unavailable right now, so the list view is active."
    : "This device is using the accessible list view.";

  return (
    <section
      id="skills"
      aria-labelledby="skills-title"
      className="section-shell relative overflow-hidden"
    >
      <div
        className="skills-atmosphere pointer-events-none absolute inset-0 opacity-70"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent"
        aria-hidden="true"
      />

      <div className="container-page relative">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            id="skills-title"
            index="02"
            eyebrow="Skills"
            title={
              <>
                Seven disciplines. One{" "}
                <span className="text-gradient-soft">growing stack.</span>
              </>
            }
            description="Explore the constellation, or switch to a plain list whenever you prefer. Every group and every skill is available without WebGL."
          />

          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <span className="chip chip-accent">{totalSkillCount} skills</span>
            <span className="chip">7 groups</span>
          </div>
        </div>

        <div className="mt-9 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          {showSceneView ? (
            <div
              role="tablist"
              aria-label="Skill categories"
              aria-orientation="horizontal"
              className="-mx-1 flex max-w-full gap-1.5 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {skillGroups.map((group, index) => {
                const selected = index === selectedIndex;
                return (
                  <button
                    key={group.id}
                    ref={(node) => {
                      tabRefs.current[index] = node;
                    }}
                    type="button"
                    role="tab"
                    id={`skill-tab-${group.id}`}
                    aria-selected={selected}
                    aria-controls="skills-panel"
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setSelectedIndex(index)}
                    onKeyDown={(event) => handleTabKeyDown(event, index)}
                    className={cn(
                      "pill-filter shrink-0 gap-2 whitespace-nowrap",
                      selected && "shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]",
                    )}
                    data-active={selected}
                  >
                    <span
                      className={cn(
                        "font-mono text-[9px]",
                        selected ? "text-emerald-bright" : "text-muted/45",
                      )}
                    >
                      {group.index}
                    </span>
                    {group.label}
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="mono-label text-muted/55">
              {totalSkillCount} skills across 7 groups
            </p>
          )}

          {canOffer3D && (
            <div
              role="group"
              aria-label="Skills view"
              className="glass-quiet inline-flex shrink-0 items-center gap-1 self-start rounded-full p-1"
            >
              <button
                type="button"
                onClick={() => setView("scene")}
                aria-pressed={showSceneView}
                className={cn(
                  "inline-flex min-h-9 items-center gap-1.5 rounded-full px-3 font-mono text-[9px] uppercase tracking-[0.12em] transition-colors",
                  showSceneView
                    ? "bg-emerald/[0.12] text-emerald-bright"
                    : "text-muted/60 hover:text-ink",
                )}
              >
                <Orbit size={12} aria-hidden="true" />
                3D
              </button>
              <button
                type="button"
                onClick={() => setView("list")}
                aria-pressed={!showSceneView}
                className={cn(
                  "inline-flex min-h-9 items-center gap-1.5 rounded-full px-3 font-mono text-[9px] uppercase tracking-[0.12em] transition-colors",
                  !showSceneView
                    ? "bg-white/[0.08] text-ink"
                    : "text-muted/60 hover:text-ink",
                )}
              >
                <List size={12} aria-hidden="true" />
                List
              </button>
            </div>
          )}
        </div>

        <p className="sr-only" aria-live="polite">
          Selected skill group: {selectedGroup.label}.
        </p>

        {showSceneView ? (
          <div className="mt-5 grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
            <div className="relative h-[460px] overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_50%_44%,rgba(52,224,161,0.13),transparent_52%),radial-gradient(circle_at_80%_18%,rgba(139,124,255,0.08),transparent_55%),linear-gradient(165deg,#0a1016,#06090d)] sm:h-[540px] lg:h-[620px]">
              <div
                className="blueprint-grid pointer-events-none absolute inset-0 opacity-35"
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute left-1/2 top-1/2 h-[62%] w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(52,224,161,0.12),transparent_66%)] blur-2xl"
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
                aria-hidden="true"
              >
                <span className="skill-core-badge">VJ</span>
              </div>

              {sceneTier && (
                <WebGLStage
                  id="skills"
                  interactive
                  onError={() => setSceneFailed(true)}
                  className="absolute inset-0 z-10"
                >
                  <SkillConstellation
                    tier={sceneTier}
                    selectedIndex={selectedIndex}
                    onSelect={setSelectedIndex}
                  />
                </WebGLStage>
              )}

              {detectionPending && (
                <div className="absolute inset-0 z-20 grid place-items-center">
                  <span className="scene-loader font-mono text-[10px] uppercase tracking-[0.2em] text-muted/60">
                    Initializing constellation…
                  </span>
                </div>
              )}

              <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-3 p-4">
                <span className="chip bg-[#06090c]/65 backdrop-blur-md">
                  Drag to rotate · tap a node
                </span>
                <span className="hidden items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-muted/45 sm:flex">
                  <span className={cn("h-1 w-1 rounded-full", accent.dot)} />
                  {selectedGroup.code} / {selectedGroup.index} · {selectedGroup.label}
                </span>
              </div>

              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-end justify-between gap-3 p-4">
                <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted/50">
                  <span className={accent.text}>{selectedGroup.code}</span>
                  <span className="mx-2 text-white/15" aria-hidden="true">
                    /
                  </span>
                  <span className="text-ink/70">{selectedGroup.shortLabel}</span>
                </div>
                <span className="hidden font-mono text-[9px] uppercase tracking-[0.16em] text-muted/35 md:inline">
                  7 nodes · live graph
                </span>
              </div>
            </div>

            <div
              role="tabpanel"
              id="skills-panel"
              aria-labelledby={`skill-tab-${selectedGroup.id}`}
              className="glass-strong node-frame flex min-h-[320px] flex-col rounded-3xl p-5 sm:p-6"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="eyebrow">
                  <span className="eyebrow-bracket" aria-hidden="true">
                    [ {selectedGroup.index} ]
                  </span>
                  <span className={accent.text}>{selectedGroup.code}</span>
                </span>
                <span className="chip">{selectedGroup.skills.length} skills</span>
              </div>

              <div className="mt-4 flex flex-1 flex-col">
                <h3 className="font-display text-2xl font-medium tracking-tight text-ink">
                  {selectedGroup.label}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-muted">
                  {groupNotes[selectedGroup.id]}
                </p>

                <TechUniverse group={selectedGroup} />

                {learningSkills.length > 0 && (
                  <p
                    className={cn(
                      "mt-3 flex items-center gap-1.5 font-mono text-[8.5px] uppercase tracking-[0.1em]",
                      accent.text,
                    )}
                  >
                    <span
                      className={cn("h-1 w-1 rounded-full", accent.dot)}
                      aria-hidden="true"
                    />
                    {learningSkills.length} learning · dashed orbit
                  </p>
                )}

                <div className="mt-auto flex items-center justify-between gap-3 border-t border-white/[0.07] pt-4">
                  <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted/45">
                    {selectedGroup.index} / 07
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted/45">
                    Keyboard: ← →
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-5">
            {autoList && (
              <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.14em] text-muted/45">
                {fallbackReason}
              </p>
            )}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {skillGroups.map((group) => {
                const groupAccent = accentClasses[group.accent];
                const groupLearning = group.skills.filter(
                  (skill) => skill.learning,
                ).length;

                return (
                  <div key={group.id}>
                    <GlassCard className="node-frame h-full p-5">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted/45">
                          {group.index}
                        </span>
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[8.5px] uppercase tracking-[0.12em]",
                            groupAccent.border,
                            groupAccent.surface,
                            groupAccent.text,
                          )}
                        >
                          <span
                            className={cn("h-1 w-1 rounded-full", groupAccent.dot)}
                            aria-hidden="true"
                          />
                          {group.code}
                        </span>
                      </div>
                      <h3 className="mt-3 font-display text-lg font-medium tracking-tight text-ink">
                        {group.label}
                      </h3>
                      <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted">
                        {groupNotes[group.id]}
                      </p>
                      <ul
                        className="mt-4 flex flex-wrap gap-1.5"
                        aria-label={`${group.label} skills`}
                      >
                        {group.skills.map((skill) => (
                          <li key={skill.name}>
                            <SkillChip
                              name={skill.name}
                              learning={skill.learning}
                            />
                          </li>
                        ))}
                      </ul>
                      <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3 font-mono text-[9px] uppercase tracking-[0.12em] text-muted/40">
                        <span>{group.skills.length} skills</span>
                        <span>
                          {groupLearning > 0
                            ? `${groupLearning} learning`
                            : "core"}
                        </span>
                      </div>
                    </GlassCard>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
