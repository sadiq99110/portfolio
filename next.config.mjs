// GitHub Pages serves static files, so the site is exported as plain HTML.
// The workflow sets PAGES_BASE_PATH (e.g. "/portfolio") because Pages serves
// the site under the repo name. Locally it is empty, so dev works as usual.
const basePath = process.env.PAGES_BASE_PATH || "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
