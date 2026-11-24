"use client";

import Image from "next/image";
import {
  BadgeCheck,
  BookOpen,
  CalendarDays,
  GraduationCap,
  MapPin,
  Target,
  TerminalSquare,
} from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import SectionHeading from "@/components/ui/SectionHeading";
import { profile, terminalSession } from "@/data/profile";
import { links } from "@/data/links";

const factIcons = {
  education: GraduationCap,
  year: CalendarDays,
  location: MapPin,
  focus: Target,
  learning: BookOpen,
  availability: BadgeCheck,
} as const;

export default function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="section-shell relative overflow-hidden"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent"
        aria-hidden="true"
      />
      <div className="container-page">
        <SectionHeading
          id="about-title"
          index="01"
          eyebrow="About"
          title={
            <>
              A developer shaped by{" "}
              <span className="text-gradient-soft">curiosity</span> and craft.
            </>
          }
          description="Not just writing code, but understanding the systems, decisions and details behind it."
        />

        <div className="mt-12 grid gap-5 lg:mt-16 lg:grid-cols-[1.15fr_0.85fr] lg:gap-6">
          <div>
            <GlassCard variant="strong" className="node-frame h-full p-6 sm:p-8">
              <div className="flex items-start gap-4 sm:gap-5">
                <div className="relative shrink-0">
                  <div
                    className="absolute -inset-1.5 rounded-2xl bg-[linear-gradient(145deg,rgba(52,224,161,0.32),rgba(139,124,255,0.22))] opacity-70 blur-md"
                    aria-hidden="true"
                  />
                  <div className="relative h-20 w-20 overflow-hidden rounded-2xl border border-white/15 sm:h-24 sm:w-24">
                    <Image
                      src={profile.photo}
                      alt={`${profile.name}`}
                      fill
                      sizes="96px"
                      className="object-cover object-center"
                    />
                  </div>
                  <span className="absolute -bottom-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full border border-emerald/40 bg-[#07130f] text-emerald-bright">
                    <TerminalSquare size={11} aria-hidden="true" />
                  </span>
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <h3 className="font-display text-xl font-medium tracking-tight text-ink">
                      {profile.name}
                    </h3>
                    <span className="rounded-full border border-emerald/25 bg-emerald/[0.08] px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-emerald-bright/85">
                      {profile.title}
                    </span>
                  </div>
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted/65">
                    {profile.education} · {profile.location}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {profile.tagline}
                  </p>
                </div>
              </div>

              <div className="mt-7 space-y-4 text-[15px] leading-[1.8] text-muted">
                {profile.about.map((paragraph) => (
                  <p key={paragraph} className="text-pretty">
                    {paragraph}
                  </p>
                ))}
              </div>

              <dl className="mt-7 grid gap-2.5 sm:grid-cols-2">
                {profile.quickFacts.map((fact) => {
                  const Icon = factIcons[fact.key as keyof typeof factIcons];
                  return (
                    <div
                      key={fact.key}
                      className="glass-quiet rounded-xl px-3.5 py-3"
                    >
                      <dt className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-muted/60">
                        <Icon
                          size={12}
                          aria-hidden="true"
                          className="text-emerald/75"
                        />
                        {fact.label}
                      </dt>
                      <dd className="mt-1.5 text-[13px] leading-snug text-ink/85">
                        {fact.value}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </GlassCard>
          </div>

          <div className="flex flex-col gap-5">
            <div className="terminal node-frame">
              <div className="terminal-bar">
                <span className="terminal-dot bg-[#ff8a8a]/55" aria-hidden="true" />
                <span className="terminal-dot bg-[#ffd48a]/55" aria-hidden="true" />
                <span className="terminal-dot bg-[#8fffd8]/55" aria-hidden="true" />
                <span className="ml-3 font-mono text-[10px] tracking-[0.08em] text-muted/60">
                  vijayaragavan — zsh
                </span>
                <span className="ml-auto font-mono text-[9px] uppercase tracking-[0.16em] text-muted/40">
                  ~/profile
                </span>
              </div>
              <div className="terminal-body" aria-label="Terminal profile summary">
                {terminalSession.map((entry) => (
                  <div key={entry.command} className="mb-2.5 last:mb-0">
                    <p className="flex items-center gap-2">
                      <span className="text-emerald-bright/60" aria-hidden="true">
                        ❯
                      </span>
                      <span className="text-ink/85">{entry.command}</span>
                    </p>
                    {entry.output.map((line) => (
                      <p
                        key={line}
                        className="pl-[1.15rem] text-muted/80"
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                ))}
                <p className="flex items-center gap-2 pt-1">
                  <span className="text-emerald-bright/60" aria-hidden="true">
                    ❯
                  </span>
                  <span className="terminal-caret" aria-hidden="true" />
                </p>
              </div>
            </div>

            <div className="glass rounded-2xl p-5">
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted/55">
                Workspace
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink/80">
                Prefer understanding the system behind the screen: APIs,
                databases, client–server flows and clean architecture.
              </p>
              <a
                href={`mailto:${links.email}`}
                className="mt-4 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-emerald-bright/80 transition-colors hover:text-emerald-bright"
              >
                Open a conversation
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
