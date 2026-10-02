import pino from "pino";

/**
 * Structured logger.
 * - Server: pino JSON logs (pretty-printed in development).
 * - Browser: pino's tiny browser build writing to the console.
 *
 * Do not import this from middleware (edge runtime); use console there.
 */

const isServer = typeof window === "undefined";
const level = process.env.LOG_LEVEL ?? (process.env.NODE_ENV === "production" ? "info" : "debug");

function createLogger() {
  if (!isServer) {
    return pino({ level, browser: { asObject: false } });
  }
  // No pino transport: Next's bundler rewrites thread-stream's worker path into
  // .next/server/vendor-chunks/lib/worker.js, which does not exist, and the dead
  // worker takes the dev server down with an uncaughtException. For pretty logs,
  // pipe the process through pino-pretty instead: `npm run dev | npx pino-pretty`.
  return pino({
    level,
    base: { app: "khalamma" },
    redact: ["req.headers.authorization", "req.headers.cookie", "*.password", "*.accessToken"],
  });
}

export const logger = createLogger();
export type Logger = typeof logger;
