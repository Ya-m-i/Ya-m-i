"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export interface ThreeDMarqueeProps {
  images: string[];
  className?: string;
}

const COLUMN_COUNT = 4;

export function ThreeDMarquee({ images, className }: ThreeDMarqueeProps) {
  const chunkSize = Math.ceil(images.length / COLUMN_COUNT);
  const columns = React.useMemo(
    () =>
      Array.from({ length: COLUMN_COUNT }, (_, colIndex) => {
        const start = colIndex * chunkSize;
        return images.slice(start, start + chunkSize);
      }),
    [images, chunkSize]
  );

  return (
    <div
      className={cn(
        "relative flex w-full items-center justify-center overflow-hidden py-1",
        "perspective-midrange",
        className
      )}
      style={{ transformStyle: "preserve-3d" }}
    >
      <div
        className="flex gap-2"
        style={{
          transform: "scale(1.35) rotateX(55deg) rotateY(0deg) rotateZ(-25deg)",
          transformStyle: "preserve-3d",
        }}
      >
        {columns.map((columnImages, colIndex) => (
          <motion.div
            key={colIndex}
            className="flex flex-col gap-2"
            animate={{
              y: colIndex % 2 === 0 ? ["0%", "50%"] : ["0%", "-50%"],
            }}
            transition={{
              duration: colIndex % 2 === 0 ? 15 : 12,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            {[...columnImages, ...columnImages].map((src, i) => (
              <motion.div
                key={`${colIndex}-${i}`}
                className="relative flex h-[250px] w-[300px] shrink-0 items-center justify-center overflow-hidden rounded-md"
                whileHover={{ y: -2, scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Image
                  src={src}
                  alt=""
                  width={300}
                  height={250}
                  sizes="300px"
                  className="h-full w-full object-cover object-center"
                  loading="lazy"
                  draggable={false}
                />
              </motion.div>
            ))}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
