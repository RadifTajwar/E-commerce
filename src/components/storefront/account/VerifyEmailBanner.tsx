"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/config/constants";
import { useSession } from "@/hooks/useSession";

/**
 * Standing prompt for an account whose address has not been confirmed.
 * Deliberately not a block: an unverified user can still browse and order, so
 * a mistyped address costs them the code, never access to their own account.
 */
export default function VerifyEmailBanner() {
  const { needsEmailVerification, session } = useSession();
  const pathname = usePathname();

  if (!needsEmailVerification || pathname === ROUTES.verifyEmail) return null;

  return (
    <div className="bg-amber-50 border-b border-amber-200">
      <div className="max-w-7xl mx-auto px-4 py-2.5 text-sm text-amber-900 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center">
        <span>
          Please confirm your email address
          {session?.email ? ` (${session.email})` : ""}.
        </span>
        <Link href={ROUTES.verifyEmail} className="font-medium underline whitespace-nowrap">
          Enter your code
        </Link>
      </div>
    </div>
  );
}
