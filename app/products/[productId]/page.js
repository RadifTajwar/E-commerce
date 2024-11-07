'use client'
import ImageEffect from "@/components/imageEffect";
import { Card, CardContent } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import Cart from "@/components/ui/components/cart";
import AccordionSection from "@/components/ui/components/productCart/accordionSection";
import '@/components/ui/components/shop/scrollbar.css';
import DoneIcon from '@mui/icons-material/Done';
import Image from "next/image";
import './style.css';
export default function productId({ params }) {

    const wallet = '/wallet-tasa-lg.jpg'
    const watch = '/wristwatch_1200.jpg'
    return (
        <>


            <div className="productIdCart my-2">
                <div className="upper_part max-w-7xl mx-auto px-4">
                    <div className="flex w-full space-x-4">

                        <div className="one&two w-full md:w-1/2 lg:w-4/6  lg:flex lg:me-5">
                            <div className="one w-1/4 pe-5 hidden lg:block">
                                <Carousel
                                    opts={{
                                        align: "start",
                                    }}
                                    orientation="vertical"
                                    className="carousel w-full max-w-full "
                                >
                                    <CarouselContent className="-mt-0 h-[569px] ">
                                        {Array.from({ length: 10 }).map((_, index) => (
                                            <CarouselItem key={index} className="pt-0 basis-1/3">
                                                <div className="p-0">
                                                    <Card className="rounded-none border-none">
                                                        <CardContent className=" flex items-center justify-center p-0 overflow-hidden">
                                                            <Image src="/wallet-tasa-lg.jpg" height={174} width={184} objectFit="cover" className="min-h-[174px] min-w-[190px]" >
                                                            </Image>
                                                        </CardContent>
                                                    </Card>
                                                </div>
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                    <div className="flex justify-between items-center  mt-2">
                                        <CarouselPrevious className="relative left-0 right-0 top-0 bottom-0 w-20 h-8 rounded-none transform-none hover:bg-gray-800 hover:text-white transition  hover:border-black" />
                                        <CarouselNext className="relative left-0 right-0 top-0 bottom-0 w-20 h-8 rounded-none transform-none hover:bg-gray-800 hover:text-white transition  hover:border-black" />

                                    </div>

                                </Carousel>

                            </div>
                            <div className="two w-full lg:w-3/4  mx-auto ">
                                <div className="inner_image w-full ">
                                    <Carousel className="w-full ">
                                        <CarouselContent>
                                            {Array.from({ length: 5 }).map((_, index) => (
                                                <CarouselItem key={index}>
                                                    <div className="p-0">
                                                        <Card className="rounded-none border-none">
                                                            <CardContent className="flex  items-center justify-center p-0">
                                                                <div className="inner w-full ">
                                                                    <ImageEffect src={wallet} />
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    </div>
                                                </CarouselItem>
                                            ))}
                                        </CarouselContent>
                                        <CarouselPrevious className="left-0" />
                                        <CarouselNext className="right-0" />
                                    </Carousel>
                                </div>

                            </div>
                            <div className="one w-full  lg:hidden my-3 ">

                                <Carousel className="w-full ">
                                    <CarouselContent className="space-x-[2px] -ml-0">
                                        {Array.from({ length: 5 }).map((_, index) => (
                                            <CarouselItem key={index} className="pl-0  basis-1/3 sm:basis-1/4">
                                                <div className="p-0">
                                                    <Card className="border-none">
                                                        <CardContent className="flex  items-center justify-center p-0 justify-between">
                                                            <div className="w-full  h-full">
                                                                <Image src="/wallet-tasa-lg.jpg" height={117} width={117} objectFit="contain" className="w-[177px] h-auto md:h-auto md:w-[115px]"  >
                                                                </Image>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                </div>
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                    <CarouselPrevious className="left-0" />
                                    <CarouselNext className="right-0" />
                                </Carousel>
                            </div>
                        </div>
                        <div className=" three hidden md:block md:w-1/2 lg:w-2/6   border border-px shadow ms-5">
                            <div className="inner px-10 py-12 w-full h-full ">
                                <div className="txt space-y-2 mb-4">
                                    <h1 className="text-3xl font-normal text-center text-gray-800">A4 File Bag Series 2</h1>
                                    <p className="text-center">
                                        <span style={{ textDecoration: 'line-through', color: '#a9a9a9' }} className='text-lg'>$1350.00</span>
                                        <span className="text-xl text-gray-700 font-medium" style={{ marginLeft: '8px' }}>$3500.00</span>
                                    </p>
                                </div>

                                <div className="color_section flex items-center justify-center">
                                    <div className="lg:w-1/3 ">
                                        <p className="text-center text-gray-800 text-lg font-semibold">Color :</p>
                                    </div>
                                    <div className=" rangeBar max-w-[200px] max-h-[65px] overflow-scroll flex space-x-2 justify-between">
                                        <div className="color_palette group cursor-pointer min-w-[62px] min-h-[62px] bg-[#745679] rounded-3xl flex items-center justify-center">
                                            <div className="tick_icon hidden group-hover:block ">
                                                <DoneIcon className='text-white' />
                                            </div>

                                        </div>
                                        <div className="color_palette group cursor-pointer min-w-[62px] min-h-[62px] bg-[#740224] rounded-3xl flex items-center justify-center">
                                            <div className="tick_icon hidden group-hover:block ">
                                                <DoneIcon className='text-white' />
                                            </div>
                                        </div>
                                        <div className="color_palette group cursor-pointer min-w-[62px] min-h-[62px] bg-[#740224] rounded-3xl flex items-center justify-center">
                                            <div className="tick_icon hidden group-hover:block ">
                                                <DoneIcon className='text-white' />
                                            </div>
                                        </div>
                                        <div className="color_palette group cursor-pointer min-w-[62px] min-h-[62px] bg-[#740224] rounded-3xl flex items-center justify-center">
                                            <div className="tick_icon hidden group-hover:block ">
                                                <DoneIcon className='text-white' />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="quantity_section flex justify-center">
                                    <div className="inner flex  my-4">
                                        {/* Minus Button */}
                                        <button className="border border-2 px-3 py-3 hover:bg-gray-800 hover:text-white transition  hover:border-black">
                                            -
                                        </button>

                                        {/* Quantity Display with left and right borders */}
                                        <span className="px-3 py-3  border-t-2 border-b-2">1</span>

                                        {/* Plus Button */}
                                        <button className="border border-2 px-3 py-3 hover:bg-gray-800 hover:text-white transition  hover:border-black">
                                            +
                                        </button>
                                    </div>
                                </div>

                                <div className="Add_to_cart&Buy_now space-y-2">

                                    <div className="buttons_ADD_TO_CART bg-black  text-white text-center">
                                        <button className="text-center w-full py-3 text-sm font-medium">ADD TO CART</button>
                                    </div>
                                    <div className="text-center buttons_BUY_NOW bg-black  text-white">
                                        <button className="text-center w-full py-3 text-sm font-medium">BUY NOW</button>
                                    </div>
                                </div>


                                <div className="product_detail my-6">
                                    <div className="w-full flex justify-between items-center py-4">
                                        <div className="detail_type">
                                            <p className="text-sm text-gray-900 font-normal">Leather Type</p>
                                        </div>
                                        <div className="detail_type">
                                            <p className="text-sm text-gray-500 font-normal">Leather Type</p>

                                        </div>
                                    </div>
                                    <div className="line w-full border-t border-gray-300 "></div>

                                    <div className="w-full flex justify-between items-center py-4">
                                        <div className="detail_type">
                                            <p className="text-sm text-gray-900 font-normal">Leather Hide</p>
                                        </div>
                                        <div className="detail_type">
                                            <p className="text-sm text-gray-500 font-normal">Cow</p>

                                        </div>
                                    </div>
                                    <div className="line w-full border-t border-gray-300 "></div>

                                    <div className="w-full flex justify-between items-center py-4">
                                        <div className="detail_type">
                                            <p className="text-sm text-gray-900 font-normal">Size </p>
                                        </div>
                                        <div className="detail_type">
                                            <p className="text-sm text-gray-500 font-normal">Length-12.8 Inch</p>
                                            <p className="text-sm text-gray-500 font-normal">Height- 10 Inch</p>
                                            <p className="text-sm text-gray-500 font-normal">Depth- 1.1 Inch</p>

                                        </div>
                                    </div>
                                    <div className="line w-full border-t border-gray-300 "></div>

                                    <div className="w-full flex justify-between items-center py-4">
                                        <div className="detail_type">
                                            <p className="text-sm text-gray-900 font-normal">Warranty </p>
                                        </div>
                                        <div className="detail_type">
                                            <p className="text-sm text-gray-500 font-normal">12 months</p>

                                        </div>
                                    </div>
                                    <div className="line w-full border-t border-gray-300 "></div>

                                    <div className="w-full flex justify-between items-center py-4">
                                        <div className="detail_type">
                                            <p className="text-sm text-gray-900 font-normal">Color  </p>
                                        </div>
                                        <div className="detail_type">
                                            <p className="text-sm text-gray-500 font-normal">Black, Chocolate</p>

                                        </div>
                                    </div>



                                </div>

                                <div className="product_caption w-full ">
                                    <p className="text-sm text-gray-500 font-normal text-center">Your everyday job will be easier if you keep all of your paperwork, file, documents, tabs up to 10 inches, checkbooks, certificates, business cards, and pencils in an A4 file bag. Cowhide is used to create the bag, which has a long lifespan.</p>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className=" three w-full  md:hidden border border-px shadow ">
                        <div className="inner px-10 py-12 w-full h-full ">
                            <div className="txt space-y-2 mb-4">
                                <h1 className=" text-lg md:text-xl xl:text-3xl font-normal text-center text-gray-800">A4 File Bag Series 2</h1>
                                <p className="text-center">
                                    <span style={{ textDecoration: 'line-through', color: '#a9a9a9' }} className='text-md lg:text-lg'>$1350.00</span>
                                    <span className="md:text-lg lg:text-xl text-gray-700 font-medium" style={{ marginLeft: '8px' }}>$3500.00</span>
                                </p>
                            </div>

                            <div className="color_section flex items-center justify-center space-x-4">
                                <div className="">
                                    <p className="text-center text-gray-800  text-md font-semibold">Color :</p>
                                </div>
                                <div className=" rangeBar max-w-[300px] max-h-[65px] overflow-scroll flex space-x-2 justify-between">
                                    <div className="color_palette group cursor-pointer min-w-[62px] min-h-[62px] bg-[#745679] rounded-3xl flex items-center justify-center">
                                        <div className="tick_icon hidden group-hover:block ">
                                            <DoneIcon className='text-white' />
                                        </div>

                                    </div>
                                    <div className="color_palette group cursor-pointer min-w-[62px] min-h-[62px] bg-[#740224] rounded-3xl flex items-center justify-center">
                                        <div className="tick_icon hidden group-hover:block ">
                                            <DoneIcon className='text-white' />
                                        </div>
                                    </div>
                                    <div className="color_palette group cursor-pointer min-w-[62px] min-h-[62px] bg-[#740224] rounded-3xl flex items-center justify-center">
                                        <div className="tick_icon hidden group-hover:block ">
                                            <DoneIcon className='text-white' />
                                        </div>
                                    </div>
                                    <div className="color_palette group cursor-pointer min-w-[62px] min-h-[62px] bg-[#740224] rounded-3xl flex items-center justify-center">
                                        <div className="tick_icon hidden group-hover:block ">
                                            <DoneIcon className='text-white' />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="quantity_section flex justify-center">
                                <div className="inner flex  my-4">
                                    {/* Minus Button */}
                                    <button className="border border-2 px-3 py-3 hover:bg-gray-800 hover:text-white transition  hover:border-black">
                                        -
                                    </button>

                                    {/* Quantity Display with left and right borders */}
                                    <span className="px-3 py-3  border-t-2 border-b-2">1</span>

                                    {/* Plus Button */}
                                    <button className="border border-2 px-3 py-3 hover:bg-gray-800 hover:text-white transition  hover:border-black">
                                        +
                                    </button>
                                </div>
                            </div>

                            <div className="Add_to_cart&Buy_now space-y-2">

                                <div className="buttons_ADD_TO_CART bg-black  text-white text-center">
                                    <button className="text-center w-full py-3 text-sm font-medium">ADD TO CART</button>
                                </div>
                                <div className="text-center buttons_BUY_NOW bg-black  text-white">
                                    <button className="text-center w-full py-3 text-sm font-medium">BUY NOW</button>
                                </div>
                            </div>


                            <div className="product_detail my-6">
                                <div className="w-full flex justify-between items-center py-4">
                                    <div className="detail_type">
                                        <p className="text-sm text-gray-900 font-normal">Leather Type</p>
                                    </div>
                                    <div className="detail_type">
                                        <p className="text-sm text-gray-500 font-normal">Leather Type</p>

                                    </div>
                                </div>
                                <div className="line w-full border-t border-gray-300 "></div>

                                <div className="w-full flex justify-between items-center py-4">
                                    <div className="detail_type">
                                        <p className="text-sm text-gray-900 font-normal">Leather Hide</p>
                                    </div>
                                    <div className="detail_type">
                                        <p className="text-sm text-gray-500 font-normal">Cow</p>

                                    </div>
                                </div>
                                <div className="line w-full border-t border-gray-300 "></div>

                                <div className="w-full flex justify-between items-center py-4">
                                    <div className="detail_type">
                                        <p className="text-sm text-gray-900 font-normal">Size </p>
                                    </div>
                                    <div className="detail_type">
                                        <p className="text-sm text-gray-500 font-normal">Length-12.8 Inch</p>
                                        <p className="text-sm text-gray-500 font-normal">Height- 10 Inch</p>
                                        <p className="text-sm text-gray-500 font-normal">Depth- 1.1 Inch</p>

                                    </div>
                                </div>
                                <div className="line w-full border-t border-gray-300 "></div>

                                <div className="w-full flex justify-between items-center py-4">
                                    <div className="detail_type">
                                        <p className="text-sm text-gray-900 font-normal">Warranty </p>
                                    </div>
                                    <div className="detail_type">
                                        <p className="text-sm text-gray-500 font-normal">12 months</p>

                                    </div>
                                </div>
                                <div className="line w-full border-t border-gray-300 "></div>

                                <div className="w-full flex justify-between items-center py-4">
                                    <div className="detail_type">
                                        <p className="text-sm text-gray-900 font-normal">Color  </p>
                                    </div>
                                    <div className="detail_type">
                                        <p className="text-sm text-gray-500 font-normal">Black, Chocolate</p>

                                    </div>
                                </div>



                            </div>

                            <div className="product_caption w-full ">
                                <p className="text-sm text-gray-500 font-normal text-center">Your everyday job will be easier if you keep all of your paperwork, file, documents, tabs up to 10 inches, checkbooks, certificates, business cards, and pencils in an A4 file bag. Cowhide is used to create the bag, which has a long lifespan.</p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <div className="description_&_review_sectionmy-2">
                <div className="upper_part max-w-7xl mx-auto px-4">

                    <AccordionSection />
                </div>
            </div>
            <div className=" text flex justify-center  max-w-xl xl:max-w-7xl container mx-auto mt-10">
                <div className="text text-center">
                    <h1 className="text-2xl md:text-4xl font-bold ">
                        <span style={{ color: '#E8A811' }}>RELATED</span> PRODUCTS
                    </h1>
                    <p className=" text-md  decoration-gray-800 hover:opacity-60 transition-opacity duration-300 cursor-pointer my-3">
                        BAGS
                    </p>
                </div>

            </div>
            <Cart />
            
            



        </>


    )
}
