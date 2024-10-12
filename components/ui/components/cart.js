import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

export default function cart() {
  return (
    <>

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
      <div className="flex justify-center max-w-7xl mx-auto md:px-20">
        <div className="flex container flex-col items-center justify-center   md:py-10 p-0">


          <Carousel className=" h-auto my-5 flex justify-center sm:w-1/2 md:w-11/12 xl:w-full w-1/2 ">
            <CarouselContent className=" gap-x-1 ml-0"> {/* Add horizontal gap between items */}
              {Array.from({ length: 5 }).map((_, index) => (
                <CarouselItem
                  key={index}
                  className="  pl-9 md:pl-2 sm:basis-full          md:basis-1/3     xl:basis-1/4
        "
                >
                  <div className="text-center">
                    <Card className="max-w-[250px] md:max-w-[230px] lg:max-w-[250px] xl:max-w-[280px] h-auto rounded-none object-contain">
                      <CardContent className="flex items-center justify-center p-0">
                        <div className="image_3 cursor-pointer">
                          <div className="inner_imag h-auto w-full relative group overflow-hidden">
                            {/* Default Image */}
                            <Image
                              src="/Annabelle-Business-Bag-Brown-1.jpg"
                              height={500}
                              width={500}
                              objectFit="contain"
                              className=" group-hover:opacity-0 duration-500"
                            />

                            {/* Hover Image */}
                            <Image
                              src="/Annabelle-Business-Bag-Brown-3.jpg"
                              height={500}
                              width={500}
                              objectFit="contain"
                              className="absolute top-0 left-0  h-auto opacity-0 group-hover:opacity-100 group-hover:duration-1000 group-hover:scale-110"
                            />

                            {/* Icon Pop-Up Div */}
                            <div className="absolute top-0 -right-2 mt-2 w-auto bg-white p-3 opacity-0 group-hover:opacity-100 group-hover:-translate-x-1/3 transition-all duration-300 ease-out h-auto transform hidden lg:block ">
                              <div className="flex flex-col items-center gap-2 hidden md:block ">
                                {/* Search Icon */}
                                <div className="text-gray-600 hover:text-black transition-colors duration-200">
                                  <svg fill="#000000" xmlns="http://www.w3.org/2000/svg" className="h-5 y-5"
                                    viewBox="0 0 488.4 488.4">


                                    <path d="M0,203.25c0,112.1,91.2,203.2,203.2,203.2c51.6,0,98.8-19.4,134.7-51.2l129.5,129.5c2.4,2.4,5.5,3.6,8.7,3.6
			                            s6.3-1.2,8.7-3.6c4.8-4.8,4.8-12.5,0-17.3l-129.6-129.5c31.8-35.9,51.2-83,51.2-134.7c0-112.1-91.2-203.2-203.2-203.2
			                            S0,91.15,0,203.25z M381.9,203.25c0,98.5-80.2,178.7-178.7,178.7s-178.7-80.2-178.7-178.7s80.2-178.7,178.7-178.7
			                            S381.9,104.65,381.9,203.25z"/>


                                  </svg>
                                </div>

                                {/* Love Icon */}
                                <div className="text-red-500 hover:text-red-700 transition-colors duration-200 mt-4">
                                  <svg fill="#000000" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-6 y-6">

                                    <path d="M20.5,4.609A5.811,5.811,0,0,0,16,2.5a5.75,5.75,0,0,0-4,1.455A5.75,5.75,0,0,0,8,2.5,5.811,5.811,0,0,0,3.5,4.609c-.953,1.156-1.95,3.249-1.289,6.66,1.055,5.447,8.966,9.917,9.3,10.1a1,1,0,0,0,.974,0c.336-.187,8.247-4.657,9.3-10.1C22.45,7.858,21.453,5.765,20.5,4.609Zm-.674,6.28C19.08,14.74,13.658,18.322,12,19.34c-2.336-1.41-7.142-4.95-7.821-8.451-.513-2.646.189-4.183.869-5.007A3.819,3.819,0,0,1,8,4.5a3.493,3.493,0,0,1,3.115,1.469,1.005,1.005,0,0,0,1.76.011A3.489,3.489,0,0,1,16,4.5a3.819,3.819,0,0,1,2.959,1.382C19.637,6.706,20.339,8.243,19.826,10.889Z" />

                                  </svg>
                                </div>
                              </div>
                            </div>

                            {/* Cart icon div */}
                            <div className="absolute left-0 bottom-0  w-auto  p-2 h-auto transform lg:opacity-0" style={{ backgroundColor: '#E8A811' }} >
                              <div className="flex flex-col items-center gap-2">


                                {/* Cart Icon */}
                                <div className="text-red-500 hover:text-red-700 transition-colors duration-200 ">
                                  <svg viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg" className="h-6 y-6">
                                    <path d="m5.50835165 12.5914912c-.00106615-.0057657-.00203337-.011566-.00289985-.0173991l-1.22011509-7.32069058c-.12054699-.72328196-.74633216-1.25340152-1.47959089-1.25340152h-.30574582c-.27614237 0-.5-.22385763-.5-.5s.22385763-.5.5-.5h.30574582c1.1918179 0 2.21327948.84029234 2.44951006 2h16.24474412c.3321894 0 .5720214.31795246.480762.63736056l-2 7.00000004c-.0613288.2146507-.2575218.3626394-.480762.3626394h-12.90976979l.12443308.7465985c.12054699.7232819.74633216 1.2534015 1.47959089 1.2534015h11.30574582c.2761424 0 .5.2238576.5.5s-.2238576.5-.5.5h-11.30574582c-1.22209789 0-2.26507316-.8835326-2.46598481-2.0890025l-.21991747-1.3195048zm-.08478811-6.5914912 1 6h12.69928576l1.7142857-6zm2.57643646 15c-1.1045695 0-2-.8954305-2-2s.8954305-2 2-2 2 .8954305 2 2-.8954305 2-2 2zm0-1c.55228475 0 1-.4477153 1-1s-.44771525-1-1-1-1 .4477153-1 1 .44771525 1 1 1zm9 1c-1.1045695 0-2-.8954305-2-2s.8954305-2 2-2 2 .8954305 2 2-.8954305 2-2 2zm0-1c.5522847 0 1-.4477153 1-1s-.4477153-1-1-1-1 .4477153-1 1 .4477153 1 1 1z" />
                                  </svg>
                                </div>
                              </div>
                            </div>

                            {/* small screen add to wishlist rounded div */}
                            <div className="absolute top-0 right-0  m-2 w-auto  p-2 h-auto bg-white transform lg:opacity-0 rounded-full"   >
                              <div className="flex flex-col items-center gap-2 ">


                                {/* love icon */}
                                <div className="text-red-500 hover:text-red-700 transition-colors duration-200 ">
                                  <svg fill="#000000" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-6 y-6">

                                    <path d="M20.5,4.609A5.811,5.811,0,0,0,16,2.5a5.75,5.75,0,0,0-4,1.455A5.75,5.75,0,0,0,8,2.5,5.811,5.811,0,0,0,3.5,4.609c-.953,1.156-1.95,3.249-1.289,6.66,1.055,5.447,8.966,9.917,9.3,10.1a1,1,0,0,0,.974,0c.336-.187,8.247-4.657,9.3-10.1C22.45,7.858,21.453,5.765,20.5,4.609Zm-.674,6.28C19.08,14.74,13.658,18.322,12,19.34c-2.336-1.41-7.142-4.95-7.821-8.451-.513-2.646.189-4.183.869-5.007A3.819,3.819,0,0,1,8,4.5a3.493,3.493,0,0,1,3.115,1.469,1.005,1.005,0,0,0,1.76.011A3.489,3.489,0,0,1,16,4.5a3.819,3.819,0,0,1,2.959,1.382C19.637,6.706,20.339,8.243,19.826,10.889Z" />

                                  </svg>
                                </div>
                              </div>
                            </div>

                            {/* "VIEW ALL" button */}
                            <div className="cursor-pointer absolute w-full text-center bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full bg-black bg-opacity-60 text-white px-4 py-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200 hover:text-black hidden lg:block">
                              Add To Cart
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>


                    <div className="lower_txt flex justify-center">
                      <div className="price_text_image text-center m-1">
                        <h1
                          className="hover:opacity-60 transition-opacity duration-300 cursor-pointer"
                          style={{ fontWeight: '400', fontSize: '12px' }}
                        >
                          Annable Business bag printed blue
                        </h1>
                        <p>
                          <span style={{ textDecoration: 'line-through', color: '#a9a9a9' }}>$4000</span>
                          <span style={{ color: '#E8A811', marginLeft: '8px' }}>$3500</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>



    </>
  );
}
