"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type ModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  eyebrow?: React.ReactNode;
  description: string;
  media?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export default function Modal({
  open,
  onOpenChange,
  title,
  eyebrow,
  description,
  media,
  children,
  className,
}: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content
          className={cn(
            "dialog-content glass-strong w-full max-w-3xl overflow-hidden border border-white/12 p-0 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.95)]",
            className,
          )}
          data-lenis-prevent
        >
          <Dialog.Close asChild>
            <button
              type="button"
              className="icon-button absolute right-4 top-4 z-30"
              aria-label="Close project details"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </Dialog.Close>

          {media}

          <div className="p-5 sm:p-7">
            {eyebrow && <div className="mb-3 pr-12">{eyebrow}</div>}
            <Dialog.Title className="font-display text-[clamp(1.4rem,3.2vw,2rem)] font-medium leading-tight tracking-[-0.03em] text-ink">
              {title}
            </Dialog.Title>
            <Dialog.Description className="mt-3 text-sm leading-relaxed text-muted">
              {description}
            </Dialog.Description>
            <div className="mt-6">{children}</div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
