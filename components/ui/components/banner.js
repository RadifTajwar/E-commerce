"use client";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { fetchAllHeroBanners } from "@/redux/heroBanner/allHeroBannerSlice";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export function Banner() {
  const dispatch = useDispatch();
  const { heroBanners, isLoading, error } = useSelector((state) => state.allHeroBanner);
  const [videoFetched, setVideoFetched] = useState(false);
  const [bannerImages, setBannerImages] = useState([]); // State to store sliced images

  // Fetch products on component mount
  useEffect(() => {
    if (!videoFetched) {
      dispatch(fetchAllHeroBanners());
      setVideoFetched(true); // Mark products as fetched
    }
  }, [videoFetched, dispatch]);

  // Once heroBanners data is fetched, slice images from index 2
  useEffect(() => {
    if (heroBanners.length > 0) {
      const images = heroBanners[0]?.image?.slice(2);
      console.log(images, "is the images radif"); // Get images from index 2
      setBannerImages(images); // Set sliced images to the state
    }
  }, [heroBanners]);

  console.log(bannerImages, "is the bannerImages radif");

  return (
    <>
      {isLoading && <p>Loading Banner Image...</p>}
      {error && <p>Error: {error}</p>}
      {!isLoading && bannerImages.length > 0 && (
        <div className="inner_image w-full">
          <Carousel className="w-full">
            <CarouselContent>
              {bannerImages.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="p-0">
                    <Card className="rounded-none border-none">
                      <CardContent className="flex items-center justify-center p-0">
                        <div className="inner w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] relative">
                          <Image
                            src={image}
                            alt={`carousel image ${index}`}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-lg"
                          />
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
      )}
    </>
  );
}
