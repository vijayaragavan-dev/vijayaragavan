import type { CSSProperties } from "react";
import TechIcon, { techBrandColor } from "@/components/ui/TechIcon";

type SkillTechnologyCardProps = {
  iconId: string;
  name: string;
  learning?: boolean;
};

/**
 * A single 3D glass technology tile inside the Skills detail panel.
 * The icon plate is pushed forward in Z so the mark reads as an object
 * sitting on the panel rather than a flat chip.
 */
export default function SkillTechnologyCard({
  iconId,
  name,
  learning = false,
}: SkillTechnologyCardProps) {
  const brandColor = techBrandColor(iconId);
  const style = brandColor
    ? ({ "--tech-brand": brandColor } as CSSProperties)
    : undefined;

  return (
    <li className="tech-tile-item">
      <div
        className="tech-tile"
        style={style}
        data-learning={learning ? "true" : undefined}
      >
        <span className="tech-tile-depth" aria-hidden="true" />
        <span className="tech-tile-face">
          <TechIcon iconId={iconId} name={name} />
          <span className="tech-tile-name">{name}</span>
          {learning && (
            <span className="tech-tile-flag">
              <svg
                width="9"
                height="9"
                viewBox="0 0 12 12"
                fill="none"
                aria-hidden="true"
                className="shrink-0"
              >
                <circle
                  cx="6"
                  cy="6"
                  r="4.5"
                  stroke="currentColor"
                  strokeOpacity="0.3"
                  strokeWidth="1.5"
                />
                <circle
                  cx="6"
                  cy="6"
                  r="4.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeDasharray="18 10"
                  transform="rotate(-90 6 6)"
                />
              </svg>
              learning
            </span>
          )}
          <span className="tech-tile-sheen" aria-hidden="true" />
        </span>
      </div>
    </li>
  );
}
