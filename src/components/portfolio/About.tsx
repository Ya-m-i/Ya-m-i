"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Application } from "@splinetool/runtime";
import { Marquee } from "@/components/ui/marquee";
import { Timeline } from "@/components/ui/timeline";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { withBasePath } from "@/lib/base-path";
import Autoplay from "embla-carousel-autoplay";

const ABOUT_SPLINE_SCENE_URL =
  "https://prod.spline.design/yTh9zZA29GxD5YcU/scene.splinecode";

const BADGE_VARIABLES = {
  name: "Kyzz Shane Pacon",
  education: "BS. Information Technology",
  location: "PH, Panabo City",
};

const SKILL_LINKS: Readonly<Record<string, string>> = {
  Mongo: "https://www.mongodb.com/",
  Express: "https://expressjs.com/",
  React: "https://react.dev/",
  Node: "https://nodejs.org/en",
  Inertia: "https://inertiajs.com/",
  Laravel: "https://laravel.com/",
  Vue: "https://vuejs.org/",
  Tail: "https://tailwindcss.com/",
  Next: "https://nextjs.org/",
  Prisma: "https://www.prisma.io/",
  Postgre: "https://www.postgresql.org/",
  Supabase: "https://supabase.com/",
};

const SKILL_LOGOS = Object.keys(SKILL_LINKS) as (keyof typeof SKILL_LINKS)[];

// Work experience data
const EXPERIENCE_ENTRIES = [
  {
    org: "Kapalong Department of Agriculture",
    role: "AGRICHAIN PROJECT",
    period: "2024 – 2025",
    description: "Developed a blockchain-powered agricultural tracking system ensuring data transparency, immutability, and traceability across the supply chain.",
  },
  {
    org: "Bridge Digital Transformation Inc.",
    role: "ON THE JOB TRAINING",
    period: "2026 – PRESENT",
    description: "Performed system debugging, bug fixing, and optimization tasks. Conducted QA testing, data validation, and data migration checks. Worked on Laravel, Vue, and Inertia stack setup and development support. Used GitHub (clone, pull, branch, commit, push) for collaboration. Collaborated using Figma for UI/UX and system visualization. Assisted in AI and automation integration proposals for HRIS.",
  },
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

function About() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);
  const [splineLoaded, setSplineLoaded] = useState(false);

  // Scroll-driven animation values
  const [textOpacity, setTextOpacity] = useState(1);
  const [cardX, setCardX] = useState(0);
  const [cardScale, setCardScale] = useState(1);
  const [expOpacity, setExpOpacity] = useState(0);

  // Scroll math (4 phases, each = 1 viewport height = 400vh total wrapper)
  useEffect(() => {
    const handleScroll = () => {
      const outer = outerRef.current;
      if (!outer) return;
      const rect = outer.getBoundingClientRect();
      const totalScrollable = outer.offsetHeight - window.innerHeight;
      const scrolled = Math.max(0, -rect.top);
      const rawProgress = Math.min(Math.max(scrolled / totalScrollable, 0), 1);

      // --- Phase boundaries (each = 25% of total scroll) ---
      // phase1: 0→0.25  → text fades out
      // phase2: 0.25→0.5 → card moves center + zooms
      // phase3: 0.5→0.75 → card slides right, exp fades in left
      // phase4: 0.75→1  → reserved / natural scroll into rest of section

      const p1 = rawProgress / 0.25;                              // 0→1 during phase1
      const p2 = (rawProgress - 0.25) / 0.25;                    // 0→1 during phase2
      const p3 = (rawProgress - 0.5) / 0.25;                     // 0→1 during phase3

      // Text fade: 1 → 0 over phase1
      const tOpacity = Math.max(0, 1 - Math.min(1, p1));

      // Card: during phase1 stays put; phase2 moves center + zooms; phase3 moves right
      let cX = 0;       // 0 = left-col position (default)
      let cScale = 1;

      if (rawProgress >= 0.25 && rawProgress < 0.5) {
        // Move from left-col → center of viewport (translateX 0 → +25vw) and zoom 1→1.25
        const t = Math.min(1, Math.max(0, p2));
        cX = t * 25;       // vw — center is halfway between left (0) and right (50)
        cScale = 1 + t * 0.25;
      } else if (rawProgress >= 0.5 && rawProgress < 0.75) {
        // Move center → right col (where about text was: justify-end pr-24, ~75% of viewport)
        // Card left = calc(25% - 220px), so to center card at 75%: translate +50vw total
        const t = Math.min(1, Math.max(0, p3));
        cX = 25 + t * 25;  // 25vw → 50vw
        cScale = 1.25 - t * 0.3; // zoom back down to 0.95
      } else if (rawProgress >= 0.75) {
        // Settled in right col — matching original right text panel position
        cX = 50;
        cScale = 0.95;
      }

      // Exp panel: fades in during phase3
      const eOpacity = rawProgress >= 0.5
        ? Math.min(1, Math.max(0, p3))
        : 0;

      setTextOpacity(tOpacity);
      setCardX(cX);
      setCardScale(cScale);
      setExpOpacity(eOpacity);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Load Spline when card enters view
  useEffect(() => {
    const outer = outerRef.current;
    if (!outer) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setSplineLoaded(true);
          obs.disconnect();
        }
      },
      { rootMargin: "200px", threshold: 0.05 }
    );
    obs.observe(outer);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const blockInteraction = (e: Event) => {
      // Allow scroll but stop Spline from seeing it
      if (e.type !== "wheel") {
        e.preventDefault();
      }
      e.stopPropagation();
    };

    canvas.addEventListener("wheel", blockInteraction, { capture: true, passive: true });
    canvas.addEventListener("mousedown", blockInteraction, { capture: true });
    canvas.addEventListener("touchstart", blockInteraction, { capture: true });

    return () => {
      canvas.removeEventListener("wheel", blockInteraction, { capture: true });
      canvas.removeEventListener("mousedown", blockInteraction, { capture: true } as EventListenerOptions);
      canvas.removeEventListener("touchstart", blockInteraction, { capture: true } as EventListenerOptions);
    };
  }, []);

  useEffect(() => {
    if (!splineLoaded) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const app = new Application(canvas);
    appRef.current = app;

    app
      .load(ABOUT_SPLINE_SCENE_URL, BADGE_VARIABLES)
      .then(() => {
        app.setBackgroundColor("transparent");
        app.setVariables({
          name: BADGE_VARIABLES.name,
          education: BADGE_VARIABLES.education,
          location: BADGE_VARIABLES.location,
          Name: BADGE_VARIABLES.name,
          Education: BADGE_VARIABLES.education,
          Location: BADGE_VARIABLES.location,
          fullName: BADGE_VARIABLES.name,
          userName: BADGE_VARIABLES.name,
          degree: BADGE_VARIABLES.education,
          address: BADGE_VARIABLES.location,
          city: BADGE_VARIABLES.location,
          place: BADGE_VARIABLES.location,
          text1: BADGE_VARIABLES.name,
          text2: BADGE_VARIABLES.education,
          text3: BADGE_VARIABLES.location,
        });
        const sceneVars = app.getVariables();
        for (const key of Object.keys(sceneVars)) {
          const k = key.toLowerCase();
          if (k.includes("name")) app.setVariable(key, BADGE_VARIABLES.name);
          else if (k.includes("education") || k.includes("degree") || k.includes("school"))
            app.setVariable(key, BADGE_VARIABLES.education);
          else if (k.includes("location") || k.includes("address") || k.includes("city") || k.includes("place"))
            app.setVariable(key, BADGE_VARIABLES.location);
        }
        const objects = app.getAllObjects();
        for (const obj of objects) {
          const mat = obj.material;
          if (!mat?.layers) continue;
          const textureLayer = mat.layers.find(
            (l: { type: string }) => l.type === "texture"
          );
          if (textureLayer && "updateTexture" in textureLayer) {
            const url =
              typeof window !== "undefined"
                ? `${window.location.origin}${withBasePath("/images/AboutMe.png")}`
                : withBasePath("/images/AboutMe.png");
            textureLayer.updateTexture(url).catch(() => {});
            break;
          }
        }
      })
      .catch(console.error);

    return () => {
      appRef.current = null;
    };
  }, [splineLoaded]);

  return (
    <>
      {/*
       * 400vh sticky parallax zone:
       *   Phase 1 (0→25%):  About text fades out
       *   Phase 2 (25→50%): 3D card moves center + zooms
       *   Phase 3 (50→75%): card slides right, experience fades in left
       *   Phase 4 (75→100%): settled
       * Timeline/skills are OUTSIDE this wrapper — only reachable after all phases complete.
       */}
      <div ref={outerRef} style={{ height: "400vh" }} className="relative">
        <section
          id="about"
          className="sticky top-0 overflow-hidden bg-black"
          style={{ height: "100vh" }}
        >
          {/* Ambient background text */}
          <div
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
            aria-hidden
          >
            <span
              className="select-none text-[clamp(4rem,18vw,14rem)] font-bold tracking-tighter text-white/3"
              style={{ lineHeight: 1 }}
            >
              ABOUT ME
            </span>
          </div>

          {/* ── PHASE 0 & 1: About text (title + paragraph) fades out ── */}
          <div
            className="pointer-events-none absolute inset-0 flex items-center justify-end pr-8 md:pr-16 lg:pr-24 z-10"
            style={{
              opacity: textOpacity,
              transition: "opacity 0.05s linear",
            }}
          >
            <div className="flex max-w-lg flex-col justify-start text-center md:text-left">
              <h2 className="font-[family-name:var(--font-orbitron)] text-2xl font-semibold text-white sm:text-3xl md:text-4xl">
                About
              </h2>
              <div className="mt-4 flex flex-col gap-4 min-h-72 sm:min-h-80 text-justify text-base leading-relaxed text-white/90 sm:text-lg">
                <p>
                  I build projects to push my limits and enhance my skills, exploring new technologies and design approaches along the way. Every POS system, blockchain app, HRIS platform, or UI/UX design I create is a step closer to my ultimate goal: developing a system that can solve real problems and make a meaningful impact.
                </p>
                <p>
                  I focus on learning, experimenting, and delivering solutions that not only work, but help people, simplify their work, and empower businesses. My journey is fueled by curiosity, growth, and the drive to create systems that truly change lives.
                </p>
              </div>
            </div>
          </div>

          {/* ── 3D CARD: animates position & scale across phases ── */}
          <div
            className="absolute z-20"
            style={{
              top: "50%",
              left: "calc(25% - 220px)",
              width: "440px",
              height: "520px",
              transform: `translate(${cardX}vw, -50%) scale(${cardScale})`,
              transition: "transform 0.08s linear",
              willChange: "transform",
            }}
          >
            <canvas
              ref={canvasRef}
              style={{
                width: "100%",
                height: "100%",
                background: "transparent",
                display: "block",
              }}
            />
          </div>

          {/* ── WORK EXPERIENCE: fades in on the LEFT while card moves right ── */}
          <div
            className="pointer-events-none absolute inset-0 flex items-center justify-start pl-8 md:pl-16 lg:pl-24 z-10"
            style={{
              opacity: expOpacity,
              transition: "opacity 0.08s linear",
            }}
          >
            <div className="flex max-w-md flex-col gap-6">
              {/* Section label */}
              <div className="flex flex-col gap-1">
                <p className="text-[10px] font-bold tracking-[0.25em] text-white/40 uppercase">
                  My Work Experiences
                </p>
                <h3 className="font-[family-name:var(--font-orbitron)] text-xl font-bold tracking-widest text-white sm:text-2xl">
                  E X P E R I E N C E
                </h3>
                <div className="mt-1 h-px w-16 bg-gradient-to-r from-white/60 to-transparent" />
              </div>

              {/* Experience entries */}
              <div className="flex flex-col gap-8">
                {EXPERIENCE_ENTRIES.map((entry, i) => (
                  <div key={i} className="flex flex-col gap-1.5">
                    {/* Org + period */}
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[11px] font-semibold tracking-widest text-white/50 uppercase">
                        {entry.org}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-[family-name:var(--font-orbitron)] text-sm font-bold text-white">
                          {entry.role}
                        </span>
                        <span className="text-[10px] text-white/40">I {entry.period}</span>
                      </div>
                    </div>
                    {/* Description */}
                    <p className="text-sm text-justify text-white/70 leading-relaxed mt-1">
                      {entry.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ── REST OF ABOUT: timeline + skills — only reachable AFTER full sticky scroll ── */}
      <div className="relative z-10 bg-black">
        {/* Timeline / Certificates Section */}
        <div id="certificates" className="relative z-10 w-full max-w-7xl mx-auto">
          <TimelineDemo />
        </div>

        {/* My Skills */}
        <div id="skills" className="relative z-10 mt-8 w-full max-w-6xl px-4 md:mt-16 mx-auto pb-16">
          <h3 className="font-[family-name:var(--font-orbitron)] text-center text-2xl font-semibold text-white sm:text-3xl">
            My Skills
          </h3>
          <div className="relative mt-8 flex w-full flex-col items-center justify-center overflow-hidden">
            <Marquee pauseOnHover className="[--duration:20s] [--gap:2rem]" repeat={4}>
              {SKILL_LOGOS.map((name) => {
                const url = SKILL_LINKS[name];
                return (
                  <a
                    key={name}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-20 w-28 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 px-4 py-3 transition-colors hover:bg-white/10 md:h-24 md:w-32"
                    aria-label={`${name} - open official site`}
                  >
                    <Image
                      src={withBasePath(`/images/${name}.png`)}
                      alt=""
                      width={96}
                      height={96}
                      sizes="(max-width: 768px) 56px, 64px"
                      className="max-h-14 w-auto object-contain md:max-h-16"
                      loading="lazy"
                    />
                  </a>
                );
              })}
            </Marquee>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-linear-to-r from-black to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-linear-to-l from-black to-transparent" />
          </div>
        </div>
      </div>
    </>
  );
}

function TimelineCarousel({ title, description, items, type }: { title: string; description: string; items: { img: string, desc: string }[]; type: "certImages" | "badgeImages" | "achieveImages" }) {
  const [selectedItem, setSelectedItem] = useState<{ img: string; desc: string; index: number } | null>(null);

  const dotColors = {
    certImages: "bg-emerald-400/70",
    badgeImages: "bg-violet-400/70",
    achieveImages: "bg-amber-400/70"
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="relative w-full md:px-12">
          <Carousel
            opts={{ align: "start", loop: true }}
            plugins={[
              Autoplay({
                delay: 3500,
              }),
            ]}
            className="w-full"
          >
            <CarouselContent className="-ml-3">
              {items.map((item, idx) => (
                <CarouselItem key={idx} className="pl-3 sm:basis-2/3 md:basis-[70%] lg:basis-[80%]">
                  <FeatureBlockCard
                    title={`${title.endsWith('s') ? title.slice(0, -1) : title} ${idx + 1}`}
                    description={item.desc}
                    image={withBasePath(`/images/${type}/${item.img}`)}
                    onClick={() => setSelectedItem({ img: item.img, desc: item.desc, index: idx })}
                    dotColor={dotColors[type]}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden md:block">
              <CarouselPrevious variant="ghost" className="bg-transparent border-none text-white/50 hover:bg-transparent hover:text-white hover:scale-110 transition-all" />
              <CarouselNext variant="ghost" className="bg-transparent border-none text-white/50 hover:bg-transparent hover:text-white hover:scale-110 transition-all" />
            </div>
          </Carousel>
        </div>
      </div>

      {/* Full View Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 px-4 transition-opacity duration-300"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="relative flex w-full max-w-4xl flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-neutral-950 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
              aria-label="Close modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
            <div className="relative w-full bg-black/60" style={{ aspectRatio: "16/9", maxHeight: "70vh" }}>
              <Image
                src={withBasePath(`/images/${type}/${selectedItem.img}`)}
                alt={`${title} ${selectedItem.index + 1}`}
                fill
                className="object-contain p-2 md:p-6"
              />
            </div>
            <div className="flex w-full flex-col gap-1 border-t border-white/10 bg-neutral-900/90 px-6 py-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold tracking-widest text-[#a8a29e] uppercase">{title.endsWith('s') ? title.slice(0, -1) : title} {selectedItem.index + 1}</span>
                <div className={`h-2 w-2 rounded-full ${dotColors[type]}`} />
              </div>
              <p className="text-base font-medium text-white">{selectedItem.desc}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


export function TimelineDemo() {
  const data = [
    {
      title: "Certificates",
      description: "These certifications represent my dedication to mastering in-demand technologies and strengthening my expertise in building efficient, scalable, and user-focused systems.",
      content: (
        <TimelineCarousel
          title="Certificates"
          description=""
          items={[
            { img: "CyberCert.png", desc: "Cybersecurity Fundamentals" },
            { img: "CapstoneCert.png", desc: "Capstone Project Excellence" },
            { img: "EthicalCert.png", desc: "Ethical Hacking Mastery" },
            { img: "JsCert.png", desc: "JavaScript Development Mastery" },
            { img: "NetworkingCert.png", desc: "Networking & Cloud Essentials" }
          ]}
          type="certImages"
        />
      ),
    },
    {
      title: "Badges",
      description: "A collection of achievement badges that demonstrate my practical competencies and ongoing development in building real-world, technology-driven solutions.",
      content: (
        <TimelineCarousel
          title="Badges"
          description=""
          items={[
            { img: "JuniorBadge.png", desc: "Junior Developer Badge" },
            { img: "linuxBadge.png", desc: "Linux Administration Badge" },
            { img: "PNG.png", desc: "Core Technology Protocol" },
            { img: "CyberBadge.png", desc: "Cybersecurity Analyst Badge" }
          ]}
          type="badgeImages"
        />
      ),
    },
    {
      title: "Achievements",
      description: "A collection of key achievements that reflect my dedication, performance, and ability to deliver meaningful results in academic and technical environments.",
      content: (
        <TimelineCarousel
          title="Achieve"
          description=""
          items={[
            { img: "A1.png", desc: "Excellence Award in Development" },
            { img: "A2.png", desc: "Outstanding Project Contribution" },
            { img: "A3.png", desc: "Top Performance Recognition" },
            { img: "A4.png", desc: "Academic Achievement Award" },
            { img: "A5.png", desc: "Technical Innovation Prize" },
            { img: "A6.png", desc: "Leadership and Teamwork" }
          ]}
          type="achieveImages"
        />
      ),
    },
  ];
  return (
    <div className="relative w-full overflow-clip">
      <Timeline data={data} title="" description="" />
    </div>
  );
}

export default About;
export { About };

/**
 * Feature Block Animated Card Components
 */

function FeatureBlockCard({
  title,
  description,
  image,
  onClick,
  dotColor
}: {
  title: string;
  description: string;
  image: string;
  onClick?: () => void;
  dotColor?: string;
}) {
  return (
    <div className="w-full group/card cursor-pointer" onClick={onClick}>
      <div
        className="overflow-hidden relative h-96 rounded-xl shadow-xl w-full flex flex-col justify-between border-[5px] border-white/10 p-4 bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
      >
        {/* Hover overlay */}
        <div className="absolute inset-0 transition duration-300 group-hover/card:bg-black/60 rounded-xl" />
        {/* Top badge */}
        <div className="flex flex-row items-center space-x-2 z-10">
          <div className={`h-2 w-2 rounded-full ${dotColor}`} />
          <p className="font-medium text-[10px] text-white/70 relative z-10 tracking-widest uppercase">{title}</p>
        </div>
        {/* Bottom description */}
        <div className="relative z-10">
          <p className="font-semibold text-sm text-white/90 line-clamp-2 drop-shadow-md">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
