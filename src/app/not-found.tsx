import Link from "next/link";
import { ROUTES } from "@/config/constants";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">404</p>
      <h1 className="mt-2 text-3xl font-semibold text-gray-800">Page not found</h1>
      <p className="mt-3 text-sm text-gray-500">The page you are looking for does not exist or has moved.</p>
      <div className="mt-8 flex gap-3">
        <Link href={ROUTES.home} className="rounded-full bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-700">
          Go home
        </Link>
        <Link href={ROUTES.shop} className="rounded-full border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-100">
          Continue shopping
        </Link>
      </div>
    </main>
  );
}
