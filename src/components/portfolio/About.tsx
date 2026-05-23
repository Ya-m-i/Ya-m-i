"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { Application } from "@splinetool/runtime";
import { TypingAnimation } from "@/components/ui/typing-animation";
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

/** Badge text - set via Spline scene variables (name, education, location).
 * For the 3D badge text to change (not overlay), the scene must have variables in Spline:
 * 1. Open the scene in Spline → Right panel → Variables → Add String variables (e.g. "name", "education", "location").
 * 2. Select each text object → bind its content to the matching variable.
 * 3. Re-export the scene. Then setVariable() will update the text. */
const BADGE_VARIABLES = {
  name: "Kyzz Shane Pacon",
  education: "BS. Information Technology",
  location: "PH, Panabo City",
};

/** Your badge photo: put image at public/images/AboutMe.png - it replaces the texture inside the 3D badge. */

/** Skill logo name (matches filename: public/images/{name}.png) → official docs/homepage URL */
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
function About() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const appRef = useRef<Application | null>(null);
  const [splineInView, setSplineInView] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setSplineInView(true);
      },
      { rootMargin: "100px", threshold: 0.1 }
    );
    obs.observe(section);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!splineInView) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const app = new Application(canvas);
    appRef.current = app;

    app
      .load(ABOUT_SPLINE_SCENE_URL, BADGE_VARIABLES)
      .then(() => {
        app.setBackgroundColor("transparent");
        // Set badge text inside 3D scene via Spline variables (scene must have these variables bound to text in Spline editor)
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
          else if (k.includes("education") || k.includes("degree") || k.includes("school")) app.setVariable(key, BADGE_VARIABLES.education);
          else if (k.includes("location") || k.includes("address") || k.includes("city") || k.includes("place")) app.setVariable(key, BADGE_VARIABLES.location);
        }
        // Find an object that has a texture layer (the badge photo) and replace it with our image
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
            textureLayer.updateTexture(url).catch(() => {
              // Ignore if update fails (e.g. wrong object or CORS)
            });
            break;
          }
        }
      })
      .catch(console.error);

    return () => {
      appRef.current = null;
    };
  }, [splineInView]);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative flex min-h-[60vh] w-full flex-col items-center justify-start overflow-hidden bg-black pt-16 pb-16 md:min-h-[70vh] md:pt-24 md:pb-24"
    >
      {/* Main Container restricting exactly to the top profile section so background text doesn't slide down into timeline */}
      <div className="relative flex w-full flex-col items-center">
        {/* Background text: ABOUT ME */}
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

        <div className="relative z-10 flex w-full max-w-6xl flex-col items-center gap-12 px-4 md:flex-row md:items-center md:gap-16 lg:gap-20">
          {/* Left: Spline Sleek ID Badge (runtime = transparent bg + replace texture + set variables for name/education/location) */}
          <div 
            className="flex min-h-[380px] w-full flex-1 items-center justify-center md:min-h-[460px] lg:min-h-[520px]"
            style={{ perspective: 1000 }}
          >
            <canvas
              ref={canvasRef}
              className="h-full w-full min-h-[360px] rounded-lg md:min-h-[440px] lg:min-h-[500px]"
              style={{
                width: "100%",
                height: "100%",
                minHeight: "360px",
                background: "transparent",
              }}
            />
          </div>

          {/* Right: About text — min-height so position stays fixed when typing runs */}
          <div className="flex flex-1 flex-col justify-start text-center md:text-left">
            <h2 className="font-[family-name:var(--font-orbitron)] text-2xl font-semibold text-white sm:text-3xl md:text-4xl">
              About
            </h2>
            <div className="mt-4 min-h-72 sm:min-h-80">
              <TypingAnimation
                as="p"
                className="text-base leading-relaxed text-white/90 sm:text-lg whitespace-pre-line"
                words={["I build projects to push my limits and enhance my skills, exploring new technologies and design approaches along the way. Every POS system, blockchain app, HRIS platform, or UI/UX design I create is a step closer to my ultimate goal: developing a system that can solve real problems and make a meaningful impact.\n\nI focus on learning, experimenting, and delivering solutions that not only work, but help people, simplify their work, and empower businesses. My journey is fueled by curiosity, growth, and the drive to create systems that truly change lives."]}
                showCursor={false}
                typeSpeed={18}
                loop={false}
                startOnView={true}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Timeline / Certificates Section */}
      <div id="certificates" className="relative z-10 w-full max-w-7xl">
        <TimelineDemo />
      </div>

      {/* My Skills: heading + Marquee (single row, no reverse) */}
      <div id="skills" className="relative z-10 mt-8 w-full max-w-6xl px-4 md:mt-16">
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
    </section>
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
 * Based on user provided snippet
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

