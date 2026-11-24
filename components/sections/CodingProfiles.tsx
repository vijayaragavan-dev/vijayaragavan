"use client";

import { useState } from "react";
import { ArrowUpRight, BadgeCheck, RefreshCw } from "lucide-react";
import { GithubMark, LinkedinMark } from "@/components/ui/BrandIcons";
import GlassCard from "@/components/ui/GlassCard";
import SectionHeading from "@/components/ui/SectionHeading";
import { useInView } from "@/hooks/useInView";
import { links, leetcodeVerified } from "@/data/links";
import { profile } from "@/data/profile";
import { cn } from "@/lib/utils";

function LeetCodeMark({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14.5 3.5a5 5 0 0 0-7.07 0L3.9 7.03a5 5 0 0 0 0 7.07l3.53 3.53a5 5 0 0 0 7.07 0l1.41-1.41" />
      <path d="M9.5 12h10" />
      <path d="M13 8.5 16.5 12 13 15.5" />
    </svg>
  );
}

type GraphState = "loading" | "loaded" | "error";

export default function CodingProfiles() {
  const { ref: graphRef, inView } = useInView<HTMLDivElement>({
    threshold: 0.15,
  });
  const [graphState, setGraphState] = useState<GraphState>("loading");
  const [attempt, setAttempt] = useState(0);

  const retryGraph = () => {
    setGraphState("loading");
    setAttempt((value) => value + 1);
  };

  return (
    <section
      id="coding"
      aria-labelledby="coding-title"
      className="section-shell relative overflow-hidden"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(45%_40%_at_80%_20%,rgba(139,124,255,0.07),transparent_70%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent"
        aria-hidden="true"
      />

      <div className="container-page relative">
        <SectionHeading
          id="coding-title"
          index="04"
          eyebrow="Coding Profiles"
          title={
            <>
              Where the work{" "}
              <span className="text-gradient-soft">stays visible.</span>
            </>
          }
          description="Public repositories, a professional profile and ongoing algorithmic practice. Live numbers stay on the platforms — nothing here is mirrored or invented."
        />

        <div className="mt-12 grid gap-4 lg:mt-16 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <GlassCard
              variant="strong"
              className="node-frame flex h-full flex-col p-5 sm:p-6"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/12 bg-white/[0.05] text-ink/85">
                    <GithubMark size={20} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-display text-base font-medium tracking-tight text-ink">
                      GitHub
                    </p>
                    <p className="font-mono text-[10px] tracking-[0.06em] text-muted/60">
                      @{links.githubHandle}
                    </p>
                  </div>
                </div>
                <a
                  href={links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open GitHub profile (opens in a new tab)"
                  className="icon-button h-9 w-9"
                >
                  <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              </div>

              <div ref={graphRef} className="mt-5 flex-1">
                <div className="rounded-xl border border-white/[0.07] bg-[#0a0e13] p-2">
                  {graphState !== "error" && (
                    <div className="relative min-h-[104px] overflow-hidden rounded-lg">
                      {graphState === "loading" && (
                        <div className="skeleton absolute inset-0 rounded-lg" />
                      )}
                      {inView && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          key={attempt}
                          src={links.contributionGraph}
                          alt={`GitHub contribution graph for ${links.githubHandle}`}
                          loading="lazy"
                          decoding="async"
                          onLoad={() => setGraphState("loaded")}
                          onError={() => setGraphState("error")}
                          className={cn(
                            "h-auto w-full rounded-lg transition-opacity duration-500 [filter:invert(0.92)_hue-rotate(155deg)_saturate(1.25)]",
                            graphState === "loaded"
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                      )}
                    </div>
                  )}
                  {graphState === "error" && (
                    <div className="flex min-h-[104px] flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-white/10 px-4 py-5 text-center">
                      <p className="text-[12px] leading-relaxed text-muted/70">
                        The contribution graph could not load here.
                      </p>
                      <button
                        type="button"
                        onClick={retryGraph}
                        className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-emerald-bright/80 transition-colors hover:text-emerald-bright"
                      >
                        <RefreshCw size={11} aria-hidden="true" />
                        Try again
                      </button>
                    </div>
                  )}
                </div>
                <p className="mt-2 font-mono text-[8.5px] uppercase tracking-[0.14em] text-muted/35">
                  Contribution graph · live source
                </p>
              </div>

              <a
                href={links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 self-start font-mono text-[10px] uppercase tracking-[0.14em] text-emerald-bright/80 transition-colors hover:text-emerald-bright"
              >
                Explore repositories
                <ArrowUpRight size={12} aria-hidden="true" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </GlassCard>
          </div>

          <div className="lg:col-span-3">
            <GlassCard className="node-frame flex h-full flex-col p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#5a8fd6]/25 bg-[#0a66c2]/10 text-[#8fc0f4]">
                  <LinkedinMark size={19} aria-hidden="true" />
                </span>
                <a
                  href={links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open LinkedIn profile (opens in a new tab)"
                  className="icon-button h-9 w-9"
                >
                  <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              </div>
              <h3 className="mt-4 font-display text-lg font-medium tracking-tight text-ink">
                LinkedIn
              </h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
                Professional profile, education and the short version of the
                developer story.
              </p>
              <dl className="mt-4 space-y-2.5 border-t border-white/[0.07] pt-4">
                <div>
                  <dt className="font-mono text-[8.5px] uppercase tracking-[0.14em] text-muted/40">
                    Profile
                  </dt>
                  <dd className="mt-0.5 truncate text-[12px] text-ink/80">
                    vijaya-ragavan-ki10052007
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[8.5px] uppercase tracking-[0.14em] text-muted/40">
                    Role
                  </dt>
                  <dd className="mt-0.5 text-[12px] text-ink/80">
                    {profile.title}
                  </dd>
                </div>
              </dl>
              <a
                href={links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-flex items-center gap-1.5 pt-5 font-mono text-[10px] uppercase tracking-[0.14em] text-emerald-bright/80 transition-colors hover:text-emerald-bright"
              >
                Connect
                <ArrowUpRight size={12} aria-hidden="true" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </GlassCard>
          </div>

          <div className="lg:col-span-3">
            <GlassCard className="node-frame flex h-full flex-col p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#ffa116]/25 bg-[#ffa116]/[0.08] text-[#ffc174]">
                  <LeetCodeMark />
                </span>
                <a
                  href={links.leetcode}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open LeetCode profile (opens in a new tab)"
                  className="icon-button h-9 w-9"
                >
                  <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              </div>
              <h3 className="mt-4 font-display text-lg font-medium tracking-tight text-ink">
                LeetCode
              </h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
                Ongoing data structures and algorithms practice.
              </p>
              <div className="mt-4 space-y-2.5 border-t border-white/[0.07] pt-4">
                <p className="truncate font-mono text-[11px] tracking-[0.04em] text-ink/80">
                  @{links.leetcodeHandle}
                </p>
                {leetcodeVerified && (
                  <p className="inline-flex items-center gap-1.5 rounded-full border border-emerald/25 bg-emerald/[0.07] px-2 py-1 font-mono text-[8.5px] uppercase tracking-[0.12em] text-emerald-bright/85">
                    <BadgeCheck size={11} aria-hidden="true" />
                    Profile verified
                  </p>
                )}
              </div>
              <p className="mt-3 text-[11px] leading-relaxed text-muted/55">
                Problem counts and rankings are intentionally not mirrored; open
                the live profile for current activity.
              </p>
              <a
                href={links.leetcode}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-flex items-center gap-1.5 pt-5 font-mono text-[10px] uppercase tracking-[0.14em] text-emerald-bright/80 transition-colors hover:text-emerald-bright"
              >
                View profile
                <ArrowUpRight size={12} aria-hidden="true" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
}
