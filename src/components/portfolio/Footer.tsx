import React from "react";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full border-t border-white/10 bg-black py-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-4 text-center md:flex-row md:text-left">
        <div className="flex flex-col gap-1">
          <p className="font-[family-name:var(--font-orbitron)] text-lg font-semibold text-white/90">
            Kycir Shane Pacon
          </p>
          <p className="text-sm font-medium tracking-wide text-white/50">
            B.S. Information Technology Graduate • Davao del Norte State College
          </p>
        </div>
        <div className="text-xs text-white/40">
          <p>&copy; {currentYear} All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
