import Image from "next/image"

export default function productSection() {

    return (
        <>
            <div className="our_product flex justify-center m-5   mx-auto max-w-6xl">
                <div className="product">
                    <div className="text_section text-center mb-10">
                        <h1 className="text-4xl font-bold mb-5">
                            <span style={{ color: '#E8A811' }}>ALL</span> PRODUCTS
                        </h1>
                        <a href="#" className=" text-md  decoration-gray-800 hover:opacity-60 transition-opacity duration-300 cursor-pointer">
                            what's on the minds and in the carts of leather for luxury today? here's what we offer.
                        </a>

                    </div>
                    <div className="image grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 sm:grid-cols-2  lg:gap-28 ">

                        <div className="images flex justify-center">
                            <div className="image_1 cursor-pointer">
                                <div className="inner_imag h-auto w-[180px] lg:w-[250px] rounded-lg relative group overflow-hidden">
                                    <Image src="/steelblue.png" height={400} width={400} className="rounded-lg hover:opacity-60 group-hover:scale-125 duration-500" />

                                    
                                    {/* Icons Section */}
                                </div>
                                <div className="lower_txt flex justify-center">
                                    <div className="price_text_image text-center m-5">
                                        {/* Lower h1 with specific font size (13px) and font weight (400) */}
                                        <h1
                                            className="hover:opacity-60 transition-opacity duration-300 cursor-pointer"
                                            style={{ fontWeight: '400', fontSize: '17px' }}
                                        >
                                            Hand Bags
                                        </h1>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="images flex justify-center">
                            <div className="image_2 cursor-pointer">
                                <div className="inner_imag h-auto w-[180px] lg:w-[250px] rounded-lg relative group overflow-hidden">
                                    <Image src="/boxer.png" height={400} width={400} className="rounded-lg hover:opacity-60 group-hover:scale-125 duration-500" />

                                    

                                    {/* Icons Section */}
                                </div>





                                <div className="lower_txt flex justify-center">
                                    <div className="price_text_image text-center m-5">
                                        {/* Lower h1 with specific font size (13px) and font weight (400) */}
                                        <h1
                                            className="hover:opacity-60 transition-opacity duration-300 cursor-pointer"
                                            style={{ fontWeight: '400', fontSize: '17px' }}
                                        >
                                            Hand Bags
                                        </h1>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="images flex justify-center">
                            <div className="image_3 cursor-pointer">
                                <div className="inner_imag h-auto w-[180px] lg:w-[250px] rounded-lg relative group overflow-hidden">
                                    <Image src="/steelblue.png" height={400} width={400} className="rounded-lg hover:opacity-60 group-hover:scale-125 duration-500" />

                                    {/* Icons Section */}
                                </div>





                                <div className="lower_txt flex justify-center">
                                    <div className="price_text_image text-center m-5">
                                        {/* Lower h1 with specific font size (13px) and font weight (400) */}
                                        <h1
                                            className="hover:opacity-60 transition-opacity duration-300 cursor-pointer"
                                            style={{ fontWeight: '400', fontSize: '17px' }}
                                        >
                                            Handy Bags
                                        </h1>

                                    </div>
                                </div>
                            </div>
                        </div>



                    </div>
                </div>
            </div>

        </>
    )
}
