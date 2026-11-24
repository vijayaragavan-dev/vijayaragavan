"use client";

import { ArrowUpRight, ExternalLink, Star } from "lucide-react";
import { GithubMark } from "@/components/ui/BrandIcons";
import ProjectCover from "./ProjectCover";
import { categoryLabels, type Project } from "@/data/projects";
import { VISIBLE_STACK_CHIPS } from "@/lib/constants";
import { cn } from "@/lib/utils";

type ProjectCardProps = {
  project: Project;
  onOpen?: () => void;
  interactive?: boolean;
  className?: string;
};

export default function ProjectCard({
  project,
  onOpen,
  interactive = true,
  className,
}: ProjectCardProps) {
  const visibleStack = project.stack.slice(0, VISIBLE_STACK_CHIPS);
  const extraStack = project.stack.length - visibleStack.length;
  const canOpen = interactive && typeof onOpen === "function";

  return (
    <div className="project-card-shell h-full">
    <article
      aria-hidden={interactive ? undefined : true}
      onClick={canOpen ? onOpen : undefined}
      className={cn(
        "group/card relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(165deg,rgba(14,20,26,0.92),rgba(8,11,15,0.96))] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_36px_80px_-48px_rgba(0,0,0,0.95)] transition-[transform,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        canOpen &&
          "cursor-pointer hover:-translate-y-1 hover:border-emerald/30 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_46px_90px_-46px_rgba(0,0,0,0.98)] focus-within:border-emerald/30",
        !interactive && "pointer-events-none",
        className,
      )}
    >
      <div className="relative aspect-[16/10] shrink-0">
        <ProjectCover
          project={project}
          className="absolute inset-0 h-full w-full"
        />
        <div className="cover-meta">
          <span className="rounded-full border border-white/12 bg-[#06090c]/70 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-ink/75 backdrop-blur-md">
            {categoryLabels[project.category]}
          </span>
          {project.featured && (
            <span className="cover-ribbon">
              <Star size={10} aria-hidden="true" />
              Featured
            </span>
          )}
        </div>
        {canOpen && (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onOpen();
            }}
            aria-label={`View details for ${project.title}`}
            className="absolute inset-0 z-10 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#6ff2c8]/70"
          >
            <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-[#05080b]/78 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-ink/80 opacity-0 backdrop-blur-md transition-all duration-300 group-hover/card:translate-y-0 group-hover/card:opacity-100 focus-visible:opacity-100">
              View details
              <ArrowUpRight size={12} aria-hidden="true" />
            </span>
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
        <div className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.18em] text-muted/65">
          <span className="text-emerald-bright/80">/{project.number}</span>
          <span className="h-px flex-1 bg-white/10" aria-hidden="true" />
          <span>{categoryLabels[project.category]}</span>
        </div>

        <h3 className="font-display text-lg font-medium leading-snug tracking-tight text-ink">
          {project.title}
        </h3>

        {interactive && (
          <p className="line-clamp-2 text-sm leading-relaxed text-muted">
            {project.description}
          </p>
        )}

        <ul className="flex flex-wrap gap-1.5" aria-label="Tech stack">
          {visibleStack.map((item) => (
            <li key={item} className="chip">
              {item}
            </li>
          ))}
          {extraStack > 0 && (
            <li className="chip chip-accent">+{extraStack}</li>
          )}
        </ul>

        {interactive && (
          <div className="mt-auto flex flex-wrap items-center gap-3 pt-2">
            {canOpen && (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onOpen();
                }}
                className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-emerald-bright/85 transition-colors hover:text-emerald-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#080b0f]"
              >
                Details
                <ArrowUpRight size={12} aria-hidden="true" />
              </button>
            )}
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(event) => event.stopPropagation()}
                className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted/80 transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#080b0f]"
              >
                <ExternalLink size={12} aria-hidden="true" />
                Live
                <span className="sr-only"> demo of {project.title} (opens in a new tab)</span>
              </a>
            )}
            {project.code && (
              <a
                href={project.code}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(event) => event.stopPropagation()}
                className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted/80 transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#080b0f]"
              >
                <GithubMark size={12} aria-hidden="true" />
                Code
                <span className="sr-only"> for {project.title} (opens in a new tab)</span>
              </a>
            )}
          </div>
        )}
      </div>
    </article>
    </div>
  );
}
