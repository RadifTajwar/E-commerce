"use client";

import Skeleton from "@mui/material/Skeleton";
import Image from "next/image";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { fetchAllHeroBanners } from "@/store/slices/banner.slice";

/**
 * @param {{ initialBanners?: import("@/types").HeroBanner[] }} props
 *   `initialBanners` comes from the server; when present no fetch is made and
 *   the hero (the page's LCP element) is in the initial HTML.
 */
export function Banner({ initialBanners }) {
  const dispatch = useDispatch();
  const { heroBanners: storeBanners, isLoading: storeLoading, error } = useSelector(
    (state) => state.allHeroBanner,
  );

  const heroBanners = initialBanners ?? storeBanners;
  const isLoading = initialBanners ? false : storeLoading;

  // Fetch banners on mount unless the server already provided them.
  useEffect(() => {
    if (initialBanners) return;
    dispatch(fetchAllHeroBanners());
  }, [dispatch, initialBanners]);

  // The carousel shows everything from index 2 on; the field may be missing.
  const bannerImages = useMemo(() => {
    const images = heroBanners?.[0]?.image;
    return Array.isArray(images) ? images.slice(2) : [];
  }, [heroBanners]);

  return (
    <>
      {error && <p className="text-red-500">Error: {error}</p>}

      {isLoading ? (
        // Skeleton loader when fetching data
        <div className="inner_image w-full">
          <Carousel className="w-full">
            <CarouselContent>
              {[1, 2, 3].map((placeholder) => (
                <CarouselItem key={placeholder}>
                  <div className="p-0">
                    <Card className="rounded-none border-none">
                      <CardContent className="flex items-center justify-center p-0">
                        <div className="inner w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]">
                          <Skeleton variant="rectangular" width="100%" height="100%" className="" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      ) : (
        bannerImages.length > 0 && (
          <div className="inner_image w-full">
            <Carousel className="w-full">
              <CarouselContent>
                {bannerImages.map((image, index) => (
                  <CarouselItem key={image}>
                    <div className="p-0">
                      <Card className="rounded-none border-none">
                        <CardContent className="flex items-center justify-center p-0">
                          <div className="inner w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] relative">
                            <Image
                              src={image}
                              alt={`carousel image ${index}`}
                              fill
                              sizes="100vw"
                              priority={index === 0}
                              className="object-cover"
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
        )
      )}
    </>
  );
}
