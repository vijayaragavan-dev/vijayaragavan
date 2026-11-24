import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  id?: string;
  index: string;
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export default function SectionHeading({
  id,
  index,
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "section-heading",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      <div className={cn("eyebrow", align === "center" && "justify-center")}>
        <span className="eyebrow-bracket">[ {index} ]</span>
        <span className="h-px w-8 bg-white/15" aria-hidden="true" />
        <span>{eyebrow}</span>
      </div>
      <h2
        id={id}
        className="mt-5 font-display text-[clamp(2rem,4.2vw,3.4rem)] font-medium leading-[1.06] tracking-[-0.04em] text-ink"
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-5 max-w-2xl text-[15px] leading-relaxed text-muted",
            align === "center" && "mx-auto",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
