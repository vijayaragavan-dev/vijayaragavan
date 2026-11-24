import { cn } from "@/lib/utils";

type SkillChipProps = {
  name: string;
  learning?: boolean;
  className?: string;
  size?: "sm" | "md";
};

export default function SkillChip({
  name,
  learning = false,
  className,
  size = "sm",
}: SkillChipProps) {
  return (
    <span
      className={cn(
        "chip",
        learning && "border-emerald/25 bg-emerald/[0.07] text-[#c9f8ef]",
        size === "md" && "px-3 py-1.5 text-[12px]",
        className,
      )}
    >
      {learning && (
        <svg
          width="11"
          height="11"
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
            strokeOpacity="0.28"
            strokeWidth="1.4"
          />
          <circle
            cx="6"
            cy="6"
            r="4.5"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeDasharray="18 10"
            transform="rotate(-90 6 6)"
          />
        </svg>
      )}
      <span>{name}</span>
      {learning && (
        <span className="text-[8.5px] uppercase tracking-[0.12em] text-emerald-bright/85">
          learning
        </span>
      )}
    </span>
  );
}
