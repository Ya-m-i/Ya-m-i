"use client";

import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { EmblaOptionsType } from "embla-carousel";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export interface MotionCarouselProps {
  slides: React.ReactNode[];
  options?: EmblaOptionsType;
  className?: string;
  /** Slide width as CSS value (e.g. "100%", "55%"). Less than 100% shows peek of adjacent slides. */
  slideBasis?: string;
}

export function MotionCarousel({
  slides,
  options = { loop: true, align: "center" },
  className,
  slideBasis = "100%",
}: MotionCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    ...options,
    align: options.align ?? "center",
    loop: options.loop ?? true,
  });
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const scrollTo = React.useCallback(
    (index: number) => {
      emblaApi?.scrollTo(index);
    },
    [emblaApi]
  );

  React.useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  if (!slides.length) return null;

  return (
    <div className={cn("w-full", className)}>
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex touch-pan-y">
          {slides.map((slide, index) => (
            <div
              key={index}
              className="relative min-w-0 shrink-0 grow-0"
              style={{ flexBasis: slideBasis }}
            >
              <motion.div
                className="flex h-full w-full items-center justify-center px-2"
                animate={{
                  scale: selectedIndex === index ? 1 : 0.92,
                  opacity: selectedIndex === index ? 1 : 0.85,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {slide}
              </motion.div>
            </div>
          ))}
        </div>
      </div>

      {/* Pill-style pagination dots */}
      <div className="mt-6 flex justify-center gap-2">
        <AnimatePresence mode="wait">
          {slides.map((_, index) => (
            <motion.button
              key={index}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              className={cn(
                "h-2 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50",
                selectedIndex === index
                  ? "bg-white"
                  : "bg-white/40 hover:bg-white/60"
              )}
              initial={false}
              animate={{
                width: selectedIndex === index ? 24 : 8,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={() => scrollTo(index)}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
