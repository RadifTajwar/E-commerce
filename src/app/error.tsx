"use client";

import Link from "next/link";
import { useEffect } from "react";
import { logger } from "@/lib/logger";

/** Route-level error boundary: catches render/runtime errors below the root layout. */
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    logger.error({ err: error, digest: error.digest }, "unhandled page error");
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 text-center">
      <h1 className="text-3xl font-semibold text-gray-800">Something went wrong</h1>
      <p className="mt-3 text-sm text-gray-500">
        An unexpected error occurred while loading this page.
        {error.digest ? ` (reference ${error.digest})` : null}
      </p>
      <div className="mt-8 flex gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-700"
        >
          Try again
        </button>
        <Link href="/" className="rounded-full border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-100">
          Go home
        </Link>
      </div>
    </main>
  );
}
