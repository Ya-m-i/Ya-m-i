'use client'

import React, { useState, useEffect } from 'react'
import CubeLoader from './cube-loader'

export function PageLoader({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    const finishLoading = () => {
      // Force scroll to top so user always sees the Hero first
      window.scrollTo(0, 0);
      setIsLoading(false);
      clearTimeout(timer);
    };

    // Wait until the 3D scene broadcasts its completion
    window.addEventListener("hero-spline-loaded", finishLoading);
    
    // Safety Fallback: Always reveal page after 7.5 seconds in case of poor network
    timer = setTimeout(finishLoading, 7500);
    
    return () => {
      window.removeEventListener("hero-spline-loaded", finishLoading);
      clearTimeout(timer);
    };
  }, [])

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center backdrop-blur-sm">
          <CubeLoader />
        </div>
      )}
      <div style={{ opacity: isLoading ? 0 : 1, transition: 'opacity 0.5s ease-in-out' }}>
        {children}
      </div>
    </>
  )
}
