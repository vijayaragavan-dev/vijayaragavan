import type { LucideIcon } from "lucide-react";
import {
  Atom,
  Bot,
  Boxes,
  Brain,
  BrainCircuit,
  ChartColumn,
  Component,
  Cpu,
  Database,
  FileSearch,
  GitBranch,
  Globe,
  Layers,
  Network,
  Server,
  Share2,
  Sparkles,
  Table,
  Terminal,
  Workflow,
} from "lucide-react";
import { brandIcons } from "@/lib/tech-icons";
import { cn } from "@/lib/utils";

/**
 * Data uses human readable ids (`java`, `scikit-learn`) while the vendored
 * brand table is keyed by simple-icons slugs, so map those two explicitly.
 */
const brandAlias: Record<string, string> = {
  java: "openjdk",
  "scikit-learn": "scikitlearn",
};

/**
 * Concept marks that have no single vendor logo are drawn with the project's
 * existing line-icon set so they stay visually consistent with the rest of UI.
 */
const conceptIcons: Record<string, LucideIcon> = {
  "rest-api": Share2,
  "client-server": Server,
  database: Database,
  dbms: Table,
  "data-structures": Boxes,
  algorithms: GitBranch,
  oop: Component,
  "ai-ml": BrainCircuit,
  networks: Network,
  "web-technologies": Globe,
  "data-science": ChartColumn,
  "operating-systems": Cpu,
  "ml-fundamentals": Brain,
  "genai-fundamentals": Sparkles,
  "agentic-ai": Workflow,
  "prompt-engineering": Terminal,
  "llm-fundamentals": Atom,
  "rag-basics": FileSearch,
  "ai-agents": Bot,
  "vector-databases": Layers,
};

type Rgb = { r: number; g: number; b: number };

/** The dark glass the marks sit on — used to keep brand colours legible. */
const tileBase: Rgb = { r: 0x0b, g: 0x10, b: 0x15 };

function parseHex(hex: string): Rgb {
  const value = hex.replace("#", "").trim();
  const full =
    value.length === 3
      ? value
          .split("")
          .map((c) => c + c)
          .join("")
      : value;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

function channelLuminance(channel: number): number {
  const value = channel / 255;
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

function luminance({ r, g, b }: Rgb): number {
  return (
    0.2126 * channelLuminance(r) +
    0.7152 * channelLuminance(g) +
    0.0722 * channelLuminance(b)
  );
}

function contrastRatio(a: Rgb, b: Rgb): number {
  const la = luminance(a);
  const lb = luminance(b);
  const [light, dark] = la > lb ? [la, lb] : [lb, la];
  return (light + 0.05) / (dark + 0.05);
}

function mixTowardWhite(color: Rgb, amount: number): Rgb {
  const mix = (channel: number) =>
    Math.round(channel + (255 - channel) * amount);
  return { r: mix(color.r), g: mix(color.g), b: mix(color.b) };
}

/**
 * Brand marks such as NumPy (#013243) or pandas (#150458) disappear on a dark
 * panel. Lift them towards white in small steps until they clear a 3.2:1
 * contrast ratio against the tile, which keeps the hue recognisable.
 */
function readableBrandHex(hex: string): string {
  let color = parseHex(hex);
  let guard = 0;
  while (contrastRatio(color, tileBase) < 3.2 && guard < 48) {
    color = mixTowardWhite(color, 0.07);
    guard += 1;
  }
  const toHex = (channel: number) =>
    Math.max(0, Math.min(255, channel)).toString(16).padStart(2, "0");
  return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`;
}

function brandFor(iconId: string) {
  return brandIcons[brandAlias[iconId] ?? iconId];
}

/** Brand accent used for the tile's hover glow, or null for concept marks. */
export function techBrandColor(iconId: string): string | null {
  const brand = brandFor(iconId);
  if (!brand) return null;
  return readableBrandHex(brand.gradient ? brand.gradient[0] : brand.hex);
}

type TechIconProps = {
  iconId: string;
  name: string;
  className?: string;
};

export default function TechIcon({ iconId, name, className }: TechIconProps) {
  const brand = brandFor(iconId);
  const ConceptIcon = conceptIcons[iconId];

  if (brand) {
    const gradientId = `tech-gradient-${brandAlias[iconId] ?? iconId}`;
    const stops = brand.gradient
      ? brand.gradient.map((hex) => readableBrandHex(hex))
      : [readableBrandHex(brand.hex)];
    const fill = brand.gradient ? `url(#${gradientId})` : stops[0];

    return (
      <span
        className={cn(
          "tech-icon-frame",
          brand.wide && "tech-icon-frame--wide",
          className,
        )}
      >
        <svg
          className="tech-icon-svg"
          viewBox={brand.viewBox ?? "0 0 24 24"}
          role="img"
          aria-label={`${brand.title} logo`}
          focusable="false"
        >
          {brand.gradient && (
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={stops[0]} />
                <stop offset="100%" stopColor={stops[1]} />
              </linearGradient>
            </defs>
          )}
          <path d={brand.path} fill={fill} />
        </svg>
      </span>
    );
  }

  if (ConceptIcon) {
    return (
      <span className={cn("tech-icon-frame", className)}>
        <ConceptIcon
          className="tech-icon-glyph"
          strokeWidth={1.6}
          aria-hidden="true"
          focusable="false"
        />
      </span>
    );
  }

  return (
    <span className={cn("tech-icon-frame", className)} aria-hidden="true">
      <span className="tech-icon-fallback">{name.charAt(0).toUpperCase()}</span>
    </span>
  );
}
