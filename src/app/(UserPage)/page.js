import BannerSection from "@/components/ui/components/bannerSection";
import CarouselSection from "@/components/ui/components/carouselSection";
import Cart from "@/components/ui/components/cart";
import ProductSection from "@/components/ui/components/productSection";
import { clientEnv } from "@/config/env";
import { getHeroBanners, getParentCategories, safely } from "@/server/queries";

/** Regenerated every 10 minutes so the hero and category tiles stay fresh. */
export const revalidate = 600;

export const metadata = {
  // The home page names what the store sells, not just the brand.
  title: { absolute: `${clientEnv.NEXT_PUBLIC_APP_NAME} | Leather bags, wallets and accessories` },
  alternates: { canonical: "/" },
};

export default async function Home() {
  // Fetched on the server so the hero (the LCP element) is in the first paint.
  const [heroBanners, parentCategories] = await Promise.all([
    safely("heroBanners", getHeroBanners, []),
    safely("parentCategories", getParentCategories, []),
  ]);

  return (
    <>
      {/* The page's one h1: the hero is images, the section titles are h2. */}
      <h1 className="sr-only">
        {clientEnv.NEXT_PUBLIC_APP_NAME}: leather bags, wallets and accessories
      </h1>
      <div className="carousel  mb-14">
        <CarouselSection initialBanners={heroBanners} />
      </div>

      <ProductSection initialParentCategories={parentCategories} />
      <BannerSection />
      <div className=" text flex justify-center   border-b border-[#ece1d3] max-w-xl xl:max-w-7xl container mx-auto mt-10">
        <div className="text text-center">
          <h2 className="text-4xl font-bold ">
            <span className="text-[#E8A811]">TRENDING</span> PRODUCTS
          </h2>
          <p className=" text-md  decoration-gray-800 hover:opacity-60 transition-opacity duration-300 cursor-pointer my-3">
            BAGS
          </p>
        </div>
      </div>
      <Cart />
    </>
  );
}
