import SiteHeader from "@/components/layout/SiteHeader";
import Footer from "@/components/ui/components/footer";

/** Storefront chrome: sticky header with drawers, page content, footer. */
export default function StorefrontLayout({ children }) {
  return (
    <>
      <SiteHeader />
      {children}
      <footer>
        <Footer />
      </footer>
    </>
  );
}
