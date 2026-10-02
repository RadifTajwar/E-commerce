import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import ThemeScript from "@/components/admin/ThemeScript";
import Providers from "@/components/layout/Providers";
import { clientEnv, getServerEnv } from "@/config/env";
import { resolveSession } from "@/server/session";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(clientEnv.NEXT_PUBLIC_APP_URL),
  title: {
    default: clientEnv.NEXT_PUBLIC_APP_NAME,
    template: `%s | ${clientEnv.NEXT_PUBLIC_APP_NAME}`,
  },
  description: "Leather bags, wallets and accessories.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

/**
 * Root layout (Server Component). Route groups own their own chrome:
 * (UserPage) renders the storefront header/footer, (AdminPage) its dashboard shell.
 */
export default async function RootLayout({ children }: { children: ReactNode }) {
  // Resolved here so the first paint already knows who is signed in.
  const token = cookies().get(getServerEnv().AUTH_COOKIE_NAME)?.value;
  const session = await resolveSession(token);

  return (
    <html lang="en">
      <body className={inter.className}>
        {/* First thing in the body: applies the saved theme before paint. */}
        <ThemeScript />
        <Providers initialSession={session}>{children}</Providers>
      </body>
    </html>
  );
}
