import { COVER_ACCENT_COLORS } from "@/lib/constants";
import type { Project } from "@/data/projects";
import { cn } from "@/lib/utils";
import ProjectArtwork from "./ProjectArtwork";

type ProjectCoverProps = {
  project: Project;
  className?: string;
  number?: boolean;
  glow?: boolean;
};

export default function ProjectCover({
  project,
  className,
  number = true,
  glow = true,
}: ProjectCoverProps) {
  const accent = COVER_ACCENT_COLORS[project.cover.accent];

  return (
    <div
      className={cn("project-cover", className)}
      data-variant={project.cover.variant}
      style={{
        "--cover-a": accent.a,
        "--cover-b": accent.b,
      } as React.CSSProperties}
      aria-hidden="true"
    >
      <div className="cover-mesh" />
      {glow && <div className="cover-glow" />}
      <div className="cover-art">
        <ProjectArtwork id={project.id} />
      </div>
      {number && <span className="cover-number">{project.number}</span>}
    </div>
  );
}
