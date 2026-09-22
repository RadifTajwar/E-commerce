"use client";

import { Skeleton } from "@mui/material";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import ImageEffect from "@/components/imageEffect";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn, discountPercent } from "@/lib/utils";
import type { Product } from "@/types/product";

/**
 * Thumbnails (vertical on xl, horizontal below) plus the zoomable main image.
 */

type EmblaApi = { scrollTo: (index: number) => void } | null;

/** Viewport width read from a media query instead of during render. */
function useMinWidth(minWidth: number): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(`(min-width: ${minWidth}px)`);
    const update = () => setMatches(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, [minWidth]);

  return matches;
}

/** Default, hover and per-colour images, in order, without duplicates. */
export function galleryImages(product: Product | null | undefined): string[] {
  if (!product) return [];
  const list: string[] = [];
  if (product.imageDefault) list.push(product.imageDefault);
  if (product.imageHover) list.push(product.imageHover);
  for (const detail of product.additionalDetails ?? []) {
    if (Array.isArray(detail?.images)) list.push(...detail.images);
  }
  return Array.from(new Set(list.filter(Boolean)));
}

export function ProductGallerySkeleton() {
  return (
    <div className="one&two w-full md:w-1/2 lg:w-4/6 lg:flex lg:gap-4 lg:me-5">
      {/* Thumbnails Skeleton (Left Side, Vertical) */}
      <div className="one w-full lg:w-1/4 pe-5 hidden lg:block">
        <div className="carousel w-full max-w-full">
          <div className="carousel-content -mt-1 h-[600px] flex flex-col space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton
                key={index}
                variant="rectangular"
                width="100%"
                height={174}
                className="rounded"
                animation="wave"
              />
            ))}
          </div>
          {/* Navigation buttons */}
          <div className="flex justify-between items-center mt-2">
            <Skeleton variant="rectangular" width="45%" height={32} animation="wave" />
            <Skeleton variant="rectangular" width="45%" height={32} animation="wave" />
          </div>
        </div>
      </div>

      {/* Main Image Skeleton (Right Side) */}
      <div className="two w-full lg:w-3/4 mx-auto mt-4 lg:mt-0">
        <div className="inner_image w-full">
          <Skeleton variant="rectangular" width="100%" height={600} className="rounded" animation="wave" />
        </div>
      </div>

      {/* Horizontal Thumbnails Skeleton (Mobile) */}
      <div className="one w-full lg:hidden my-3">
        <div className="carousel-content flex space-x-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton
              key={index}
              variant="rectangular"
              width="30%" /* Adjusted for responsiveness */
              height={117}
              className="rounded"
              animation="wave"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ProductGallery({ product }: { product: Product }) {
  const images = useMemo(() => galleryImages(product), [product]);

  const isSmallScreen = useMinWidth(768);
  const isLargeScreen = useMinWidth(1280);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [mainApi, setMainApi] = useState<EmblaApi>(null);
  const [thumbnailApi, setThumbnailApi] = useState<EmblaApi>(null);

  const syncCarousels = useCallback((api: EmblaApi, targetIndex: number) => {
    if (api && typeof api.scrollTo === "function") {
      api.scrollTo(targetIndex);
    }
  }, []);

  useEffect(() => {
    if (mainApi) syncCarousels(mainApi, currentIndex);
    if (thumbnailApi) syncCarousels(thumbnailApi, currentIndex);
  }, [currentIndex, mainApi, thumbnailApi, syncCarousels]);

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
  };

  const discount = discountPercent(product?.originalPrice ?? 0, product?.discountedPrice ?? 0);
  const productName = product?.name ?? "";

  return (
    <div className="one&two w-full md:w-1/2 lg:w-4/6 lg:flex lg:me-5">
      <div className="one w-1/4 pe-5 hidden lg:block">
        <Carousel
          opts={{ align: "start" }}
          orientation="vertical"
          className="carousel w-full max-w-full"
          setApi={isLargeScreen ? setThumbnailApi : undefined}
        >
          <CarouselContent className="-mt-1 h-[600px]">
            {images.map((image, index) => (
              <CarouselItem key={image} className="pt-1 basis-1/3">
                <div className="p-1">
                  <Card className="rounded-none border-none">
                    <CardContent className="flex items-center justify-center p-0 overflow-hidden">
                      <button
                        onClick={() => handleThumbnailClick(index)}
                        className={cn(
                          "min-h-[174px] min-w-[190px] border-2 transition-colors",
                          currentIndex === index ? "border-red-500" : "border-transparent",
                        )}
                      >
                        <Image
                          src={image}
                          height={174}
                          width={184}
                          alt={`${productName} thumbnail ${index + 1}`}
                          className="object-cover"
                        />
                      </button>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-between items-center mt-2">
            <CarouselPrevious className="relative left-0 right-0 top-0 bottom-0 w-20 h-8 rounded-none transform-none hover:bg-gray-800 hover:text-white transition hover:border-black" />
            <CarouselNext className="relative left-0 right-0 top-0 bottom-0 w-20 h-8 rounded-none transform-none hover:bg-gray-800 hover:text-white transition hover:border-black" />
          </div>
        </Carousel>
      </div>
      <div className="two w-full lg:w-3/4 mx-auto">
        <div className="inner_image w-full">
          <Carousel className="w-full" setApi={setMainApi}>
            <CarouselContent>
              {images.map((image) => (
                <CarouselItem key={image}>
                  <div className="p-0">
                    <Card className="rounded-none border-none">
                      <CardContent className="flex items-center justify-center p-0">
                        <div className="inner w-full relative">
                          <ImageEffect src={image} alt={productName} />
                          <div className="absolute top-4 right-4 space-y-2">
                            {/* Discount Badge */}
                            <div className="bg-gray-700 rounded-full py-2 px-4 flex flex-col items-center justify-center text-center h-14 w-14">
                              <p className="m-0 p-0 text-sm font-medium text-white leading-none">{discount}%</p>
                            </div>

                            {/* Sold Out Badge */}
                            {!product?.inStock && (
                              <div className="bg-white rounded-full py-2 px-4 flex flex-col items-center justify-center text-center h-14 w-14 border border-gray-50">
                                <p className="m-0 p-0 text-sm font-medium text-black leading-none">Sold</p>
                                <p className="m-0 p-0 text-sm font-medium text-black leading-none">Out</p>
                              </div>
                            )}
                          </div>
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
      <div className="one w-full  lg:hidden my-3 ">
        <Carousel
          className="w-full"
          opts={{ slidesPerView: 3, slidesToScroll: isSmallScreen ? 2 : 1 }}
          setApi={!isLargeScreen ? setThumbnailApi : undefined}
        >
          <CarouselContent className="-ml-1">
            {images.map((image, index) => (
              <CarouselItem key={image} className="pl-1 basis-1/3 sm:basis-1/4 ">
                <div className="p-0">
                  <div className="border-none rounded-none">
                    <div className="flex items-center justify-center p-0">
                      <div className="w-full h-full">
                        <button
                          onClick={() => handleThumbnailClick(index)}
                          className={cn("border-b", currentIndex === index ? "border-red-500" : "border-transparent")}
                        >
                          <Image
                            src={image}
                            alt={`${productName} thumbnail ${index + 1}`}
                            height={117}
                            width={117}
                            className="w-[177px] h-auto md:h-auto md:w-[115px] object-contain"
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
  );
}
