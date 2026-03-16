import React from "react";

/**
 * Full-screen loading UI shown before the portfolio. Dark theme, minimal spinner.
 * No client state—fast first paint. Used as Suspense fallback and in loading.tsx.
 */
export function LoadingScreen() {
  return (
    <div
      className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-black"
      aria-live="polite"
      aria-label="Loading portfolio"
    >
      {/* Ring spinner */}
      <div className="h-12 w-12 animate-loading-spin rounded-full border-2 border-white/20 border-t-white" />
      <p className="mt-5 text-sm font-medium tracking-wide text-white/60">
        Ya-m-i
      </p>
    </div>
  );
}
