"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Download, Menu } from "lucide-react";
import MobileMenu from "./MobileMenu";
import { navigation, links } from "@/data/links";
import { useActiveSection } from "@/hooks/useActiveSection";
import { SECTION_IDS } from "@/lib/constants";
import { scrollToSection } from "@/lib/lenis";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const active = useActiveSection(SECTION_IDS);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavigate = (
    event: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    event.preventDefault();
    scrollToSection(id);
  };

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
          scrolled
            ? "border-b border-white/[0.07] bg-[#07090d]/72 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <div className="container-page flex h-[72px] items-center justify-between gap-4">
          <a
            href="#home"
            onClick={(event) => handleNavigate(event, "home")}
            className="group flex items-center gap-3 rounded-lg"
          >
            <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-white/12 bg-[linear-gradient(145deg,rgba(52,224,161,0.18),rgba(139,124,255,0.12))] font-display text-[13px] font-semibold tracking-[0.08em] text-emerald-bright shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
              VJ
              <span className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-emerald/60 to-transparent" />
            </span>
            <span className="hidden flex-col leading-tight sm:flex">
              <span className="font-display text-sm font-medium tracking-tight text-ink">
                Vijayaragavan
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted/85">
                Software Developer
              </span>
            </span>
          </a>

          <nav
            aria-label="Primary"
            className="hidden items-center gap-0.5 rounded-full border border-white/[0.06] bg-white/[0.025] px-1.5 py-1.5 backdrop-blur-md xl:flex"
          >
            {navigation.map((item) => {
              const isActive = active === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(event) => handleNavigate(event, item.id)}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "relative rounded-full px-3 py-2 text-[12px] font-medium transition-colors duration-200",
                    isActive
                      ? "text-ink"
                      : "text-muted hover:text-ink",
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="absolute inset-0 rounded-full border border-emerald/20 bg-emerald/[0.09]"
                      transition={
                        reduceMotion
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 380, damping: 32 }
                      }
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    {isActive && (
                      <span className="h-1 w-1 rounded-full bg-emerald-bright" />
                    )}
                    {item.label}
                  </span>
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={links.resume}
              download
              className="btn btn-secondary hidden !min-h-[40px] !px-4 !py-2.5 sm:inline-flex"
            >
              <Download size={14} aria-hidden="true" />
              Resume
            </a>
            <div className="xl:hidden">
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                className="icon-button"
                aria-label="Open navigation menu"
                aria-haspopup="dialog"
                aria-expanded={menuOpen}
                aria-controls="mobile-navigation"
              >
                <Menu size={18} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu
        open={menuOpen}
        onOpenChange={setMenuOpen}
        activeSection={active}
      />
    </>
  );
}
