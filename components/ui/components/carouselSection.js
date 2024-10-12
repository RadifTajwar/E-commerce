
export default function carouselSection() {
  return (
    <>
    <div id="default-carousel" className="relative w-full z-0" data-carousel="static">
        {/* Carousel wrapper */}
        <div className="relative overflow-hidden rounded-sm h-[35rem] md:h-[38rem] lg:h-[45rem] ">
          {/* Item 1 */}
          <div className="hidden duration-700 ease-in-out" data-carousel-item>

            <img src="/banner1.jpg" className="w-full h-full object-cover" alt="Banner 1" />

          </div>
          {/* Item 2 */}
          <div className="hidden duration-700 ease-in-out" data-carousel-item>
            <img src="/banner2.jpg" className="w-full h-full object-cover" alt="Banner 1" />
          </div>
          {/* Item 3 */}
          <div className="hidden duration-700 ease-in-out" data-carousel-item>
            <img src="/banner3.jpg" className="w-full h-full object-cover" alt="Banner 1" />
          </div>
          {/* Item 4 */}
          <div className="hidden duration-700 ease-in-out" data-carousel-item>
            <img src="/banner4.jpg" className="w-full h-full object-cover" alt="Banner 1" />
          </div>
        </div>

        {/* Slider controls */}

        {/* left control  */}
        <button type="button" className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-prev>
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
            <svg className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4" />
            </svg>
            <span className="sr-only">Previous</span>
          </span>
        </button>

        {/* right control  */}
        <button type="button" className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-next>
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
            <svg className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
            </svg>
            <span className="sr-only">Next</span>
          </span>
        </button>

        {/* Shop now button  */}

        <div className="absolute z-30 flex -translate-x-1/2 bottom-20 sm:bottom-20 md:bottom-25 lg:bottom-30  left-1/2 space-x-3 rtl:space-x-reverse">
          <button className="relative flex h-[35px] w-[8rem] md:h-[45px] md:w-36 rounded-2xl items-center justify-center overflow-hidden bg-white font-medium text-black shadow-2xl transition-all duration-300 hover:bg-white hover:text-blue-600 hover:shadow-blue-600">
            <span className="relative z-30 text-xs sm:text-sm md:text-base">SHOP NOW</span>
            <span className="absolute inset-0 border-0 border-white transition-all duration-100 ease-linear hover:border-[25px]"></span>
          </button>
        </div>

      </div>
    </>
  )
}
