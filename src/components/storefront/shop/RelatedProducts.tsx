"use client";

import { useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ProductCard from "@/components/ui/components/shop/card";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAllProducts } from "@/store/slices/product.slice";

/**
 * The "trending / related products" carousel (formerly `components/cart.js`,
 * which had nothing to do with the shopping cart).
 *
 * Note: the old `opts={{ slidesToShow, slidesToScroll }}` were not embla
 * options (embla sizes slides with CSS basis classes), so they are gone
 * together with the render-time `window.innerWidth` read that fed them.
 */
export interface RelatedProductsProps {
  /** Optional search term; without it the carousel shows the default listing. */
  productName?: string;
}

/** Width classes are picked from how many products came back. */
function carouselWidth(count: number): string {
  if (count === 1) return "xl:w-4/12 lg:w-4/12 md:w-6/12 sm:w-1/2";
  if (count === 2) return "xl:w-1/2 md:w-7/12 sm:w-3/4";
  if (count === 3) return "xl:w-9/12 md:w-10/12 sm:w-3/4";
  if (count > 3) return "xl:w-full md:w-11/12 sm:w-3/4";
  return "";
}

function itemWidth(count: number): string {
  if (count === 1) return "xl:basis-full md:basis-full sm:basis-full";
  if (count === 2) return "xl:basis-2/4 md:basis-2/4 sm:basis-1/2";
  if (count === 3) return "xl:basis-1/3 md:basis-1/3 sm:basis-1/2";
  if (count > 3) return "xl:basis-1/4 md:basis-1/3 sm:basis-1/2";
  return "";
}

export default function RelatedProducts({ productName }: RelatedProductsProps) {
  const dispatch = useAppDispatch();
  // The slice is the single source of truth: no duplicate local copy.
  const { products, error } = useAppSelector((state) => state.allProducts);

  useEffect(() => {
    void dispatch(fetchAllProducts(productName ? { searchTerm: productName } : undefined));
  }, [dispatch, productName]);

  const count = products?.length ?? 0;

  return (
    <>
      <div className="flex justify-center max-w-7xl mx-auto md:px-20">
        <div className="flex container flex-col items-center justify-center md:pb-10 p-0">
          {/* Carousel */}

          {error && <p>{error}</p>}

          {count !== 0 && (
            <Carousel
              className={`h-auto my-5 flex justify-center w-1/2 ${carouselWidth(count)} `}
            >
              <CarouselContent className="flex-none ml-0 w-full">
                {products.map((product) => (
                  <CarouselItem
                    key={product.id}
                    className={`pl-0 sm:pl-3 basis-full  ${itemWidth(count)}  flex-shrink-0 justify-center`}
                  >
                    <ProductCard product={product} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          )}
        </div>
      </div>
    </>
  );
}
