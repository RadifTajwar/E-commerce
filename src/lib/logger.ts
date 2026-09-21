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
  const pretty = process.env.NODE_ENV === "development" && process.env.NEXT_RUNTIME !== "edge";
  return pino({
    level,
    base: { app: "khalamma" },
    redact: ["req.headers.authorization", "req.headers.cookie", "*.password", "*.accessToken"],
    ...(pretty ? { transport: { target: "pino-pretty", options: { colorize: true } } } : {}),
  });
}

export const logger = createLogger();
export type Logger = typeof logger;
