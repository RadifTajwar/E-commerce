"use client";

import { ROUTES } from "@/config/constants";
import { useSession } from "@/hooks/useSession";
import { authService } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const CODE_LENGTH = 6;

/**
 * Confirm the address with the 6-digit code mailed at signup.
 *
 * A wrong address is recoverable here: the account already works with the
 * password the user chose, so they can correct the address and resend rather
 * than being locked out.
 */
export default function VerifyEmailPage() {
  const router = useRouter();
  const { session, refresh, needsEmailVerification } = useSession();

  const [digits, setDigits] = useState(Array(CODE_LENGTH).fill(""));
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null); // { type: "error" | "ok", text }
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const boxes = useRef([]);

  const code = digits.join("");

  // Nothing to do here once the address is confirmed.
  useEffect(() => {
    if (!needsEmailVerification && !done) {
      router.replace(ROUTES.account);
    }
  }, [needsEmailVerification, done, router]);

  const focusBox = (i) => boxes.current[i]?.focus();

  const setDigit = (i, value) => {
    const char = value.replace(/\D/g, "").slice(-1);
    setStatus(null);
    setDigits((prev) => {
      const next = [...prev];
      next[i] = char;
      return next;
    });
    if (char && i < CODE_LENGTH - 1) focusBox(i + 1);
  };

  const onKeyDown = (i, e) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) focusBox(i - 1);
    if (e.key === "ArrowLeft" && i > 0) focusBox(i - 1);
    if (e.key === "ArrowRight" && i < CODE_LENGTH - 1) focusBox(i + 1);
  };

  const onPaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, CODE_LENGTH);
    if (!pasted) return;
    e.preventDefault();
    const next = Array(CODE_LENGTH).fill("");
    pasted.split("").forEach((d, i) => (next[i] = d));
    setDigits(next);
    focusBox(Math.min(pasted.length, CODE_LENGTH - 1));
  };

  const submitCode = async (e) => {
    e.preventDefault();
    if (code.length !== CODE_LENGTH || busy) return;
    setBusy(true);
    setStatus(null);
    try {
      await authService.verifyEmail(code);
      setDone(true);
      await refresh(); // the cookie now carries isVerified
      setTimeout(() => router.push(ROUTES.account), 1400);
    } catch (err) {
      setStatus({ type: "error", text: err?.message || "That code is not valid." });
      setDigits(Array(CODE_LENGTH).fill(""));
      focusBox(0);
    } finally {
      setBusy(false);
    }
  };

  const resend = async () => {
    const target = (email || session?.email || "").trim();
    if (!target || busy) return;
    setBusy(true);
    setStatus(null);
    try {
      await authService.resendVerification(target);
      setStatus({ type: "ok", text: `If ${target} needs verifying, a new code is on its way.` });
    } catch (err) {
      setStatus({ type: "error", text: err?.message || "Could not send a new code." });
    } finally {
      setBusy(false);
    }
  };

  // Already verified: the effect above is navigating away, so render the
  // outgoing frame as empty rather than flashing the form.
  if (!needsEmailVerification && !done) {
    return <div className="w-full md:w-2/3 lg:w-3/4 px-8 py-16" />;
  }

  if (done) {
    return (
      <div className="w-full md:w-2/3 lg:w-3/4 px-4 sm:px-8 py-10">
        <div className="max-w-md mx-auto text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-green-50">
            <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden="true">
              <path d="m5 13 4 4L19 7" stroke="#16a34a" strokeWidth="2.2"
                    strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="text-xl font-medium text-gray-900">Email verified</h1>
          <p className="mt-2 text-sm text-gray-500">Taking you to your account…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full md:w-2/3 lg:w-3/4 px-4 sm:px-8 py-10">
      <div className="max-w-md">
        <h1 className="text-2xl text-gray-900">Verify your email</h1>
        <p className="mt-2 text-sm leading-relaxed text-gray-500">
          We sent a 6-digit code to{" "}
          <span className="font-medium text-gray-900">{session?.email}</span>
        </p>

        <form onSubmit={submitCode} className="mt-8">
          <div className="flex gap-2 sm:gap-3" onPaste={onPaste}>
            {digits.map((digit, i) => (
              <input
                // eslint-disable-next-line react/no-array-index-key
                key={i}
                ref={(el) => (boxes.current[i] = el)}
                inputMode="numeric"
                autoComplete={i === 0 ? "one-time-code" : "off"}
                maxLength={1}
                aria-label={`Digit ${i + 1}`}
                className={`h-14 w-full max-w-[56px] rounded-md border text-center text-xl font-medium text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900/10 ${
                  status?.type === "error"
                    ? "border-red-400 bg-red-50/40"
                    : digit
                      ? "border-gray-900 bg-white"
                      : "border-gray-300 bg-gray-50"
                }`}
                value={digit}
                onChange={(e) => setDigit(i, e.target.value)}
                onKeyDown={(e) => onKeyDown(i, e)}
                autoFocus={i === 0}
              />
            ))}
          </div>

          {status && (
            <p
              className={`mt-3 text-sm ${
                status.type === "ok" ? "text-green-700" : "text-red-600"
              }`}
            >
              {status.text}
            </p>
          )}

          <button
            type="submit"
            disabled={busy || code.length !== CODE_LENGTH}
            className="mt-6 w-full rounded-md bg-gray-900 py-3.5 text-sm font-medium tracking-wide text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto sm:px-10"
          >
            {busy ? "VERIFYING…" : "VERIFY"}
          </button>
        </form>

        <div className="mt-10 border-t border-gray-200 pt-6">
          <p className="text-sm font-medium text-gray-900">Didn&apos;t get the email?</p>
          <p className="mt-1 text-sm leading-relaxed text-gray-500">
            Check your spam folder. If you mistyped your address, enter the
            correct one below and we&apos;ll send a new code.
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <input
              type="email"
              className="w-full rounded-md border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
              placeholder={session?.email || "your@email.com"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              type="button"
              onClick={resend}
              disabled={busy}
              className="whitespace-nowrap rounded-md border border-gray-900 px-5 py-2.5 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-900 hover:text-white disabled:opacity-40"
            >
              Resend code
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
