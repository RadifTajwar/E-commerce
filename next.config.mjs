/** @type {import('next').NextConfig} */

const imageHosts = (process.env.NEXT_PUBLIC_IMAGE_HOSTS ?? "res.cloudinary.com")
  .split(",")
  .map((h) => h.trim())
  .filter(Boolean);

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  ...(process.env.NODE_ENV === "production"
    ? [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" }]
    : []),
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns: imageHosts.map((hostname) => ({ protocol: "https", hostname })),
  },
  experimental: {
    // pino uses worker threads / dynamic requires that must not be bundled.
    serverComponentsExternalPackages: ["pino", "pino-pretty", "ioredis"],
    // TEMPORARY (removed in the layout step): three pages call useSearchParams
    // without a Suspense boundary. The original config carried this flag too.
    missingSuspenseWithCSRBailout: false,
  },
  eslint: {
    // Lint runs as its own CI step (`npm run lint`). Keeping the build focused
    // on compilation makes intermediate refactor commits verifiable.
    ignoreDuringBuilds: true,
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
