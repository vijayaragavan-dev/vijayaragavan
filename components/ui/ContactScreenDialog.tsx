"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { ArrowUpRight, Send, X } from "lucide-react";
import type { RefObject } from "react";

export type ScreenChannelIcon = React.ComponentType<{
  size?: number;
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
}>;

export type ScreenChannel = {
  key: string;
  label: string;
  detail: string;
  href: string;
  Icon: ScreenChannelIcon;
  external: boolean;
};

type ContactScreenDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  channels: readonly ScreenChannel[];
  returnFocusRef: RefObject<HTMLElement | null>;
};

/**
 * Enlarged, touch-friendly version of the laptop screen shown in the Contact
 * portrait. It mirrors the on-screen layout (three channels on the left, two
 * on the right) and reuses the same destinations as the image hotspots.
 */
export default function ContactScreenDialog({
  open,
  onOpenChange,
  channels,
  returnFocusRef,
}: ContactScreenDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="contact-screen-overlay" />
        <Dialog.Content
          className="contact-screen-dialog"
          aria-modal="true"
          data-lenis-prevent
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            returnFocusRef.current?.focus();
          }}
        >
          <div className="contact-screen-inner">
            <div className="contact-screen-glow" aria-hidden="true" />
            <div className="contact-screen-grid" aria-hidden="true" />

            <header className="contact-screen-head">
              <span className="contact-screen-mark" aria-hidden="true">
                <Send size={18} />
              </span>
              <div className="contact-screen-heading">
                <Dialog.Title className="contact-screen-title">
                  Let&apos;s Connect
                </Dialog.Title>
                <Dialog.Description className="contact-screen-sub">
                  Reach out through any of these channels.
                </Dialog.Description>
              </div>
            </header>

            <Dialog.Close asChild>
              <button
                type="button"
                className="contact-screen-close"
                aria-label="Close enlarged laptop screen"
              >
                <X size={16} aria-hidden="true" />
              </button>
            </Dialog.Close>

            <ul className="contact-screen-list">
              {channels.map((channel) => {
                const Icon = channel.Icon;
                return (
                  <li key={channel.key} className="contact-screen-item">
                    <a
                      href={channel.href}
                      target={channel.external ? "_blank" : undefined}
                      rel={
                        channel.external ? "noopener noreferrer" : undefined
                      }
                      className="contact-screen-link"
                    >
                      <span
                        className="contact-screen-icon"
                        aria-hidden="true"
                      >
                        <Icon size={18} />
                      </span>
                      <span className="contact-screen-copy">
                        <span className="contact-screen-label">
                          {channel.label}
                        </span>
                        <span className="contact-screen-detail">
                          {channel.detail}
                        </span>
                      </span>
                      <ArrowUpRight
                        size={14}
                        aria-hidden="true"
                        className="contact-screen-arrow"
                      />
                      {channel.external && (
                        <span className="sr-only">(opens in a new tab)</span>
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>

            <p className="contact-screen-foot">
              <span>Direct links · no forms</span>
              <span aria-hidden="true">
                <span className="contact-screen-foot-short">Tap to open</span>
                <span className="contact-screen-foot-long">
                  Tap a channel to open it
                </span>
              </span>
            </p>

            <svg
              className="contact-screen-wave"
              viewBox="0 0 400 64"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path d="M0 42C54 20 96 54 152 40S262 14 328 32 384 44 400 38" />
              <path d="M0 54C62 34 108 62 168 50S280 28 340 44 386 54 400 50" />
            </svg>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
