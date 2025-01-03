import BannerSection from "@/components/ui/components/bannerSection";
import CarouselSection from "@/components/ui/components/carouselSection";
import Cart from "@/components/ui/components/cart";
import ProductSection from "@/components/ui/components/productSection";

export default function Home() {
  return (
    <>
      <div className="carousel  mb-14">
        <CarouselSection />
      </div>

      <ProductSection />
      <BannerSection />
      <div className=" text flex justify-center   border-b border-[#ece1d3] max-w-xl xl:max-w-7xl container mx-auto mt-10">
        <div className="text text-center">
          <h1 className="text-4xl font-bold ">
            <span style={{ color: '#E8A811' }}>TRENDING</span> PRODUCTS
          </h1>
          <p className=" text-md  decoration-gray-800 hover:opacity-60 transition-opacity duration-300 cursor-pointer my-3">
            BAGS
          </p>
        </div>

      </div>
      <Cart />
      {/* <Collection/> */}

    </>
  );
}
