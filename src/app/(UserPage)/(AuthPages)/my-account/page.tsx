import type { Metadata } from "next";
import LoginRegisterView from "@/components/storefront/account/LoginRegisterView";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your account or create a new one.",
};

/** Server shell: client pages cannot export metadata, so the view lives beside it. */
export default function Page() {
  return <LoginRegisterView />;
}
