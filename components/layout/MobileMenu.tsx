"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import { navigation, links } from "@/data/links";
import { profile } from "@/data/profile";
import { scrollToSection } from "@/lib/lenis";
import { cn } from "@/lib/utils";

type MobileMenuProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeSection: string;
};

const menuVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.055, delayChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function MobileMenu({
  open,
  onOpenChange,
  activeSection,
}: MobileMenuProps) {
  const reduceMotion = useReducedMotion();

  const handleNavigate = (
    event: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    event.preventDefault();
    onOpenChange(false);
    window.setTimeout(() => scrollToSection(id), reduceMotion ? 0 : 180);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                className="dialog-overlay xl:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.25 }}
              />
            </Dialog.Overlay>
            <Dialog.Content
              forceMount
              id="mobile-navigation"
              aria-describedby="mobile-navigation-description"
              className="fixed inset-0 z-[90] flex flex-col overflow-y-auto bg-[#07090d]/96 backdrop-blur-2xl xl:hidden"
              data-lenis-prevent
            >
              <Dialog.Title className="sr-only">Navigation menu</Dialog.Title>
              <Dialog.Description
                id="mobile-navigation-description"
                className="sr-only"
              >
                Jump to a section of Vijayaragavan&apos;s portfolio.
              </Dialog.Description>

              <div className="container-page flex h-[72px] shrink-0 items-center justify-between border-b border-white/[0.07]">
                <span className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/12 bg-[linear-gradient(145deg,rgba(52,224,161,0.18),rgba(139,124,255,0.12))] font-display text-[13px] font-semibold tracking-[0.08em] text-emerald-bright">
                    VJ
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
                    Navigation
                  </span>
                </span>
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="icon-button"
                    aria-label="Close navigation menu"
                    autoFocus
                  >
                    <X size={18} aria-hidden="true" />
                  </button>
                </Dialog.Close>
              </div>

              <motion.nav
                aria-label="Mobile primary"
                className="container-page flex flex-1 flex-col justify-center py-10"
                variants={menuVariants}
                initial={reduceMotion ? false : "hidden"}
                animate="visible"
                exit="hidden"
              >
                <ul className="space-y-1">
                  {navigation.map((item, index) => (
                    <motion.li key={item.id} variants={itemVariants}>
                      <a
                        href={`#${item.id}`}
                        onClick={(event) => handleNavigate(event, item.id)}
                        aria-current={
                          activeSection === item.id ? "page" : undefined
                        }
                        className={cn(
                          "group flex items-center justify-between gap-4 border-b border-white/[0.06] py-3 transition-colors",
                          activeSection === item.id
                            ? "text-emerald-bright"
                            : "text-ink/85 hover:text-ink",
                        )}
                      >
                        <span className="flex items-baseline gap-4">
                          <span className="font-mono text-[10px] tracking-[0.2em] text-muted/60">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span className="font-display text-[clamp(1.6rem,6.5vw,2.15rem)] font-medium tracking-tight">
                            {item.label}
                          </span>
                        </span>
                        <ArrowUpRight
                          size={20}
                          className="text-muted transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </motion.nav>

              <motion.div
                className="container-page shrink-0 border-t border-white/[0.07] py-6"
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: reduceMotion ? 0 : 0.35 }}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="mono-label text-muted/60">Direct</span>
                    <a
                      href={`mailto:${profile.email}`}
                      className="text-sm text-ink/85 transition-colors hover:text-emerald-bright"
                    >
                      {profile.email}
                    </a>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                    <a href={links.github} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-ink">
                      GitHub
                    </a>
                    <a href={links.linkedin} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-ink">
                      LinkedIn
                    </a>
                    <a href={links.leetcode} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-ink">
                      LeetCode
                    </a>
                    <a href={links.resume} download className="inline-flex items-center gap-1.5 text-emerald-bright">
                      Resume
                      <ArrowUpRight size={12} aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
