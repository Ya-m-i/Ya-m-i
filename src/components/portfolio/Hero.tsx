"use client";

import React, { useEffect, useRef, useState } from "react";
import { SpinningText } from "@/components/ui/spinning-text";
import { TypingAnimation } from "@/components/ui/typing-animation";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { PROJECT_COUNT } from "@/components/portfolio/Projects";
import { PORTFOLIO_STATS } from "@/data/portfolio";
import { RadialOrbitalTimeline, TimelineItem } from "@/components/ui/radial-orbital-timeline";
import { FolderOpen, Users } from "lucide-react";

const SPLINE_SCENE_URL =
  "https://prod.spline.design/gcmlShqiPcmBuB0f/scene.splinecode";

const heroTimelineData: TimelineItem[] = [
  {
    id: 1,
    title: `${PROJECT_COUNT} Projects`,
    date: "Current",
    content: "Number of completed and actively maintained full-stack production projects.",
    category: "Analytics",
    icon: FolderOpen,
    relatedIds: [2],
    status: "completed",
    energy: 100,
  },
  {
    id: 2,
    title: `${PORTFOLIO_STATS.clientCount} Clients`,
    date: "Current",
    content: "Globally served clients leveraging custom-built software solutions.",
    category: "Analytics",
    icon: Users,
    relatedIds: [1],
    status: "completed",
    energy: 100,
  }
];



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

export function Hero() {
  const [viewerReady, setViewerReady] = useState(false);
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

    // Use capture phase to intercept and kill events before Spline processes them
    const blockInteraction = (e: Event) => {
      // We STOP propagation so the Spline viewer doesn't receive the event (no zoom/pan)
      // but we do NOT call preventDefault() for the wheel event so the page can still scroll.
      if (e.type !== "wheel") {
        e.preventDefault();
      }
      e.stopPropagation();
    };

    // Block zooming in Spline but allow page scroll:
    // We use capture: true to catch the event before it reaches the Spline viewer.
    // We do NOT call preventDefault() on wheel, so the page scrolls.
    container.addEventListener("wheel", blockInteraction, { capture: true, passive: true });
    container.addEventListener("mousedown", blockInteraction, { capture: true });
    container.addEventListener("touchstart", blockInteraction, { capture: true });

    return () => {
      container.removeEventListener("wheel", blockInteraction, { capture: true });
      container.removeEventListener("mousedown", blockInteraction, { capture: true } as EventListenerOptions);
      container.removeEventListener("touchstart", blockInteraction, { capture: true } as EventListenerOptions);
    };
  }, []);

  useEffect(() => {
    if (!viewerReady || !viewerContainerRef.current) return;
    const container = viewerContainerRef.current;
    let viewer: Element | null = null;
    const hide = () => viewer && hideSplineWatermark(viewer as HTMLElement);
    const id = requestAnimationFrame(() => {
      viewer = container.querySelector("spline-viewer");
      if (!viewer) return;
      viewer.addEventListener("load-complete", hide);
      hide();
    });
    return () => {
      cancelAnimationFrame(id);
      viewer?.removeEventListener("load-complete", hide);
    };
  }, [viewerReady]);

  return (
    <section id="hero" className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-black">
      {/* Spline 3D background - intercept dragging/zooming while allowing hover */}
      <div ref={viewerContainerRef} className="absolute inset-0 z-0 scale-[1.25]">
        {viewerReady &&
          React.createElement("spline-viewer", {
            url: SPLINE_SCENE_URL,
            className: "h-full w-full",
            style: { display: "block", width: "100%", height: "100%" },
          })}
      </div>

      {/* Overlay gradient so text stays readable - pointer-events-none so Spline gets hover/click */}
      <div
        className="pointer-events-none absolute inset-0 z-1 bg-linear-to-b from-black/60 via-transparent to-black/80"
        aria-hidden
      />

      {/* Hero content wrapper */}
      <div className="pointer-events-none relative z-10 flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-4 pt-32 pb-20 md:pt-40">
        
        {/* Top: Left and Right columns */}
        <div className="flex w-full flex-col items-center justify-center gap-8 md:flex-row md:gap-12 lg:gap-16">
          {/* Left: headline, tagline, buttons */}
          <div className="flex flex-1 flex-col items-center text-center md:items-start md:text-left">
            {/* Fixed-height container so tagline and buttons don't move when headline text changes */}
            <div className="flex items-center overflow-hidden">
              <TypingAnimation
                as="h1"
                className="font-[family-name:var(--font-orbitron)] whitespace-nowrap text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl"
                words={["Hi, I'm Ya-m-i", "Fullstack Dev", "UI/UX Designer"]}
                loop
                showCursor
                cursorStyle="line"
                typeSpeed={65}
                deleteSpeed={35}
                pauseDelay={2200}
                startOnView={true}
              />
            </div>
            <p className="mt-4 text-lg text-white/90 sm:text-xl">
              Just Believe, Nothing is Impossible
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4 [&_a]:pointer-events-auto [&_button]:pointer-events-auto md:justify-start">
              <a
                href="#projects"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="rounded-md bg-white px-5 py-2.5 text-sm font-medium text-black transition-opacity hover:opacity-90"
              >
                View work
              </a>
              <ShimmerButton
                borderRadius="0.375rem"
                className="shadow-2xl"
                onClick={() =>
                  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "center" })
                }
              >
                <span className="font-[family-name:var(--font-orbitron)] relative z-10 text-center text-sm font-medium leading-none tracking-tight text-white lg:text-lg">
                  Get in touch
                </span>
              </ShimmerButton>
            </div>
          </div>

          {/* Right: spinning text & orbital timeline */}
          <div className="flex flex-1 items-center justify-center md:justify-end md:pr-20 lg:pr-40 xl:pr-48">
            <div className="relative flex items-center justify-center max-w-[90vw]">
              <SpinningText
                reverse
                className="text-3xl font-bold uppercase text-white sm:text-[2.5rem]"
                duration={16}
                radius={7}
              >
                FULL • STACK • DEVELOPER •
              </SpinningText>
              
              <div className="absolute inset-0 flex items-center justify-center scale-90 sm:scale-100">
                <RadialOrbitalTimeline timelineData={heroTimelineData} radius={115} />
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
