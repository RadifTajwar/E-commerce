"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { ROUTES } from "@/config/constants";
import { authService } from "@/services/auth.service";

const CODE_LENGTH = 6;
type Step = "request" | "reset" | "done";

/**
 * Password reset in two steps: ask for a code, then set a new password with it.
 *
 * The first step always reports success, matching the backend, so this page
 * cannot be used to find out which addresses have accounts.
 */
export default function ForgotPasswordView() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("request");
  const [email, setEmail] = useState("");
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const boxes = useRef<(HTMLInputElement | null)[]>([]);

  const code = digits.join("");

  const requestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await authService.forgotPassword(email.trim());
      setStep("reset");
    } catch (err) {
      setError((err as Error)?.message || "Could not send a reset code.");
    } finally {
      setBusy(false);
    }
  };

  const submitReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("The two passwords do not match.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await authService.resetPassword({ email: email.trim(), code, password });
      setStep("done");
      setTimeout(() => router.push(ROUTES.login), 1800);
    } catch (err) {
      setError((err as Error)?.message || "Could not reset your password.");
    } finally {
      setBusy(false);
    }
  };

  const setDigit = (i: number, value: string) => {
    const char = value.replace(/\D/g, "").slice(-1);
    setError(null);
    setDigits((prev) => {
      const next = [...prev];
      next[i] = char;
      return next;
    });
    if (char && i < CODE_LENGTH - 1) boxes.current[i + 1]?.focus();
  };

  const onPaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, CODE_LENGTH);
    if (!pasted) return;
    e.preventDefault();
    const next = Array(CODE_LENGTH).fill("");
    pasted.split("").forEach((d, i) => (next[i] = d));
    setDigits(next);
    boxes.current[Math.min(pasted.length, CODE_LENGTH - 1)]?.focus();
  };

  const field =
    "w-full rounded-md border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10";
  const primary =
    "w-full rounded-md bg-gray-900 py-3.5 text-sm font-medium tracking-wide text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl text-gray-900">Reset your password</h1>

      {step === "request" && (
        <>
          <p className="mt-2 text-sm leading-relaxed text-gray-500">
            Enter the email you signed up with and we&apos;ll send you a 6-digit code.
          </p>
          <form onSubmit={requestCode} className="mt-8 space-y-4">
            <div>
              <label htmlFor="fp-email" className="mb-2 block text-sm font-medium text-gray-900">
                Email address
              </label>
              <input
                id="fp-email"
                type="email"
                autoComplete="email"
                className={field}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setError(null);
                  setEmail(e.target.value);
                }}
                required
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button type="submit" disabled={busy || !email.trim()} className={primary}>
              {busy ? "SENDING…" : "SEND CODE"}
            </button>
          </form>
        </>
      )}

      {step === "reset" && (
        <>
          <p className="mt-2 text-sm leading-relaxed text-gray-500">
            If an account exists for <span className="font-medium text-gray-900">{email}</span>,
            a code is on its way. It expires in 15 minutes.
          </p>
          <form onSubmit={submitReset} className="mt-8 space-y-5">
            <div>
              <span className="mb-2 block text-sm font-medium text-gray-900">Reset code</span>
              <div className="flex gap-2 sm:gap-3" onPaste={onPaste}>
                {digits.map((digit, i) => (
                  <input
                    // eslint-disable-next-line react/no-array-index-key
                    key={i}
                    ref={(el) => {
                      boxes.current[i] = el;
                    }}
                    inputMode="numeric"
                    autoComplete={i === 0 ? "one-time-code" : "off"}
                    maxLength={1}
                    aria-label={`Digit ${i + 1}`}
                    className={`h-14 w-full max-w-[56px] rounded-md border text-center text-xl font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 ${
                      digit ? "border-gray-900 bg-white" : "border-gray-300 bg-gray-50"
                    }`}
                    value={digit}
                    onChange={(e) => setDigit(i, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && !digits[i] && i > 0) boxes.current[i - 1]?.focus();
                    }}
                    autoFocus={i === 0}
                  />
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="fp-new" className="mb-2 block text-sm font-medium text-gray-900">
                New password
              </label>
              <input
                id="fp-new"
                type="password"
                autoComplete="new-password"
                minLength={6}
                className={field}
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => {
                  setError(null);
                  setPassword(e.target.value);
                }}
                required
              />
            </div>

            <div>
              <label htmlFor="fp-confirm" className="mb-2 block text-sm font-medium text-gray-900">
                Confirm new password
              </label>
              <input
                id="fp-confirm"
                type="password"
                autoComplete="new-password"
                minLength={6}
                className={field}
                placeholder="Type it again"
                value={confirm}
                onChange={(e) => {
                  setError(null);
                  setConfirm(e.target.value);
                }}
                required
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={busy || code.length !== CODE_LENGTH || password.length < 6}
              className={primary}
            >
              {busy ? "SAVING…" : "SET NEW PASSWORD"}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep("request");
                setDigits(Array(CODE_LENGTH).fill(""));
                setError(null);
              }}
              className="w-full text-sm text-gray-600 underline underline-offset-2 hover:text-gray-900"
            >
              Use a different email
            </button>
          </form>
        </>
      )}

      {step === "done" && (
        <div className="mt-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-green-50">
            <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden="true">
              <path d="m5 13 4 4L19 7" stroke="#16a34a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="text-lg text-gray-900">Password changed</p>
          <p className="mt-2 text-sm text-gray-500">Taking you to sign in…</p>
        </div>
      )}

      <p className="mt-10 text-center text-sm text-gray-500">
        <Link href={ROUTES.login} className="underline underline-offset-2 hover:text-gray-900">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
