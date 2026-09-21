import Image from "next/image"
export default function bannerSection() {
    return (

        <>
            <div className="section2  mx-auto flex justify-center container  xl:max-w-6xl container mx-auto ">

                <div className="overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2  items-center ">
                        {/* Image Column */}
                        <div className="container mx-auto max-auto h-auto  max-w-[300px] sm:max-w-[410px]  lg:max-w-[400px] xl:max-w-[520px]  ">
                            <Image
                                src="/section2.jpg"
                                alt="Image"
                                layout="responsive"
                                objectFit="contain"
                                width={400}  // Specify a width
                                height={400} // Specify a height
                                className="w-full h-auto"
                            />
                        </div>

                        {/* Text Column */}
                        <div className="text flex justify-center md:mx-4 py-10  md:py-0 p-6 mx-auto overflow-hidden ">
                            <div className="text-center ">

                                <h2 className="
             font-[500] text-[13px] md:text-[17px] lowercase leading-[35px] text-[#333] 
         block tracking-widest 
             border-b border-[#ece1d3] pb-3 mb-[15px] mx-auto 
              
              antialiased
                ">
                                    Get ready to love your bag
                                </h2>

                                <p className="text-black font-normal text-[14px] lowercase mb-5 leading-[1.8rem]">
                                    13 years of designing and directing handbags at Marc Jacobs gave me deep insight into what it takes to craft a better everyday bag. Style is only part of the equation — it should also be designed for real life. I created Shortylove bags to be softer, smarter, more organized. Loveworthy.
                                </p>
                                <p className="text-black font-normal text-[14px] lowercase mb-5 leading-[1.8rem]"> — sloane gibney grossberg</p>

                            </div>

                        </div>
                    </div>
                </div>

            </div>


            
        </>

    )
}
