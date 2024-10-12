import BannerSection from "@/components/ui/components/bannerSection";
import CarouselSection from "@/components/ui/components/carouselSection";
import Cart from "@/components/ui/components/cart";
import Footer from "@/components/ui/components/footer";
import ProductSection from "@/components/ui/components/productSection";
export default function Home() {
  return (
    <>
      <CarouselSection/>
      <ProductSection/>
      <BannerSection/>
      <Cart />
      {/* <Collection/> */}
      <Footer/>
    </>
  );
}
