"use client";

import {
  Award,
  Code2,
  FolderGit2,
  Layers,
  type LucideIcon,
} from "lucide-react";
import CountUp from "@/components/ui/CountUp";
import GlassCard from "@/components/ui/GlassCard";
import SectionHeading from "@/components/ui/SectionHeading";
import { stats, todoStatCount } from "@/data/stats";
import { cn } from "@/lib/utils";

const statIcons: Record<string, LucideIcon> = {
  projects: FolderGit2,
  problemsSolved: Code2,
  technologies: Layers,
  certifications: Award,
};

export default function Achievements() {
  return (
    <section
      id="achievements"
      aria-labelledby="achievements-title"
      className="section-shell relative overflow-hidden"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_45%_at_20%_30%,rgba(52,224,161,0.07),transparent_70%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent"
        aria-hidden="true"
      />

      <div className="container-page relative">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            id="achievements-title"
            index="05"
            eyebrow="Achievements"
            title={
              <>
                Progress, measured{" "}
                <span className="text-gradient-soft">honestly.</span>
              </>
            }
            description="Projects and technologies are counted directly from the portfolio's maintained data. Remaining metrics stay neutral until they can be verified."
          />
          {todoStatCount > 0 && (
            <p className="shrink-0 font-mono text-[9px] uppercase tracking-[0.16em] text-muted/40">
              {todoStatCount} of {stats.length} awaiting verification
            </p>
          )}
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:mt-14 xl:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = statIcons[stat.key] ?? Award;
            const verified = stat.value !== null;

            return (
              <div key={stat.key}>
                <GlassCard
                  className="node-frame relative h-full overflow-hidden p-5 sm:p-6"
                  aria-label={`${stat.label}: ${
                    verified ? stat.value : "to be updated"
                  }`}
                >
                  <div
                    className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full bg-emerald/[0.05] blur-2xl"
                    aria-hidden="true"
                  />
                  <div className="flex items-start justify-between gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-emerald-bright/80">
                      <Icon size={17} aria-hidden="true" />
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted/35">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="mt-6">
                    {verified ? (
                      <p className="font-display text-[clamp(2.2rem,4.5vw,3.1rem)] font-semibold leading-none tracking-[-0.04em] text-ink">
                        <CountUp value={stat.value ?? 0} />
                      </p>
                    ) : (
                      <p
                        className="font-display text-[clamp(2.2rem,4.5vw,3.1rem)] font-semibold leading-none tracking-[-0.04em] text-muted/25"
                        aria-hidden="true"
                      >
                        —
                      </p>
                    )}
                    <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-ink/70">
                      {stat.label}
                    </p>
                  </div>

                  <p className="mt-3 text-[12px] leading-relaxed text-muted/65">
                    {stat.detail}
                  </p>

                  <div className="mt-5 border-t border-white/[0.06] pt-3">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 font-mono text-[8.5px] uppercase tracking-[0.12em]",
                        verified ? "text-emerald-bright/75" : "text-muted/35",
                      )}
                    >
                      <span
                        className={cn(
                          "h-1 w-1 rounded-full",
                          verified ? "bg-emerald-bright" : "bg-muted/40",
                        )}
                        aria-hidden="true"
                      />
                      {verified ? "Verified" : "To be updated"}
                    </span>
                  </div>
                </GlassCard>
              </div>
            );
          })}
        </div>

        <p className="mt-5 max-w-2xl font-mono text-[9px] uppercase leading-relaxed tracking-[0.12em] text-muted/35">
          Project and technology totals update automatically from the data files.
          No unverified counts are displayed.
        </p>
      </div>
    </section>
  );
}
