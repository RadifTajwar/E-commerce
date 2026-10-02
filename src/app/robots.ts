import type { MetadataRoute } from "next";
import { clientEnv } from "@/config/env";

/** /robots.txt: crawl the storefront; keep admin, the API, cart, checkout and accounts out. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/", "/cart", "/checkout", "/my-account", "/myAccount", "/forgot-password"],
    },
    sitemap: new URL("/sitemap.xml", clientEnv.NEXT_PUBLIC_APP_URL).toString(),
  };
}
