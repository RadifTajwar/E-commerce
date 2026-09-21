"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { fetchAllProducts } from "@/redux/product/allProductsSlice";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Ccard from "./shop/card";
export default function cart({ productName }) {
  const Router = useRouter();
  const dispatch = useDispatch();
  const { products, isLoading, error } = useSelector(
    (state) => state.allProducts
  );

  const [productResult, setProductResult] = useState([]);
  const isSamllScreen =
    typeof window !== "undefined" && window.innerWidth >= 640;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let res;
        if (productName) {
          res = await dispatch(
            fetchAllProducts({ searchTerm: productName })
          ).unwrap();
          setProductResult(res.products);
        } else {
          res = await dispatch(fetchAllProducts()).unwrap();
          setProductResult(res.products);
        }
      } catch (error) {}
    };

    fetchProducts();
  }, [dispatch, productName]);

  return (
    <>
      <div className="flex justify-center max-w-7xl mx-auto md:px-20">
        <div className="flex container flex-col items-center justify-center md:pb-10 p-0">
          {/* Carousel */}

          {error && <p>{error}</p>}

          {productResult?.length !== 0 && (
            <>
              <Carousel
                className={`h-auto my-5 flex justify-center w-1/2 ${
                  productResult?.length == 1
                    ? "xl:w-4/12 lg:w-4/12 md:w-6/12 sm:w-1/2"
                    : ""
                } ${
                  productResult?.length == 2
                    ? "xl:w-1/2 md:w-7/12 sm:w-3/4"
                    : ""
                }  ${
                  productResult?.length == 3
                    ? "xl:w-9/12 md:w-10/12 sm:w-3/4"
                    : ""
                } ${
                  productResult?.length > 3
                    ? "xl:w-full md:w-11/12 sm:w-3/4"
                    : ""
                } `}
                opts={{
                  slidesToShow: isSamllScreen ? 2 : 4,
                  slidesToScroll: isSamllScreen ? 2 : 1,
                }}
              >
                <CarouselContent className="flex-none ml-0 w-full">
                  {productResult?.map((product, index) => (
                    <CarouselItem
                      key={index}
                      className={`pl-0 sm:pl-3 basis-full  ${
                        productResult?.length == 1
                          ? "xl:basis-full md:basis-full sm:basis-full"
                          : ""
                      } ${
                        products.length == 2
                          ? "xl:basis-2/4 md:basis-2/4 sm:basis-1/2"
                          : ""
                      }  ${
                        productResult?.length == 3
                          ? "xl:basis-1/3 md:basis-1/3 sm:basis-1/2"
                          : ""
                      } ${
                        productResult?.length > 3
                          ? "xl:basis-1/4 md:basis-1/3 sm:basis-1/2"
                          : ""
                      }  flex-shrink-0 justify-center`}
                    >
                      <Ccard product={product} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </>
          )}
        </div>
      </div>
    </>
  );
}
