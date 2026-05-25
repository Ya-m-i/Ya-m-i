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
  const sectionRef = useRef<HTMLDivElement>(null);
  const [phTime, setPhTime] = useState({ time: "", date: "", day: "" });

  // Parallax scroll state
  const [bgScale, setBgScale] = useState(1.25);
  const [contentOpacity, setContentOpacity] = useState(1);
  const [exitOpacity, setExitOpacity] = useState(0);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const opts: Intl.DateTimeFormatOptions = { timeZone: "Asia/Manila" };
      setPhTime({
        time: now.toLocaleTimeString("en-PH", { ...opts, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true }),
        date: now.toLocaleDateString("en-PH", { ...opts, month: "short", day: "numeric", year: "numeric" }),
        day:  now.toLocaleDateString("en-PH", { ...opts, weekday: "long" }),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (customElements.get("spline-viewer")) {
      queueMicrotask(() => setViewerReady(true));
      return;
    }
    customElements.whenDefined("spline-viewer").then(() => setViewerReady(true));
  }, []);

  // Parallax scroll handler
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const sectionH = window.innerHeight;
      // Extra scroll distance reserved for the parallax effect (= 1 full viewport)
      const parallaxZone = sectionH;

      // progress: 0 at top, 1 when scrolled one viewport past the hero
      const progress = Math.min(Math.max(scrollY / parallaxZone, 0), 1);

      // Scale: 1.25 → 1.8
      const scale = 1.25 + progress * (1.8 - 1.25);

      // Content fades out during the first 50% of the parallax scroll
      const contentFade = Math.max(0, 1 - progress / 0.5);

      // Black overlay fades in from 60% → 100% of the parallax scroll
      const exitFade = progress < 0.6 ? 0 : (progress - 0.6) / 0.4;

      setBgScale(scale);
      setContentOpacity(contentFade);
      setExitOpacity(exitFade);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // initialise on mount
    return () => window.removeEventListener("scroll", handleScroll);
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
    /*
     * Outer wrapper is 200vh tall so the browser has scroll room
     * for the parallax effect. The <section> inside is sticky and
     * stays pinned for that entire 200vh of scroll distance.
     */
    <div ref={sectionRef} style={{ height: "200vh" }}>
      <section
        id="hero"
        className="sticky top-0 flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-black"
        style={{ height: "100vh" }}
      >
        {/* Spline 3D background — zoom is driven by scroll progress */}
        <div
          ref={viewerContainerRef}
          className="absolute inset-0 z-0"
          style={{
            transform: `scale(${bgScale})`,
            willChange: "transform",
          }}
        >
          {viewerReady &&
            React.createElement("spline-viewer", {
              url: SPLINE_SCENE_URL,
              className: "h-full w-full",
              style: { display: "block", width: "100%", height: "100%" },
            })}
        </div>

        {/* Gradient overlay so text stays readable */}
        <div
          className="pointer-events-none absolute inset-0 z-10 bg-linear-to-b from-black/60 via-transparent to-black/80"
          aria-hidden
        />

        {/* Black exit-fade overlay — fades in as the user finishes scrolling */}
        <div
          className="pointer-events-none absolute inset-0 z-30 bg-black"
          style={{ opacity: exitOpacity }}
          aria-hidden
        />

        {/* Hero content — fades out during the first half of the parallax scroll */}
        <div
          className="pointer-events-none relative z-20 flex w-full h-full flex-col"
          style={{ opacity: contentOpacity }}
        >
          {/* PH Time widget — top right */}
          {phTime.time && (
            <div className="pointer-events-none absolute top-20 right-4 z-20 flex flex-col items-end gap-0.5 md:top-24 md:right-8">
              <span className="font-[family-name:var(--font-orbitron)] text-sm font-bold tabular-nums tracking-widest text-white drop-shadow-lg md:text-base">
                {phTime.time}
              </span>
              <span className="text-[10px] font-semibold tracking-widest text-white/60 uppercase">
                {phTime.day}
              </span>
              <span className="text-[9px] tracking-wider text-white/40">
                {phTime.date} · PH
              </span>
            </div>
          )}

          {/* Hero content wrapper */}
          <div className="relative z-10 flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-4 pt-24 pb-8 md:pt-40 md:pb-20 mx-auto">
            
            {/* Responsive Grid Layout */}
            <div className="flex w-full flex-col items-center justify-center gap-6 sm:gap-8 md:grid md:grid-cols-2 md:gap-x-12 lg:gap-x-16 md:grid-rows-[auto_auto]">
              
              {/* Part 1: Headline & Tagline (Top on mobile, Top-Left on desktop) */}
              <div className="order-1 flex flex-col items-center text-center md:col-start-1 md:row-start-1 md:items-start md:text-left md:self-end z-10">
                <div className="flex items-center overflow-hidden">
                  <TypingAnimation
                    as="h1"
                    className="font-[family-name:var(--font-orbitron)] whitespace-nowrap text-[1.4rem] font-bold tracking-tight text-white sm:text-4xl md:text-5xl"
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
                <p className="mt-3 text-base text-white/90 sm:text-xl sm:mt-4 shadow-black drop-shadow-md">
                  Just Believe, Nothing is Impossible
                </p>
              </div>

              {/* Part 2: Spinning Text & Radial Timeline (Middle on mobile, Right spanning 2 rows on desktop) */}
              <div className="order-2 flex w-full items-center justify-center my-2 sm:my-0 md:col-start-2 md:row-start-1 md:row-span-2 md:justify-end">
                <div className="relative flex items-center justify-center w-64 h-64 sm:w-80 sm:h-80 max-w-[90vw] shrink-0">
                  <div className="absolute inset-0 flex items-center justify-center scale-[0.85] sm:scale-100 origin-center pointer-events-none">
                    <SpinningText
                      reverse
                      className="text-3xl font-bold uppercase text-white sm:text-[2.5rem]"
                      duration={16}
                      radius={7}
                    >
                      FULL • STACK • DEVELOPER •
                    </SpinningText>
                    
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
                      <RadialOrbitalTimeline timelineData={heroTimelineData} radius={115} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Part 3: Action Buttons (Bottom on mobile, Bottom-Left on desktop) */}
              <div className="order-3 flex w-full flex-wrap justify-center gap-3 sm:gap-4 [&_a]:pointer-events-auto [&_button]:pointer-events-auto md:mt-6 md:col-start-1 md:row-start-2 md:justify-start md:self-start z-10">
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

          </div>
        </div>
      </section>
    </div>
  );
}
