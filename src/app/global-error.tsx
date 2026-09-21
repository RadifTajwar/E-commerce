"use client";

/** Last-resort boundary: replaces the root layout when it throws. Must render its own html/body. */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", padding: "4rem 1.5rem", textAlign: "center" }}>
        <h1 style={{ fontSize: "1.75rem", marginBottom: "0.75rem" }}>Something went wrong</h1>
        <p style={{ color: "#6b7280" }}>{error.digest ? `Reference ${error.digest}` : "Please try again."}</p>
        <button
          type="button"
          onClick={reset}
          style={{ marginTop: "2rem", padding: "0.6rem 1.25rem", borderRadius: "9999px", background: "#111827", color: "#fff", border: 0 }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
