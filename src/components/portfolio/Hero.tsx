"use client";

import React, { useEffect, useRef, useState } from "react";
import { SpinningText } from "@/components/ui/spinning-text";
import { TypingAnimation } from "@/components/ui/typing-animation";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { PORTFOLIO_STATS } from "@/data/portfolio";

const SPLINE_SCENE_URL =
  "https://prod.spline.design/gcmlShqiPcmBuB0f/scene.splinecode";

/** Hero KPIs — connected to shared PORTFOLIO_STATS */
const HERO_KPIS = [
  { value: PORTFOLIO_STATS.projectCount, label: "Projects" },
  { value: PORTFOLIO_STATS.clientCount, label: "Clients" },
] as const;

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
    const preventZoom = (e: WheelEvent) => e.preventDefault();
    container.addEventListener("wheel", preventZoom, { passive: false });
    return () => container.removeEventListener("wheel", preventZoom);
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
      {/* Spline 3D background - use createElement so custom element needs no JSX types */}
      <div ref={viewerContainerRef} className="absolute inset-0 z-0">
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

      {/* Hero content: 2 main flex divs - left: copy + buttons, right: SpinningText */}
      <div className="pointer-events-none relative z-10 flex w-full max-w-6xl flex-1 flex-col items-center justify-center gap-8 px-4 py-20 md:flex-row md:gap-12 lg:gap-16">
        {/* Left: headline, tagline, buttons */}
        <div className="flex flex-1 flex-col items-center text-center md:items-start md:text-left">
          {/* Fixed-height container so tagline and buttons don't move when headline text changes */}
          <div className="flex min-h-14 items-center sm:min-h-16 md:min-h-20">
            <TypingAnimation
              as="h1"
              className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl"
              words={["Hi, I'm Ya-m-i", "Fullstack Dev", "UI/UX Designer"]}
              loop
              showCursor={false}
              duration={80}
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
              <span className="relative z-10 text-center text-sm font-medium leading-none tracking-tight text-white lg:text-lg">
                Get in touch
              </span>
            </ShimmerButton>
          </div>

          {/* KPI below buttons — lighter gray so visible, left-aligned in left column */}
          <div className="mt-20 flex flex-wrap justify-center gap-10 md:mt-24 md:justify-start md:gap-14">
            {HERO_KPIS.map((kpi) => (
              <div key={kpi.label} className="flex flex-col items-center text-center md:items-start md:text-left">
                <span className="text-xl font-bold tracking-tighter text-white/50 sm:text-2xl">
                  {kpi.value}
                </span>
                <span className="mt-0.5 text-xs font-medium tracking-tighter text-white/45 sm:text-sm">
                  {kpi.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: spinning text */}
        <div className="flex flex-1 items-center justify-center">
          <SpinningText
            reverse
            className="text-3xl font-semibold uppercase text-white sm:text-4xl"
            duration={4}
            radius={6}
          >
            FULL • STACK • DEVELOPER •
          </SpinningText>
        </div>
      </div>
    </section>
  );
}
