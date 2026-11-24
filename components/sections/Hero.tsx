"use client";

import { type PointerEvent, useRef, useState, useEffect } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowDown,
  ArrowUpRight,
  BrainCircuit,
  Mail,
  MapPin,
  Server,
  Sparkles,
} from "lucide-react";
import {
  GithubMark,
  LinkedinMark,
} from "@/components/ui/BrandIcons";
import WebGLStage from "@/components/three/WebGLStage";
import MagneticButton from "@/components/ui/MagneticButton";
import { useDeviceTier } from "@/hooks/useDeviceTier";
import { links } from "@/data/links";
import { profile } from "@/data/profile";
import { scrollToSection } from "@/lib/lenis";
import { cn } from "@/lib/utils";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
});

function useTypewriter(words: readonly string[], enabled: boolean) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState(words[0] ?? "");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!enabled || words.length === 0) return;

    const current = words[index % words.length] ?? "";
    const delay = deleting ? 34 : text === current ? 2100 : 62;

    const timeout = window.setTimeout(() => {
      if (!deleting) {
        if (text === current) {
          setDeleting(true);
        } else {
          setText(current.slice(0, text.length + 1));
        }
      } else if (text.length === 0) {
        setDeleting(false);
        setIndex((value) => (value + 1) % words.length);
      } else {
        setText(current.slice(0, text.length - 1));
      }
    }, delay);

    return () => window.clearTimeout(timeout);
  }, [text, deleting, index, enabled, words]);

  return enabled ? text : (words[0] ?? "");
}

const floatingChips = [
  {
    label: "Java",
    className: "left-[-18px] top-[12%] sm:left-[-34px]",
    delay: "0s",
  },
  {
    label: "Python",
    className: "right-[-16px] top-[24%] sm:right-[-30px]",
    delay: "1.2s",
  },
  {
    label: "Spring Boot",
    className: "bottom-[22%] left-[-14px] sm:left-[-28px]",
    delay: "2.1s",
  },
  {
    label: "AI/ML",
    className: "bottom-[11%] right-[-12px] sm:right-[-26px]",
    delay: "0.7s",
  },
];

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const { tier } = useDeviceTier();
  const reduceMotion = useReducedMotion();
  const typed = useTypewriter(profile.roles, !reduceMotion);
  const [tiltActive, setTiltActive] = useState(false);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, 64]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 36]);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateX = useSpring(
    useTransform(pointerY, [-0.5, 0.5], [4.5, -4.5]),
    { stiffness: 140, damping: 20 },
  );
  const rotateY = useSpring(
    useTransform(pointerX, [-0.5, 0.5], [-5.5, 5.5]),
    { stiffness: 140, damping: 20 },
  );

  const handleTiltMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!tiltActive || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const resetTilt = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  const sceneEnabled =
    tier === "full" ? "full" : tier === "lite" ? "lite" : null;

  return (
    <section
      id="home"
      ref={heroRef}
      aria-labelledby="hero-title"
      className="hero-atmosphere relative flex min-h-[100svh] items-center overflow-hidden pb-20 pt-28 sm:pb-24 sm:pt-32"
    >
      <div
        className="pointer-events-none absolute inset-0 z-0"
        aria-hidden="true"
      >
        <div className="blueprint-grid absolute inset-0 opacity-40" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#07090d] to-transparent" />
      </div>

      {sceneEnabled && (
        <WebGLStage
          id="hero"
          className="pointer-events-none absolute inset-0 z-0 opacity-80 [mask-image:radial-gradient(ellipse_at_center,black_42%,transparent_94%)]"
          disabled={false}
        >
          <HeroScene tier={sceneEnabled} />
        </WebGLStage>
      )}

      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(90deg,rgba(7,9,13,0.93)_0%,rgba(7,9,13,0.84)_32%,rgba(7,9,13,0.48)_56%,rgba(7,9,13,0.08)_78%,rgba(7,9,13,0.32)_100%)]"
        aria-hidden="true"
      />

      <div className="container-page relative z-10 grid items-center gap-14 lg:grid-cols-[1.06fr_0.94fr] lg:gap-10">
        <motion.div
          style={{ y: contentY }}
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl"
        >
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2.5">
            <p className="eyebrow">
              <span className="eyebrow-bracket" aria-hidden="true">
                [
              </span>
              Welcome to my portfolio
              <span className="eyebrow-bracket" aria-hidden="true">
                ]
              </span>
            </p>
            <span className="h-3.5 w-px bg-white/12" aria-hidden="true" />
            <span className="inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-emerald-bright/75">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-bright opacity-60 motion-reduce:animate-none" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-bright" />
              </span>
              Open to opportunities
            </span>
          </div>

          <h1
            id="hero-title"
            className="mt-7 font-display text-[clamp(2rem,10.5vw,5.4rem)] font-semibold leading-[0.95] tracking-[-0.055em]"
          >
            <span className="mb-1 block text-[clamp(1.35rem,3.2vw,1.9rem)] font-normal tracking-[-0.02em] text-ink/55">
              Hi, I&apos;m
            </span>
            <span className="text-gradient-name block whitespace-nowrap">
              Vijayaragavan
            </span>
          </h1>

          <p className="mt-5 font-display text-[clamp(1.05rem,2.2vw,1.45rem)] font-normal tracking-[-0.02em] text-emerald-bright/95">
            {profile.title}
          </p>

          <p className="mt-2.5 flex min-h-6 items-center gap-2.5 font-mono text-[11.5px] uppercase tracking-[0.1em] text-muted/70 sm:text-[12.5px]">
            <span className="select-none text-emerald-bright/45" aria-hidden="true">
              &gt;_
            </span>
            <span aria-hidden="true">{typed}</span>
            <span className="terminal-caret" aria-hidden="true" />
          </p>

          <p className="mt-5 max-w-[36rem] text-pretty text-[15px] leading-[1.75] text-muted sm:text-base">
            {profile.intro}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="role-badge">
              <Server size={12} aria-hidden="true" />
              Backend Developer
            </span>
            <span className="role-badge">
              <BrainCircuit size={12} aria-hidden="true" />
              AI/ML Enthusiast
            </span>
            <span className="role-badge">
              <Sparkles size={12} aria-hidden="true" />
              Problem Solver
            </span>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <MagneticButton enabled={tier === "full"}>
              <button
                type="button"
                onClick={() => scrollToSection("projects")}
                className="btn btn-primary group"
              >
                View Projects
                <ArrowUpRight
                  size={16}
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </button>
            </MagneticButton>
            <MagneticButton enabled={tier === "full"} strength={7}>
              <button
                type="button"
                onClick={() => scrollToSection("contact")}
                className="btn btn-secondary group"
              >
                <Mail size={15} aria-hidden="true" />
                Contact Me
              </button>
            </MagneticButton>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
            <div className="flex items-center gap-1">
              {[
                { href: links.github, label: "GitHub", Icon: GithubMark },
                { href: links.linkedin, label: "LinkedIn", Icon: LinkedinMark },
                { href: `mailto:${profile.email}`, label: "Email", Icon: Mail },
              ].map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  {...(href.startsWith("http")
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  aria-label={`${label}${href.startsWith("http") ? " (opens in a new tab)" : ""}`}
                  className="icon-button h-9 w-9 text-muted/80"
                >
                  <Icon size={15} aria-hidden="true" />
                </a>
              ))}
            </div>
            <span className="hidden h-4 w-px bg-white/10 sm:block" aria-hidden="true" />
            <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted/65">
              <MapPin size={12} aria-hidden="true" className="text-emerald/70" />
              {profile.location}
              <span className="text-white/20" aria-hidden="true">
                /
              </span>
              {profile.education}
            </p>
          </div>
        </motion.div>

        <motion.div
          style={{ y: portraitY }}
          className="relative mx-auto w-full max-w-[340px] sm:max-w-[380px] lg:max-w-[420px]"
          onPointerEnter={(event) => {
            if (event.pointerType === "mouse") setTiltActive(true);
          }}
          onPointerMove={handleTiltMove}
          onPointerLeave={() => {
            setTiltActive(false);
            resetTilt();
          }}
        >
          <div
            className="absolute -inset-10 -z-10 rounded-full bg-[radial-gradient(circle,rgba(52,224,161,0.16),rgba(139,124,255,0.07)_45%,transparent_70%)] blur-2xl"
            aria-hidden="true"
          />
          <div
            className="absolute inset-x-6 -bottom-8 -z-10 h-24 rounded-[50%] bg-emerald/10 blur-2xl"
            aria-hidden="true"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            style={{ rotateX, rotateY, transformPerspective: 1000 }}
            className="portrait-stage relative"
          >
            <div
              className="portrait-orbit-wrap"
              style={{ animationDelay: "-12s" }}
              aria-hidden="true"
            >
              <span className="portrait-orbit" />
              <span className="portrait-orbit portrait-orbit-secondary" />
            </div>
            <div className="portrait-sheet portrait-sheet-a" aria-hidden="true" />
            <div className="portrait-sheet portrait-sheet-b" aria-hidden="true" />

            <div className="portrait-frame relative z-10">
              <div className="portrait-inner">
                <div className="relative aspect-[4/5] w-full">
                  <Image
                    src={profile.photo}
                    alt={`${profile.name}, ${profile.title}`}
                    fill
                    priority
                    sizes="(min-width: 1024px) 420px, (min-width: 640px) 380px, 90vw"
                    className="object-cover object-center"
                  />
                  <div
                    className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(4,8,11,0.28),transparent_30%,transparent_58%,rgba(4,8,11,0.82))]"
                    aria-hidden="true"
                  />
                  <span className="absolute left-4 top-4 z-10 inline-flex items-center gap-2 rounded-full border border-white/12 bg-[#05080b]/55 px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.18em] text-ink/65 backdrop-blur-md">
                    <span className="h-1 w-1 rounded-full bg-emerald-bright" />
                    VJ · 2026
                  </span>
                  <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-3 p-4 sm:p-5">
                    <div>
                      <p className="font-display text-base font-medium tracking-tight text-ink">
                        {profile.name}
                      </p>
                      <p className="mt-0.5 font-mono text-[8.5px] uppercase tracking-[0.16em] text-emerald-bright/80">
                        {profile.title}
                      </p>
                    </div>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/14 bg-white/[0.08] text-emerald-bright backdrop-blur-md">
                      <Sparkles size={14} aria-hidden="true" />
                    </span>
                  </div>
                </div>
              </div>
              <span className="portrait-rim" aria-hidden="true" />
            </div>

            <span
              className="corner-bracket -left-3 -top-3 border-l border-t sm:-left-4 sm:-top-4"
              aria-hidden="true"
            />
            <span
              className="corner-bracket -right-3 -top-3 border-r border-t sm:-right-4 sm:-top-4"
              aria-hidden="true"
            />
            <span
              className="corner-bracket -bottom-3 -left-3 border-b border-l sm:-bottom-4 sm:-left-4"
              aria-hidden="true"
            />
            <span
              className="corner-bracket -bottom-3 -right-3 border-b border-r sm:-bottom-4 sm:-right-4"
              aria-hidden="true"
            />

            {floatingChips.map((chip) => (
              <span
                key={chip.label}
                className={cn(
                  "float-chip animate-float-slow absolute z-20 hidden sm:inline-flex",
                  chip.className,
                )}
                style={{ animationDelay: chip.delay }}
                aria-hidden="true"
              >
                <span className="h-1 w-1 rounded-full bg-emerald-bright" />
                {chip.label}
              </span>
            ))}

            <div className="absolute -bottom-6 left-1/2 z-20 w-[min(88%,300px)] -translate-x-1/2 rounded-2xl border border-white/12 bg-[#0a0f14]/85 px-4 py-2.5 shadow-[0_24px_48px_-28px_rgba(0,0,0,0.9)] backdrop-blur-xl">
              <div className="flex items-center justify-between gap-3 font-mono text-[9px] uppercase tracking-[0.14em]">
                <span className="text-muted/65">Focus</span>
                <span className="text-emerald-bright/90">Backend · AI/ML</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <button
        type="button"
        onClick={() => scrollToSection("about")}
        className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 rounded-full px-3 py-1 font-mono text-[9px] uppercase tracking-[0.22em] text-muted/55 transition-colors hover:text-emerald-bright md:flex"
        aria-label="Scroll to About section"
      >
        Scroll
        <ArrowDown
          size={14}
          aria-hidden="true"
          className="animate-bounce text-emerald/70 motion-reduce:animate-none"
        />
      </button>
    </section>
  );
}
