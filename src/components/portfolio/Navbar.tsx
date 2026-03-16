"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, User, Code2, FolderOpen, Mail, FileDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

function scrollToSection(
  e: React.MouseEvent<HTMLAnchorElement>,
  href: string,
  block: ScrollLogicalPosition = "start"
) {
  if (href.startsWith("#")) {
    e.preventDefault();
    const id = href.slice(1);
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth", block });
  }
}

const NAV_LINKS: Array<{
  href: string;
  label: string;
  block: ScrollLogicalPosition;
  icon: LucideIcon;
}> = [
  { href: "#about", label: "About", block: "start", icon: User },
  { href: "#skills", label: "Skills", block: "start", icon: Code2 },
  { href: "#projects", label: "Projects", block: "start", icon: FolderOpen },
  { href: "#contact", label: "Contact", block: "center", icon: Mail },
];

const linkClassName =
  "text-sm text-white/80 transition-colors hover:text-white";

/** Put your CV at public/cv.pdf (or update this path) */
const CV_URL = "/cv.pdf";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="#hero"
          onClick={(e) => scrollToSection(e, "#hero")}
          className="text-xl font-semibold tracking-tight text-white transition-opacity hover:opacity-90"
        >
          Ya-m-i
        </Link>

        {/* Desktop: nav links + Download CV */}
        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={(e) => scrollToSection(e, item.href, item.block)}
              className={linkClassName}
            >
              {item.label}
            </Link>
          ))}
          <a
            href={CV_URL}
            download
            target="_blank"
            rel="noopener noreferrer"
            className={cn(linkClassName, "rounded-md border border-white/30 px-3 py-1.5 hover:bg-white/10")}
          >
            Download CV
          </a>
        </div>

        {/* Mobile: burger button */}
        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(true)}
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-md text-white/90 transition-colors hover:bg-white/10 hover:text-white md:hidden"
          )}
        >
          <Menu className="size-6" />
        </button>
      </nav>

      {/* Mobile menu sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="right"
          className="w-[280px] border-white/10 bg-black/95 text-white"
        >
          <nav className="flex flex-col gap-2 pt-12" aria-label="Mobile navigation">
            {NAV_LINKS.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    scrollToSection(e, item.href, item.block);
                    setMobileOpen(false);
                  }}
                  className={cn(
                    "flex items-center gap-4 rounded-xl px-4 py-3.5 text-base font-medium text-white/90",
                    "transition-colors duration-200 hover:bg-white/10 hover:text-white active:bg-white/15"
                  )}
                >
                  <Icon className="size-5 shrink-0 text-white/70" aria-hidden />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <a
              href={CV_URL}
              download
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-4 rounded-xl px-4 py-3.5 text-base font-medium text-white/90",
                "transition-colors duration-200 hover:bg-white/10 hover:text-white active:bg-white/15"
              )}
            >
              <FileDown className="size-5 shrink-0 text-white/70" aria-hidden />
              <span>Download CV</span>
            </a>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}
