"use client";

import React from "react";
import { MotionCarousel } from "@/components/animate-ui/components/community/motion-carousel";
import { ThreeDMarquee } from "@/components/ui/3d-marquee";
import { cn } from "@/lib/utils";

const AGRICHAIN_IMAGE_NAMES = [
  "Admin Login.png",
  "Admin Dashboard.png",
  "AdminRegister.png",
  "FarmerAssistance.png",
  "Login Page.png", // center image in 3D marquee
  "FarmerDashboard.png",
  "GeoMap.png",
  "InventoryTab.png",
  "Market.png",
];

const AGRICHAIN_IMAGES = AGRICHAIN_IMAGE_NAMES.map(
  (name) => `/images/agrichainImages/${encodeURIComponent(name)}`
);

const AGRICHAIN_LIVE_URL = "https://kapalongagrichain.site/#/";

function BlankProjectCard() {
  return (
    <div className="mx-auto flex h-[350px] w-[400px] items-center justify-center rounded-3xl border border-dashed border-white/20 bg-neutral-950/40 ring-1 ring-neutral-700/20 dark:bg-neutral-900/30">
      <p className="text-sm text-white/50">Coming soon</p>
    </div>
  );
}

function AgriChainProjectCard() {
  return (
    <a
      href={AGRICHAIN_LIVE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="mx-auto block h-[350px] w-[400px] rounded-3xl bg-neutral-950/80 p-4 ring-1 ring-neutral-700/20 transition-colors hover:bg-neutral-950/90 dark:bg-neutral-900/50 dark:hover:bg-neutral-900/60"
      aria-label="AgriChain - open live site"
    >
      <div className="mb-3 text-center">
        <h3 className="text-xl font-semibold text-white sm:text-2xl">
          AgriChain
        </h3>
        <p className="mt-1 text-sm text-white/70">
          Full-stack agriculture platform — admin, farmer dashboards, market &amp; inventory
        </p>
      </div>
      <div className="mx-auto h-[250px] w-[300px] overflow-hidden rounded-[10px]">
        <ThreeDMarquee images={AGRICHAIN_IMAGES} className="h-full w-full" />
      </div>
    </a>
  );
}

function Projects() {
  const slides = [
    <BlankProjectCard key="blank-1" />,
    <AgriChainProjectCard key="agrichain" />,
    <BlankProjectCard key="blank-2" />,
  ];

  return (
    <section
      id="projects"
      className={cn(
        "relative flex min-h-screen w-full flex-col items-center justify-center",
        "overflow-hidden bg-black py-20 md:py-28"
      )}
    >
      {/* Background text: MY PROJECTS */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        aria-hidden
      >
        <span
          className="select-none text-[clamp(4rem,18vw,14rem)] font-bold tracking-tighter text-white/3"
          style={{ lineHeight: 1 }}
        >
          MY PROJECTS
        </span>
      </div>

      <div className="relative z-10 w-full max-w-7xl px-4">
        <h2 className="mb-12 text-center text-3xl font-semibold text-white sm:text-4xl md:mb-16">
          Projects
        </h2>
        <MotionCarousel
          slides={slides}
          options={{ loop: true, align: "center", startIndex: 1 }}
          slideBasis="58%"
        />
      </div>
    </section>
  );
}
export default Projects;
export { Projects };
