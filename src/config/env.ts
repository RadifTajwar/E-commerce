import { z } from "zod";

/**
 * Environment configuration, validated once with zod.
 *
 * - `clientEnv` holds only NEXT_PUBLIC_* values and is safe to import anywhere.
 * - `serverEnv` holds secrets and upstream URLs. It is parsed lazily on first
 *   access and throws immediately if a required variable is missing, so a
 *   misconfigured deployment fails at startup rather than on the first request.
 *
 * This module has no Node-only imports so it can be used from middleware (edge).
 */

const csv = (value: string) =>
  value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

const intWithDefault = (def: number) =>
  z.coerce.number().int().positive().default(def);

const serverSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

  BACKEND_API_URL: z.string().url({ message: "must be an absolute URL" }),
  BACKEND_API_TIMEOUT_MS: intWithDefault(10_000),
  BACKEND_API_MAX_RETRIES: z.coerce.number().int().min(0).max(5).default(2),
  // Sent on every backend call; the backend refuses anything without it. Its
  // URL is public, so this is what keeps everyone but this server out.
  BFF_SECRET: z.string().min(32, { message: "must be at least 32 characters" }),

  // Must equal the backend's JWT_ACCESS_SECRET, or tokens are only decoded and
  // never verified — which lets anyone forge a `role: admin` session.
  // ponytail: min(8) accommodates the backend's current 11-char secret; rotate
  // both sides to a 32+ byte random value and raise this.
  JWT_SECRET: z.string().min(8).optional(),
  AUTH_COOKIE_NAME: z.string().min(1).default("access_token"),

  REDIS_URL: z.string().optional(),
  REDIS_KEY_PREFIX: z.string().min(1).default("khalamma:v1"),
  CACHE_TTL_CATALOG: intWithDefault(600),
  CACHE_TTL_PRODUCT_LIST: intWithDefault(60),
  CACHE_TTL_PRODUCT: intWithDefault(300),
  CACHE_TTL_BANNER: intWithDefault(600),
  RATE_LIMIT_PUBLIC: intWithDefault(120),
  RATE_LIMIT_WRITE: intWithDefault(30),
  RATE_LIMIT_AUTH: intWithDefault(10),

  ALLOWED_ORIGINS: z.string().default("").transform(csv),

  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_UPLOAD_PRESET: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  UPLOAD_MAX_MB: intWithDefault(25),

  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"]).default("info"),
});

const clientSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().min(1).default("Leather For Luxury"),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:4000"),
  NEXT_PUBLIC_IMAGE_HOSTS: z.string().default("res.cloudinary.com").transform(csv),
});

export type ServerEnv = Readonly<z.infer<typeof serverSchema>>;
export type ClientEnv = Readonly<z.infer<typeof clientSchema>>;

function formatIssues(prefix: string, error: z.ZodError): string {
  const lines = error.issues.map((i) => `  - ${i.path.join(".") || "(root)"}: ${i.message}`);
  return `${prefix}\n${lines.join("\n")}\nSee .env.example for the full list.`;
}

// NEXT_PUBLIC_* must be referenced literally so Next.js can inline them in the browser bundle.
const clientRaw = {
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_IMAGE_HOSTS: process.env.NEXT_PUBLIC_IMAGE_HOSTS,
};

const clientParsed = clientSchema.safeParse(clientRaw);
if (!clientParsed.success) {
  throw new Error(formatIssues("Invalid public environment configuration:", clientParsed.error));
}

export const clientEnv: ClientEnv = Object.freeze(clientParsed.data);

let serverCache: ServerEnv | undefined;

/** Server-only. Throws if called in the browser or if required variables are missing. */
export function getServerEnv(): ServerEnv {
  if (typeof window !== "undefined") {
    throw new Error("getServerEnv() was called in the browser. Server env is never exposed.");
  }
  if (serverCache) return serverCache;

  const parsed = serverSchema.safeParse(process.env);
  if (!parsed.success) {
    throw new Error(formatIssues("Invalid server environment configuration:", parsed.error));
  }
  const data = parsed.data;
  // Same-origin is always allowed; make sure the app's own URL is in the list.
  if (!data.ALLOWED_ORIGINS.includes(clientEnv.NEXT_PUBLIC_APP_URL)) {
    data.ALLOWED_ORIGINS = [...data.ALLOWED_ORIGINS, clientEnv.NEXT_PUBLIC_APP_URL];
  }
  serverCache = Object.freeze(data);
  return serverCache;
}

/** Test helper: forget the cached server env so a test can change process.env. */
export function resetServerEnvForTests(): void {
  serverCache = undefined;
}
