import SiteHeader from "@/components/layout/SiteHeader";
import VerifyEmailBanner from "@/components/storefront/account/VerifyEmailBanner";
import Footer from "@/components/ui/components/footer";

/** Storefront chrome: sticky header with drawers, page content, footer. */
export default function StorefrontLayout({ children }) {
  return (
    <>
      <SiteHeader />
      <VerifyEmailBanner />
      {/* flex-1 keeps the footer at the bottom of the viewport no matter how
          little content a page has while it loads. */}
      <main className="flex-1">{children}</main>
      <footer>
        <Footer />
      </footer>
    </>
  );
}
