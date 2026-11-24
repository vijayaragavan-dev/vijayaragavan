import { Mail } from "lucide-react";
import { GithubMark, LeetCodeMark, LinkedinMark } from "@/components/ui/BrandIcons";
import { links, navigation } from "@/data/links";
import { profile } from "@/data/profile";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.07] py-10">
      <div className="container-page flex flex-col gap-8">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/12 bg-[linear-gradient(145deg,rgba(52,224,161,0.16),rgba(139,124,255,0.1))] font-display text-[11px] font-semibold tracking-[0.08em] text-emerald-bright">
              VJ
            </span>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-medium text-ink">
                {profile.name}
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted/85">
                {profile.title}
              </span>
            </div>
          </div>

          <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2">
            {navigation.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted transition-colors hover:text-emerald-bright"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="icon-button"
              aria-label="GitHub profile"
            >
              <GithubMark size={17} aria-hidden="true" />
            </a>
            <a
              href={links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="icon-button"
              aria-label="LinkedIn profile"
            >
              <LinkedinMark size={17} aria-hidden="true" />
            </a>
            <a
              href={links.leetcode}
              target="_blank"
              rel="noopener noreferrer"
              className="icon-button"
              aria-label="LeetCode profile"
            >
              <LeetCodeMark size={17} aria-hidden="true" />
            </a>
            <a
              href={`mailto:${links.email}`}
              className="icon-button"
              aria-label="Send an email"
            >
              <Mail size={17} aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-white/[0.06] pt-6 font-mono text-[10px] uppercase tracking-[0.14em] text-muted/80 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Vijayaragavan</p>
          <p className="normal-case tracking-[0.04em]">
            Built with Next.js · Three.js · Framer Motion
          </p>
          <p className="flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald/80" />
            Tamil Nadu, India
          </p>
        </div>
      </div>
    </footer>
  );
}
