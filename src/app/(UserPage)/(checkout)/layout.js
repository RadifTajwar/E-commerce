import CheckoutSteps from "@/components/storefront/checkout/CheckoutSteps";

/** Server Component: only the step indicator below needs the current path. */
export default function CheckoutLayout({ children }) {
  return (
    <div>
      <header>
        <CheckoutSteps />
      </header>
      <main>{children}</main>
    </div>
  );
}
