"use client";

import React, { useRef, useState, useEffect } from "react";

export function LazySection({ children, minHeight = "50vh" }: { children: React.ReactNode, minHeight?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { rootMargin: "400px" });
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ minHeight: isVisible ? 'auto' : minHeight }} className="w-full">
      {isVisible ? children : null}
    </div>
  );
}
