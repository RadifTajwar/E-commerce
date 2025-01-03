import Link from "next/link"
import { Banner } from "./banner"
export default function carouselSection() {
  return (
    <>
    <div id="default-carousel" className="relative w-full z-0" >
        
        <Banner />

        {/* Shop now button  */}

       <Link href="/shop">
       <div className="absolute z-30 flex -translate-x-1/2 bottom-20 sm:bottom-20 md:bottom-25 lg:bottom-30  left-1/2 space-x-3 rtl:space-x-reverse">
          <button className="relative flex h-[35px] w-[8rem] md:h-[45px] md:w-36 rounded-2xl items-center justify-center overflow-hidden bg-white font-medium text-black shadow-2xl transition-all duration-300 hover:bg-white hover:text-blue-600 hover:shadow-blue-600">
            <span className="relative z-30 text-xs sm:text-sm md:text-base">SHOP NOW</span>
            <span className="absolute inset-0 border-0 border-white transition-all duration-100 ease-linear hover:border-[25px]"></span>
          </button>
        </div>
       </Link> 

      </div>
    </>
  )
}
