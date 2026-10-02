"use client";
import { useSession } from "@/hooks/useSession";
import { loginUser, logoutUser } from "@/store/slices/auth.slice";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

/**
 * Admin sign-in.
 *
 * There is deliberately no password reset here: staff accounts are created and
 * recovered by hand. A self-service reset on an admin account would be the
 * weakest link in the whole dashboard.
 */
export default function AdminLoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isAdmin } = useSession();
  const [logMail, setLogMail] = useState("");
  const [logPass, setLogPass] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorLogin, setErrorLogin] = useState(null);
  const { status } = useSelector((state) => state.loginUser);

  const onLogMailChange = (e) => {
    setErrorLogin(null);
    setLogMail(e.target.value);
  };
  const onLogPassChange = (e) => {
    setErrorLogin(null);
    setLogPass(e.target.value);
  };

  const handleLogSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(
        loginUser({ email: logMail, password: logPass })
      ).unwrap();

      // The session cookie was set by /api/auth/login.
      if (result.session?.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        // A non-admin account must not keep a session on the admin login page.
        await dispatch(logoutUser());
        setErrorLogin("Only Admins are allowed to login.");
      }
    } catch {
      setErrorLogin("Invalid credentials or user does not exist.");
    }
  };

  useEffect(() => {
    // Already signed in as an admin: go straight to the dashboard.
    if (isAdmin) router.replace("/admin/dashboard");
  }, [router, isAdmin]);

  const busy = status === "loading";

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0b0d12] px-4 py-12">
      {/* Ambient wash: two soft pools of light behind the card. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-amber-500/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-52 -right-40 h-[34rem] w-[34rem] rounded-full bg-sky-500/10 blur-3xl"
      />

      <div className="relative w-full max-w-sm">
        <div className="mb-9 text-center">
          <p className="font-serif text-3xl tracking-[0.18em] text-white">TITHI</p>
          <p className="mt-2 text-[11px] uppercase tracking-[0.3em] text-white/35">
            Administration
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl shadow-black/40 backdrop-blur-xl">
          <h1 className="text-lg font-medium text-white">Sign in</h1>
          <p className="mt-1.5 text-sm text-white/45">
            Staff access only.
          </p>

          <form onSubmit={handleLogSubmit} className="mt-7 space-y-5">
            <div>
              <label
                htmlFor="admin-email"
                className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/50"
              >
                Email
              </label>
              <input
                id="admin-email"
                type="email"
                autoComplete="username"
                className={`w-full rounded-lg border bg-white/[0.06] px-4 py-3 text-sm text-white placeholder:text-white/25 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400/30 ${
                  errorLogin ? "border-red-400/60" : "border-white/10 focus:border-white/25"
                }`}
                placeholder="you@leatherforluxury.com"
                value={logMail}
                onChange={onLogMailChange}
                required
              />
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/50"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className={`w-full rounded-lg border bg-white/[0.06] px-4 py-3 pr-12 text-sm text-white placeholder:text-white/25 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400/30 ${
                    errorLogin ? "border-red-400/60" : "border-white/10 focus:border-white/25"
                  }`}
                  placeholder="••••••••"
                  value={logPass}
                  onChange={onLogPassChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-white/35 transition-colors hover:text-white/70"
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5" width="18" height="18">
                      <path
                        d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.4 5.2A9.5 9.5 0 0112 5c5 0 9 4.5 9 7a11 11 0 01-2.4 3.4M6.2 6.7A11.6 11.6 0 003 12c0 2.5 4 7 9 7a9.7 9.7 0 003.7-.7"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5" width="18" height="18">
                      <path
                        d="M3 12s3.6-7 9-7 9 7 9 7-3.6 7-9 7-9-7-9-7z"
                        stroke="currentColor"
                        strokeWidth="1.6"
                      />
                      <circle cx="12" cy="12" r="2.6" stroke="currentColor" strokeWidth="1.6" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {errorLogin && (
              <div
                role="alert"
                className="flex items-start gap-2.5 rounded-lg border border-red-400/25 bg-red-500/10 px-3.5 py-3"
              >
                <svg viewBox="0 0 24 24" fill="none" className="mt-px shrink-0" width="16" height="16">
                  <circle cx="12" cy="12" r="9" stroke="#f87171" strokeWidth="1.6" />
                  <path d="M12 7.5v5M12 16h.01" stroke="#f87171" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                <p className="text-sm text-red-200">{errorLogin}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-white py-3.5 text-sm font-semibold tracking-wide text-gray-900 transition-all hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy && (
                <span
                  aria-hidden="true"
                  className="h-4 w-4 animate-spin rounded-full border-2 border-gray-900/25 border-t-gray-900"
                />
              )}
              {busy ? "SIGNING IN" : "SIGN IN"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs leading-relaxed text-white/30">
          Lost access? Ask another administrator — staff passwords are not reset
          by email.
        </p>
      </div>
    </div>
  );
}
