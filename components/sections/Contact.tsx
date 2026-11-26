"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowUpRight,
  Check,
  Copy,
  Download,
  Mail,
  MapPin,
  MousePointerClick,
  Phone,
  X,
} from "lucide-react";
import { GithubMark, LinkedinMark } from "@/components/ui/BrandIcons";
import ContactScreenDialog from "@/components/ui/ContactScreenDialog";
import type { ScreenChannel } from "@/components/ui/ContactScreenDialog";
import SectionHeading from "@/components/ui/SectionHeading";
import { useToast } from "@/components/ui/Toast";
import { links } from "@/data/links";
import { profile } from "@/data/profile";
import contactPic from "@/contact-pic.png";

const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  profile.location,
)}`;
const mailtoHref = `mailto:${links.email}?subject=${encodeURIComponent(
  "Portfolio Contact — Vijayaragavan",
)}`;
const telHref = `tel:${links.phoneHref}`;

type Hotspot = {
  key: string;
  ariaLabel: string;
  href: string;
  external: boolean;
  left: number;
  top: number;
  width: number;
  height: number;
};

// Percentage coordinates measured against contact-pic.png (native 1312 × 1199):
// laptop screen content spans x 126–686, y 546–908. Left column cards x 152–428,
// right column cards x 458–660. Each box matches its on-screen card bounds.
const hotspots: Hotspot[] = [
  {
    key: "email",
    ariaLabel: `Email ${links.email}`,
    href: mailtoHref,
    external: false,
    left: 11.59,
    top: 55.71,
    width: 21.04,
    height: 4.5,
  },
  {
    key: "phone",
    ariaLabel: `Phone ${links.phone}`,
    href: telHref,
    external: false,
    left: 11.59,
    top: 61.05,
    width: 21.04,
    height: 4.34,
  },
  {
    key: "location",
    ariaLabel: `Location ${profile.location}, opens Google Maps`,
    href: mapsHref,
    external: true,
    left: 11.59,
    top: 66.22,
    width: 21.04,
    height: 4.5,
  },
  {
    key: "github",
    ariaLabel: "GitHub — view my projects",
    href: links.github,
    external: true,
    left: 34.91,
    top: 56.13,
    width: 15.4,
    height: 4.92,
  },
  {
    key: "linkedin",
    ariaLabel: "LinkedIn — connect with me",
    href: links.linkedin,
    external: true,
    left: 34.91,
    top: 61.97,
    width: 15.4,
    height: 4.92,
  },
];

// Shared by the compact list below the portrait and the enlarged laptop
// screen dialog, so every destination is defined exactly once.
const contactChannels: ScreenChannel[] = [
  {
    key: "email",
    label: "Email",
    detail: links.email,
    href: mailtoHref,
    Icon: Mail,
    external: false,
  },
  {
    key: "phone",
    label: "Phone",
    detail: links.phone,
    href: telHref,
    Icon: Phone,
    external: false,
  },
  {
    key: "location",
    label: "Location",
    detail: profile.location,
    href: mapsHref,
    Icon: MapPin,
    external: true,
  },
  {
    key: "github",
    label: "GitHub",
    detail: "View my projects",
    href: links.github,
    Icon: GithubMark,
    external: true,
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    detail: "Connect with me",
    href: links.linkedin,
    Icon: LinkedinMark,
    external: true,
  },
];

const copyActions = [
  { key: "email", short: "email", notifyLabel: "Email address", value: links.email },
  { key: "phone", short: "phone", notifyLabel: "Phone number", value: links.phone },
  {
    key: "location",
    short: "location",
    notifyLabel: "Location",
    value: profile.location,
  },
] as const;

function copyWithFallback(value: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(value);
  }

  return new Promise((resolve, reject) => {
    try {
      const textarea = document.createElement("textarea");
      textarea.value = value;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      const success = document.execCommand("copy");
      document.body.removeChild(textarea);
      if (success) resolve();
      else reject(new Error("Copy command failed"));
    } catch (error) {
      reject(error);
    }
  });
}

export default function Contact() {
  const { notify } = useToast();
  const [tipOpen, setTipOpen] = useState(false);
  const [screenOpen, setScreenOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const copyTimer = useRef<number | null>(null);
  const tipTimer = useRef<number | null>(null);
  const hitRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const laptopTriggerRef = useRef<HTMLButtonElement>(null);
  const hadTip = useRef(false);

  useEffect(() => {
    return () => {
      if (copyTimer.current) window.clearTimeout(copyTimer.current);
      if (tipTimer.current) window.clearTimeout(tipTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!tipOpen) return;
    if (tipTimer.current) window.clearTimeout(tipTimer.current);
    tipTimer.current = window.setTimeout(() => setTipOpen(false), 8000);
    return () => {
      if (tipTimer.current) window.clearTimeout(tipTimer.current);
    };
  }, [tipOpen]);

  useEffect(() => {
    if (!tipOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setTipOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [tipOpen]);

  useEffect(() => {
    if (tipOpen) {
      hadTip.current = true;
      closeRef.current?.focus();
    } else if (hadTip.current) {
      hadTip.current = false;
      hitRef.current?.focus();
    }
  }, [tipOpen]);

  const handleCopy = async (key: string, value: string, label: string) => {
    try {
      await copyWithFallback(value);
      setCopiedKey(key);
      if (copyTimer.current) window.clearTimeout(copyTimer.current);
      copyTimer.current = window.setTimeout(() => setCopiedKey(null), 2200);
      notify(`${label} copied to clipboard.`, "success");
    } catch {
      notify("Copy failed. Please select the text and copy it manually.", "error");
    }
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="section-shell relative overflow-hidden pb-24"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_50%_at_65%_35%,rgba(52,224,161,0.08),transparent_70%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent"
        aria-hidden="true"
      />

      <div className="container-page relative">
        <SectionHeading
          id="contact-title"
          index="06"
          eyebrow="LET'S CONNECT"
          title={
            <>
              Have an idea?{" "}
              <span className="text-gradient-soft">Let&apos;s make it happen.</span>
            </>
          }
          description="Every channel on the laptop screen is a live link — email, phone, location, GitHub and LinkedIn. Click one and it opens directly; no forms, no middlemen."
        />

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald/30 bg-emerald/[0.07] px-3.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-emerald-bright/85">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-bright opacity-60 motion-reduce:animate-none" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-bright" />
            </span>
            Available for opportunities
          </span>
        </div>

        <div className="relative mt-10 lg:mt-14">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 h-[78%] w-[92%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(52,224,161,0.16),transparent)] blur-2xl"
          />

          <div className="relative mx-auto w-full max-w-[54rem]">
            <div className="contact-float relative">
              <div className="contact-frame relative aspect-[1312/1199] overflow-hidden rounded-[1.25rem]">
                <Image
                  src={contactPic}
                  alt="Vijayaragavan presenting a laptop with direct contact channels: email, phone, location, GitHub and LinkedIn."
                  fill
                  sizes="(max-width: 768px) calc(100vw - 2rem), (max-width: 1024px) calc(100vw - 4rem), 864px"
                  className="object-contain"
                />
                <button
                  ref={hitRef}
                  type="button"
                  className="contact-hit"
                  aria-label="Show how to contact me"
                  aria-haspopup="dialog"
                  onClick={() => setTipOpen(true)}
                />
                {hotspots.map((spot) => (
                  <a
                    key={spot.key}
                    href={spot.href}
                    aria-label={
                      spot.external
                        ? `${spot.ariaLabel} (opens in a new tab)`
                        : spot.ariaLabel
                    }
                    target={spot.external ? "_blank" : undefined}
                    rel={spot.external ? "noopener noreferrer" : undefined}
                    className="contact-hotspot"
                    style={{
                      left: `${spot.left}%`,
                      top: `${spot.top}%`,
                      width: `${spot.width}%`,
                      height: `${spot.height}%`,
                    }}
                    onClick={() => setTipOpen(false)}
                  >
                    <span className="sr-only">
                      {spot.external ? " (opens in a new tab)" : ""}
                    </span>
                  </a>
                ))}
                {/* On narrow screens the small screen hotspots are replaced by
                    one comfortable tap target that opens the enlarged screen. */}
                <button
                  ref={laptopTriggerRef}
                  type="button"
                  className="contact-laptop-trigger"
                  aria-label="Open enlarged laptop screen with contact links"
                  aria-haspopup="dialog"
                  aria-expanded={screenOpen}
                  onClick={() => {
                    setTipOpen(false);
                    setScreenOpen(true);
                  }}
                />
              </div>

              {tipOpen && (
                <div
                  role="dialog"
                  aria-labelledby="contact-tip-title"
                  className="contact-tip absolute right-3 top-3 z-30 w-[min(19rem,calc(100%-1.5rem))] rounded-2xl border border-emerald/30 bg-[rgba(10,18,22,0.94)] p-3.5 shadow-[0_20px_44px_rgba(0,0,0,0.5)] backdrop-blur-md sm:right-4 sm:top-4"
                >
                  <div className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald/12 text-emerald-bright"
                    >
                      <MousePointerClick size={15} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p
                        id="contact-tip-title"
                        className="text-[13px] font-medium leading-snug text-ink"
                      >
                        Click the links on the laptop screen
                      </p>
                      <p className="mt-1 text-[12px] leading-relaxed text-muted">
                        Email, phone, location, GitHub and LinkedIn each open
                        directly.
                      </p>
                    </div>
                    <button
                      ref={closeRef}
                      type="button"
                      aria-label="Close contact tip"
                      onClick={() => setTipOpen(false)}
                      className="-mr-1 -mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted/60 transition-colors hover:bg-white/[0.06] hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-bright"
                    >
                      <X size={14} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="contact-fallback mt-5 grid gap-2 md:hidden">
              {contactChannels.map((channel) => {
                const Icon = channel.Icon;
                return (
                  <a
                    key={channel.key}
                    href={channel.href}
                    target={channel.external ? "_blank" : undefined}
                    rel={channel.external ? "noopener noreferrer" : undefined}
                    className="group flex min-h-11 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left transition-colors hover:border-emerald/40 hover:bg-white/[0.06]"
                  >
                    <span
                      aria-hidden="true"
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald/10 text-emerald-bright/80"
                    >
                      <Icon size={15} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-mono text-[9px] uppercase tracking-[0.14em] text-muted/55">
                        {channel.label}
                      </span>
                      <span className="block truncate text-[13px] text-ink/85">
                        {channel.detail}
                      </span>
                    </span>
                    {channel.external && (
                      <>
                        <ArrowUpRight
                          size={13}
                          aria-hidden="true"
                          className="shrink-0 text-muted/40 transition-colors group-hover:text-emerald-bright"
                        />
                        <span className="sr-only">(opens in a new tab)</span>
                      </>
                    )}
                  </a>
                );
              })}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              {copyActions.map((action) => (
                <button
                  key={action.key}
                  type="button"
                  onClick={() =>
                    handleCopy(action.key, action.value, action.notifyLabel)
                  }
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-[12px] text-ink/80 transition-colors hover:border-emerald/40 hover:text-emerald-bright focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-bright"
                >
                  {copiedKey === action.key ? (
                    <Check
                      size={13}
                      aria-hidden="true"
                      className="text-emerald-bright"
                    />
                  ) : (
                    <Copy size={13} aria-hidden="true" />
                  )}
                  {copiedKey === action.key
                    ? "Copied"
                    : `Copy ${action.short}`}
                </button>
              ))}
              <a
                href={profile.resume}
                download="Vijayaragavan_Resume.pdf"
                className="btn btn-secondary inline-flex min-h-11 items-center gap-2 px-4 py-2.5 text-[12px]"
              >
                <Download size={13} aria-hidden="true" />
                Download résumé
              </a>
            </div>
          </div>
        </div>
      </div>

      <ContactScreenDialog
        open={screenOpen}
        onOpenChange={setScreenOpen}
        channels={contactChannels}
        returnFocusRef={laptopTriggerRef}
      />
    </section>
  );
}
