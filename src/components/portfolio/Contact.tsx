"use client";

import React, { useEffect, useRef, useState } from "react";
import { GithubIcon, InstagramIcon, LinkedinIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

function UpworkIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.076.008-.042c.207-1.143.849-3.06 2.839-3.06 1.492 0 2.703 1.212 2.703 2.703-.001 1.489-1.212 2.702-2.704 2.702zM6.563 13.158c-1.49 0-2.702-1.213-2.702-2.704 0-1.49 1.213-2.702 2.702-2.702.637 0 1.235.22 1.704.619.075-.332.15-.636.23-.924.078-.289.154-.559.23-.806.226-.76.396-1.331.496-1.709-.976-1.448-2.405-2.34-4.061-2.34-2.531 0-4.583 2.052-4.583 4.583 0 2.53 2.052 4.582 4.583 4.582 2.469 0 4.526-1.943 4.576-4.378-.024.018-.053.034-.078.053zm6.295-.703c.024.258.037.517.037.782 0 .154-.008.308-.02.461-.012.152-.027.306-.047.461-.033.302-.073.605-.119.909h-2.924c.058-.305.104-.609.139-.909.036-.308.063-.616.081-.924.018-.308.027-.616.027-.924 0-.265-.013-.524-.037-.782-.024-.258-.054-.516-.09-.774-.036-.258-.078-.516-.126-.774-.048-.258-.102-.516-.162-.774h2.883c-.06.258-.114.516-.162.774-.048.258-.09.516-.126.774-.036.258-.066.516-.09.774zm2.882-2.627c-.048-.258-.09-.516-.126-.774-.036-.258-.066-.516-.09-.774-.024-.258-.037-.517-.037-.782 0-.308.009-.616.027-.924.018-.308.045-.616.081-.924.035-.3.081-.604.139-.909h2.924c-.046.304-.086.607-.119.909-.02.155-.035.309-.047.461-.012.153-.02.307-.02.461 0 .265.013.524.037.782.024.258.054.516.09.774.036.258.078.516.126.774.048.258.102.516.162.774h-2.883c.06-.258.114-.516.162-.774zM12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0z" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  {
    label: "GitHub",
    href: "https://github.com/Ya-m-i",
    icon: GithubIcon,
  },
  {
    label: "Instagram",
    href: "#",
    icon: InstagramIcon,
  },
  {
    label: "Discord",
    href: "https://discord.com/channels/@me",
    icon: "discord",
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: LinkedinIcon,
  },
  {
    label: "Upwork",
    href: "#",
    icon: "upwork",
  },
] as const;

const CONTACT_SPLINE_SCENE_URL =
  "https://prod.spline.design/6S0XOr1UXVGDcT-n/scene.splinecode";

function hideSplineWatermark(viewerEl: HTMLElement) {
  const root = viewerEl.shadowRoot;
  if (!root) return;
  const link = root.querySelector('a[href*="spline"]');
  if (link) (link as HTMLElement).style.setProperty("display", "none");
  root.querySelectorAll("a").forEach((a) => {
    if (a.textContent?.toLowerCase().includes("spline")) {
      (a as HTMLElement).style.setProperty("display", "none");
    }
  });
}

function Contact() {
  const [viewerReady, setViewerReady] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const viewerContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (customElements.get("spline-viewer")) {
      queueMicrotask(() => setViewerReady(true));
      return;
    }
    customElements.whenDefined("spline-viewer").then(() => setViewerReady(true));
  }, []);

  useEffect(() => {
    const container = viewerContainerRef.current;
    if (!container) return;
    const preventZoom = (e: WheelEvent) => e.preventDefault();
    container.addEventListener("wheel", preventZoom, { passive: false });
    return () => container.removeEventListener("wheel", preventZoom);
  }, []);

  useEffect(() => {
    if (!viewerReady || !viewerContainerRef.current) return;
    const container = viewerContainerRef.current;
    const hide = () => {
      const v = container.querySelector("spline-viewer");
      if (v) hideSplineWatermark(v as HTMLElement);
    };
    const id = requestAnimationFrame(() => {
      const viewer = container.querySelector("spline-viewer");
      if (!viewer) return;
      viewer.addEventListener("load-complete", hide);
      hide();
    });
    const retryId = setTimeout(hide, 1200);
    return () => {
      cancelAnimationFrame(id);
      clearTimeout(retryId);
      const viewer = container.querySelector("spline-viewer");
      viewer?.removeEventListener("load-complete", hide);
    };
  }, [viewerReady]);

  return (
    <section
      id="contact"
      className={cn(
        "relative flex min-h-screen w-full flex-col items-center justify-center",
        "overflow-hidden bg-black py-20 md:py-28"
      )}
    >
      {/* Background text: CONTACT ME */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        aria-hidden
      >
        <span
          className="select-none text-[clamp(4rem,18vw,14rem)] font-bold tracking-tighter text-white/3"
          style={{ lineHeight: 1 }}
        >
          CONTACT ME
        </span>
      </div>

      <div className="relative z-10 flex w-full flex-col items-center justify-center px-4">
        <h2 className="mb-12 text-center text-3xl font-semibold text-white sm:text-4xl md:mb-16">
          Contact
        </h2>
        <div
          ref={viewerContainerRef}
          className="flex h-[480px] w-full max-w-2xl items-center justify-center overflow-hidden sm:h-[520px] sm:max-w-3xl md:h-[560px] md:max-w-4xl lg:h-[600px] lg:max-w-5xl"
          style={{ touchAction: "pan-x pan-y" }}
        >
          {viewerReady &&
            React.createElement("spline-viewer", {
              url: CONTACT_SPLINE_SCENE_URL,
              style: {
                width: "100%",
                height: "100%",
                minHeight: "400px",
              },
              ...(typeof document !== "undefined" && {
                background: "transparent",
              }),
            })}
        </div>

        {/* Contact me button - same design as Hero "Get in touch" */}
        <div className="mt-10">
          <ShimmerButton
            className="shadow-2xl"
            onClick={() => setIsFormOpen(true)}
          >
            <span className="relative z-10 text-center text-sm font-medium leading-none tracking-tight text-white lg:text-lg">
              Contact me
            </span>
          </ShimmerButton>
        </div>

        {/* Social links: one row, flex wrap */}
        <div className="mt-10 flex flex-wrap justify-center gap-6">
          {SOCIAL_LINKS.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.label}
                className="flex items-center justify-center rounded-full p-2.5 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              >
                {typeof Icon === "string" ? (
                  Icon === "discord" ? (
                    <DiscordIcon className="size-6" />
                  ) : (
                    <UpworkIcon className="size-6" />
                  )
                ) : (
                  <Icon className="size-6" />
                )}
              </a>
            );
          })}
        </div>
      </div>

      {/* Contact form overlay */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-md border-white/10 bg-neutral-900 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl text-white">
              Contact me
            </DialogTitle>
          </DialogHeader>
          <form
            className="grid gap-4 pt-2"
            onSubmit={(e) => {
              e.preventDefault();
              setIsFormOpen(false);
            }}
          >
            <div className="grid gap-2">
              <Label htmlFor="contact-name" className="text-white/90">
                Name
              </Label>
              <Input
                id="contact-name"
                name="name"
                type="text"
                placeholder="Your name"
                required
                className="border-white/20 bg-white/5 text-white placeholder:text-white/40 focus-visible:ring-white/30"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contact-email" className="text-white/90">
                Email
              </Label>
              <Input
                id="contact-email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                className="border-white/20 bg-white/5 text-white placeholder:text-white/40 focus-visible:ring-white/30"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contact-message" className="text-white/90">
                Message
              </Label>
              <Textarea
                id="contact-message"
                name="message"
                placeholder="Your message..."
                rows={4}
                required
                className="min-h-24 border-white/20 bg-white/5 text-white placeholder:text-white/40 focus-visible:ring-white/30"
              />
            </div>
            <DialogFooter className="mt-2 border-white/10 bg-transparent">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="rounded-md border border-white/20 px-4 py-2 text-sm font-medium text-white/90 transition-colors hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black transition-opacity hover:opacity-90"
              >
                Send
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}
export default Contact;
export { Contact };
