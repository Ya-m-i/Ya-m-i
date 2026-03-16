import React from "react";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/portfolio/Navbar";
import { Hero } from "@/components/portfolio/Hero";

const About = dynamic(
  () => import("@/components/portfolio/About").then((m) => ({ default: m.default })),
  { ssr: true, loading: () => <SectionSkeleton id="about" /> }
);

const Projects = dynamic(
  () => import("../components/portfolio/Projects").then((m) => ({ default: m.default })),
  { ssr: true, loading: () => <SectionSkeleton id="projects" /> }
);

const Contact = dynamic(
  () => import("@/components/portfolio/Contact").then((m) => ({ default: m.default })),
  { ssr: true, loading: () => <SectionSkeleton id="contact" /> }
);

function SectionSkeleton({ id }: { id: string }) {
  return (
    <section
      id={id}
      className="relative flex min-h-[50vh] w-full items-center justify-center bg-black py-16 md:py-24"
      aria-hidden
    >
      <div className="h-8 w-48 animate-pulse rounded bg-white/5" />
    </section>
  );
}

export default function Page() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <Hero />
      <About />
      <Projects />
      <Contact />
    </div>
  );
}