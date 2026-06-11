/**
 * Base path for GitHub Pages: https://ya-m-i.github.io/Ya-m-i/
 * Empty in development so images work at /images/...
 */
const isVercel = process.env.NEXT_PUBLIC_VERCEL_ENV !== undefined || process.env.NEXT_PUBLIC_VERCEL_URL !== undefined;
const isProd = process.env.NODE_ENV === "production";

export const basePath = (isProd && !isVercel) ? "/Ya-m-i" : "";

/** Prepend base path to a path (e.g. "/images/foo.png" -> "/Ya-m-i/images/foo.png" in prod) */
export function withBasePath(path: string): string {
  if (!basePath) return path;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${basePath}${p}`;
}
