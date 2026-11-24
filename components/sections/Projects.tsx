"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
} from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Star,
} from "lucide-react";
import { GithubMark } from "@/components/ui/BrandIcons";
import Modal from "@/components/ui/Modal";
import ProjectCard from "@/components/ui/ProjectCard";
import ProjectCover from "@/components/ui/ProjectCover";
import SectionHeading from "@/components/ui/SectionHeading";
import { useDeviceTier } from "@/hooks/useDeviceTier";
import { useReducedMotionPreference } from "@/hooks/useReducedMotion";
import {
  categoryLabels,
  projectCategories,
  projects,
  type ProjectCategory,
} from "@/data/projects";
import { cn } from "@/lib/utils";

type FilterId = "all" | ProjectCategory;

export default function Projects() {
  const { tier } = useDeviceTier();
  const reduceMotion = useReducedMotionPreference();
  const [filter, setFilter] = useState<FilterId>("all");
  const [activeId, setActiveId] = useState(projects[0]?.id ?? "");
  const [openProjectId, setOpenProjectId] = useState<string | null>(null);
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const dragged = useRef(false);

  const filtered = useMemo(
    () =>
      filter === "all"
        ? projects
        : projects.filter((project) => project.category === filter),
    [filter],
  );

  const activeIndexValue = filtered.findIndex(
    (project) => project.id === activeId,
  );
  const activeIndex = activeIndexValue >= 0 ? activeIndexValue : 0;
  const activeProject = filtered[activeIndex] ?? projects[0];

  const openProject = projects.find((project) => project.id === openProjectId);

  const tiltEnabled = tier === "full" && !reduceMotion;
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateX = useSpring(
    useTransform(pointerY, [-0.5, 0.5], [4, -4]),
    { stiffness: 160, damping: 20 },
  );
  const rotateY = useSpring(
    useTransform(pointerX, [-0.5, 0.5], [-5, 5]),
    { stiffness: 160, damping: 20 },
  );

  useEffect(() => {
    pointerX.set(0);
    pointerY.set(0);
  }, [activeId, activeProject?.id, pointerX, pointerY]);

  const goTo = (index: number) => {
    if (filtered.length === 0) return;
    const nextIndex = (index + filtered.length) % filtered.length;
    setActiveId(filtered[nextIndex].id);
  };

  const goPrevious = () => goTo(activeIndex - 1);
  const goNext = () => goTo(activeIndex + 1);

  const handleCarouselKeyDown = (event: React.KeyboardEvent) => {
    if (event.target !== event.currentTarget) return;

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goPrevious();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      goNext();
    } else if (event.key === "Home") {
      event.preventDefault();
      goTo(0);
    } else if (event.key === "End") {
      event.preventDefault();
      goTo(filtered.length - 1);
    }
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    dragStart.current = { x: event.clientX, y: event.clientY };
    dragged.current = false;
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragStart.current) return;
    const dx = event.clientX - dragStart.current.x;
    const dy = event.clientY - dragStart.current.y;
    if (Math.hypot(dx, dy) > 10) dragged.current = true;
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const start = dragStart.current;
    dragStart.current = null;
    if (!start) return;

    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;

    if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      if (dx < 0) goNext();
      else goPrevious();
    }
  };

  const handleClickCapture = (event: MouseEvent<HTMLDivElement>) => {
    if (!dragged.current) return;
    event.preventDefault();
    event.stopPropagation();
    dragged.current = false;
  };

  const handleTiltMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!tiltEnabled || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const resetTilt = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  const filterOptions = useMemo(
    () =>
      projectCategories.map((category) => ({
        ...category,
        count:
          category.id === "all"
            ? projects.length
            : projects.filter((project) => project.category === category.id)
                .length,
      })),
    [],
  );

  return (
    <section
      id="projects"
      aria-labelledby="projects-title"
      className="section-shell relative overflow-hidden"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_45%_at_50%_18%,rgba(52,224,161,0.08),transparent_70%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent"
        aria-hidden="true"
      />

      <div className="container-page relative">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            id="projects-title"
            index="03"
            eyebrow="Projects"
            title={
              <>
                Selected work,{" "}
                <span className="text-gradient-soft">engineered end to end.</span>
              </>
            }
            description="Full-stack products, applied AI experiments and workflow automation. Open any card for the complete stack and links."
          />
          <p className="hidden shrink-0 font-mono text-[10px] uppercase leading-relaxed tracking-[0.16em] text-muted/45 lg:block">
            {projects.length} builds
            <span className="mx-2 text-white/15" aria-hidden="true">
              /
            </span>
            3 disciplines
          </p>
        </div>

        <div className="mt-9 flex flex-wrap items-center gap-2">
          {filterOptions.map((category) => {
            const active = filter === category.id;
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => setFilter(category.id)}
                aria-pressed={active}
                className={cn(
                  "pill-filter relative overflow-hidden",
                  active && "text-[#d8fff8]",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="project-filter-pill"
                    className="absolute inset-0 rounded-full border border-emerald/28 bg-emerald/[0.1]"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 32,
                    }}
                  />
                )}
                <span className="relative z-10">{category.label}</span>
                <span
                  className={cn(
                    "relative z-10 font-mono text-[9px]",
                    active ? "text-emerald-bright/80" : "text-muted/40",
                  )}
                >
                  {String(category.count).padStart(2, "0")}
                </span>
              </button>
            );
          })}
        </div>

        <p className="sr-only" aria-live="polite">
          {filtered.length} projects shown. Active project:{" "}
          {activeProject?.title}.
        </p>

        <div className="relative mt-4 md:mt-0">
          <div
            role="region"
            aria-roledescription="carousel"
            aria-label="Project coverflow. Use the left and right arrow keys to browse projects."
            tabIndex={0}
            onKeyDown={handleCarouselKeyDown}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={() => {
              dragStart.current = null;
            }}
            onClickCapture={handleClickCapture}
            className="relative hidden h-[600px] touch-pan-y items-center justify-center rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald/40 focus-visible:ring-offset-4 focus-visible:ring-offset-[#07090d] md:flex lg:h-[640px]"
            style={{ perspective: "1800px" }}
          >
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[860px] max-w-[95vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(52,224,161,0.11),transparent_66%)] blur-2xl"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute inset-y-8 left-0 z-40 w-24 bg-linear-to-r from-[#07090d] to-transparent"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute inset-y-8 right-0 z-40 w-24 bg-linear-to-l from-[#07090d] to-transparent"
              aria-hidden="true"
            />

            {filtered.map((project, index) => {
              let offset = index - activeIndex;
              if (filtered.length > 2) {
                if (offset > filtered.length / 2) offset -= filtered.length;
                else if (offset < -filtered.length / 2) offset += filtered.length;
              }

              const distance = Math.abs(offset);
              const isActive = distance === 0;
              const isVisible = distance <= 2;
              const scale = isActive ? 1 : distance === 1 ? 0.82 : 0.66;
              const translateX = offset * (distance === 1 ? 70 : 112);
              const translateY = distance * 14;
              const translateZ = -distance * (distance === 1 ? 150 : 260);
              const rotateYOffset = offset * -22;

              return (
                <div
                  key={project.id}
                  aria-hidden={!isActive ? true : undefined}
                  onClick={isActive ? undefined : () => goTo(index)}
                  onKeyDown={
                    isActive
                      ? undefined
                      : (event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            goTo(index);
                          }
                        }
                  }
                  className={cn(
                    "absolute left-1/2 top-1/2 w-[min(410px,82vw)] transition-[transform,opacity,filter] duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                    isActive ? "cursor-default" : "cursor-pointer",
                  )}
                  style={{
                    zIndex: isActive ? 30 : 20 - distance,
                    opacity: isVisible
                      ? isActive
                        ? 1
                        : distance === 1
                          ? 0.8
                          : 0.34
                      : 0,
                    pointerEvents: isVisible ? "auto" : "none",
                    transform: `translate3d(-50%, -50%, 0) translate3d(${translateX}%, ${translateY}%, ${translateZ}px) rotateY(${rotateYOffset}deg) scale(${scale})`,
                    transformStyle: "preserve-3d",
                    filter: isActive
                      ? "none"
                      : `blur(${distance === 1 ? 1 : 3}px) brightness(${distance === 1 ? 0.78 : 0.55}) saturate(0.9)`,
                  }}
                >
                  <div
                    onPointerMove={isActive ? handleTiltMove : undefined}
                    onPointerLeave={isActive ? resetTilt : undefined}
                  >
                    <motion.div
                      style={
                        isActive && tiltEnabled
                          ? {
                              rotateX,
                              rotateY,
                              transformPerspective: 1000,
                            }
                          : undefined
                      }
                      className="transition-shadow duration-500"
                    >
                      <ProjectCard
                        project={project}
                        interactive={isActive}
                        onOpen={
                          isActive
                            ? () => setOpenProjectId(project.id)
                            : undefined
                        }
                        className={cn(
                          "h-full",
                          isActive &&
                            "shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_50px_100px_-40px_rgba(0,0,0,0.98),0_0_60px_-20px_rgba(52,224,161,0.22)]",
                        )}
                      />
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-2 hidden items-center justify-between gap-4 md:flex">
            <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-muted/40">
              <span>Drag or use</span>
              <span aria-hidden="true">← →</span>
            </div>

            <div
              className="hidden items-center gap-2 md:flex"
              role="group"
              aria-label="Choose a project"
            >
              {filtered.map((project, index) => {
                const selected = index === activeIndex;
                return (
                  <button
                    key={project.id}
                    type="button"
                    onClick={() => goTo(index)}
                    aria-label={`Show project ${project.number}: ${project.title}`}
                    aria-current={selected ? "true" : undefined}
                    className="group/dot flex h-8 w-6 items-center justify-center"
                  >
                    <span
                      className={cn(
                        "block h-1.5 rounded-full transition-all duration-300",
                        selected
                          ? "w-6 bg-emerald-bright shadow-[0_0_10px_rgba(111,242,200,0.45)]"
                          : "w-1.5 bg-white/20 group-hover/dot:bg-white/40",
                      )}
                    />
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={goPrevious}
                disabled={filtered.length < 2}
                aria-label="Previous project"
                className="icon-button h-10 w-10 disabled:cursor-not-allowed disabled:opacity-35"
              >
                <ChevronLeft size={16} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={goNext}
                disabled={filtered.length < 2}
                aria-label="Next project"
                className="icon-button h-10 w-10 disabled:cursor-not-allowed disabled:opacity-35"
              >
                <ChevronRight size={16} aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="mt-4 md:hidden">
            <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.16em] text-muted/40">
              Swipe to browse · tap for details
            </p>
            <div
              className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-4 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              aria-label="Projects"
            >
              {filtered.map((project) => (
                <div
                  key={project.id}
                  className="w-[86vw] max-w-[380px] shrink-0 snap-center"
                >
                  <ProjectCard
                    project={project}
                    onOpen={() => setOpenProjectId(project.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={Boolean(openProject)}
        onOpenChange={(open) => {
          if (!open) setOpenProjectId(null);
        }}
        title={openProject?.title ?? ""}
        description={openProject?.description ?? ""}
        media={
          openProject ? (
            <ProjectCover
              project={openProject}
              className="aspect-[16/9] w-full"
            />
          ) : null
        }
        eyebrow={
          openProject ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="chip">{categoryLabels[openProject.category]}</span>
              <span className="chip">{openProject.number}</span>
              {openProject.featured && (
                <span className="cover-ribbon">
                  <Star size={10} aria-hidden="true" />
                  Featured
                </span>
              )}
            </div>
          ) : null
        }
      >
        {openProject && (
          <>
            <div>
              <p className="mono-label text-muted/55">Complete stack</p>
              <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Complete tech stack">
                {openProject.stack.map((item) => (
                  <li key={item} className="chip">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              {openProject.demo && (
                <a
                  href={openProject.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  Live demo
                  <ExternalLink size={14} aria-hidden="true" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              )}
              {openProject.code && (
                <a
                  href={openProject.code}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                >
                  <GithubMark size={14} aria-hidden="true" />
                  View code
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              )}
              {!openProject.demo && !openProject.code && (
                <p className="text-sm text-muted/70">
                  No public links are listed for this project.
                </p>
              )}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 border-t border-white/[0.07] pt-5">
              <div>
                <p className="mono-label text-[9px] text-muted/45">Category</p>
                <p className="mt-1 text-sm text-ink/85">
                  {categoryLabels[openProject.category]}
                </p>
              </div>
              <div>
                <p className="mono-label text-[9px] text-muted/45">Stack</p>
                <p className="mt-1 text-sm text-ink/85">
                  {openProject.stack.length} technologies
                </p>
              </div>
            </div>
          </>
        )}
      </Modal>
    </section>
  );
}
