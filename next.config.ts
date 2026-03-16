import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: "export",
  // For GitHub Pages project site: https://ya-m-i.github.io/Ya-m-i/
  basePath: process.env.NODE_ENV === "production" ? "/Ya-m-i" : "",
  assetPrefix: process.env.NODE_ENV === "production" ? "/Ya-m-i/" : "",
  images: {
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
