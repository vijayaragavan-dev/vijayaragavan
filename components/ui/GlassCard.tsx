import { cn } from "@/lib/utils";

type GlassCardProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "strong" | "quiet";
  interactive?: boolean;
};

export default function GlassCard({
  variant = "default",
  interactive = false,
  className,
  children,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        variant === "strong" ? "glass-strong" : variant === "quiet" ? "glass-quiet" : "glass",
        "rounded-2xl",
        interactive &&
          "transition-[border-color,background-color,transform] duration-300 hover:-translate-y-0.5 hover:border-emerald/25",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
