'use client'
import ImageEffect from "@/components/imageEffect";
import { Card, CardContent } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious
} from "@/components/ui/carousel";
import '@/components/ui/components/shop/scrollbar.css';
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useCallback, useEffect, useState } from 'react';
import './style.css';

export default function mishat() {


    const isSamllScreen = window.innerWidth >= 576;
    const isLargeScreen = window.innerWidth >= 1024;
    const images = [
        "/11.jpg",
        "/12.jpg",
        "/13.jpg",
        "/14.jpg",
        "/15.jpg"
    ];

    const [currentIndex, setCurrentIndex] = useState(0)
    const [mainApi, setMainApi] = useState(null)
    const [thumbnailApi, setThumbnailApi] = useState(null)

    const syncCarousels = useCallback((api, targetIndex) => {
        if (api && typeof api.scrollTo === 'function') {
            api.scrollTo(targetIndex)
            console.log("inside", targetIndex);
        }
        console.log("outside", targetIndex);
    }, [])

    useEffect(() => {
        if (mainApi) syncCarousels(mainApi, currentIndex)
        if (thumbnailApi) syncCarousels(thumbnailApi, currentIndex)
    }, [currentIndex, mainApi, thumbnailApi, syncCarousels])

    const handleThumbnailClick = (index) => {
        setCurrentIndex(index)
    }
    return (
        <>
            <div className="upper_part max-w-7xl mx-auto px-4">
                <div className="flex w-full space-x-4">
                    <div className="one&two w-full md:w-1/2 lg:w-4/6  lg:me-5">

                        <div className="two w-full lg:w-3/4 mx-auto">
                            <div className="inner_image w-full">
                                <Carousel
                                    className="w-full"
                                    setApi={setMainApi}
                                    onSelect={setCurrentIndex}
                                >
                                    <CarouselContent>
                                        {images.map((image, index) => (
                                            <CarouselItem key={index}>
                                                <div className="p-0">
                                                    <Card className="rounded-none border-none">
                                                        <CardContent className="flex items-center justify-center p-0">
                                                            <div className="inner w-full">
                                                                <ImageEffect src={image} />
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                </div>
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                    <CarouselPrevious className="left-0" onClick={() => handleThumbnailClick(currentIndex - 1)} />
                                    <CarouselNext className="right-0" onClick={() => handleThumbnailClick(currentIndex + 1)} />
                                </Carousel>
                            </div>
                        </div>
                        <div className="one w-full  my-3 ">

                            <Carousel
                                className="w-full"
                                opts={{
                                    slidesPerView: 3,
                                    slidesToScroll: isSamllScreen ? 2 : 1,
                                }}
                                setApi={setThumbnailApi}
                            >
                                <CarouselContent className="-ml-1">
                                    {images.map((image, index) => (
                                        <CarouselItem key={index} className="pl-1 basis-1/3 sm:basis-1/4 ">
                                            <div className="p-0">
                                                <div className="border-none rounded-none">
                                                    <div className="flex items-center justify-center p-0">
                                                        <div className="w-full h-full">
                                                            <button onClick={() => handleThumbnailClick(index)} className={cn("border-b", currentIndex === index ? "border-red-500" : "border-transparent")}  >
                                                                <Image
                                                                    src={image}
                                                                    height={117}
                                                                    width={117}
                                                                    objectFit="contain"
                                                                    className="w-[177px] h-auto md:h-auto md:w-[115px]"
                                                                />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <CarouselPrevious className="left-0" />
                                <CarouselNext className="right-0" />
                            </Carousel>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
