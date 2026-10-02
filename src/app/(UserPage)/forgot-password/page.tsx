import type { Metadata } from "next";
import ForgotPasswordView from "@/components/storefront/account/ForgotPasswordView";

export const metadata: Metadata = {
  title: "Reset your password",
  description: "Get a code by email and choose a new password.",
};

export default function Page() {
  return <ForgotPasswordView />;
}
