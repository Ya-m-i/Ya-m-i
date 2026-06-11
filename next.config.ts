import type { NextConfig } from "next";

const isVercel = process.env.VERCEL === "1";
const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: "export",
  // For GitHub Pages project site: https://ya-m-i.github.io/Ya-m-i/
  // Vercel handles its own base path and asset prefix (root by default), so we ignore them if deployed on Vercel
  basePath: (isProd && !isVercel) ? "/Ya-m-i" : undefined,
  assetPrefix: (isProd && !isVercel) ? "/Ya-m-i/" : undefined,
  images: {
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
