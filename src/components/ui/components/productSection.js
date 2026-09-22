"use client";
import { fetchAllParentCategories } from "@/store/slices/parent-category.slice";
import Image from "next/image";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

/**
 * @param {{ initialParentCategories?: import("@/types").ParentCategory[] }} props
 */
export default function ProductSection({ initialParentCategories }) {
  const dispatch = useDispatch();

  const {
    parentCategories: storeParentCategories,
    isLoading: storeLoading,
    error,
  } = useSelector((state) => state.allParentCategories);

  const parentCategories = initialParentCategories ?? storeParentCategories;
  const isLoading = initialParentCategories ? false : storeLoading;

  // Fetch categories on mount unless the server already provided them.
  useEffect(() => {
    if (initialParentCategories) return;
    dispatch(fetchAllParentCategories());
  }, [dispatch, initialParentCategories]);

  return (
    <>
      <div className="our_product flex justify-center m-5   mx-auto max-w-6xl">
        <div className="product">
          <div className="text_section text-center mb-10">
            <h1 className="text-4xl font-bold mb-5">
              <span style={{ color: "#E8A811" }}>ALL</span> PRODUCTS
            </h1>
            <a
              href="#"
              className=" text-md  decoration-gray-800 hover:opacity-60 transition-opacity duration-300 cursor-pointer"
            >
              what&apos;s on the minds and in the carts of leather for luxury today?
              here&apos;s what we offer.
            </a>
          </div>

          {/* {isLoading && <p>Loading categories...</p>} */}
          {error && <p>Error: {error}</p>}
          {!isLoading && (
            <>
              <div className="image grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 lg:gap-x-8 xl:gap-x-12 xl:gap-y-12 mx-auto max-w-screen-xl px-4">
                {parentCategories.map((category) => (
                  <div
                    key={category.id}
                    id={category.id}
                    className="images flex justify-center"
                  >
                    <div className="image_1 cursor-pointer">
                      <div className="inner_imag h-[180px] w-[180px] lg:w-[220px] lg:h-[220px] xl:w-[250px] xl:h-[250px] rounded-lg relative group overflow-hidden">
                        {category.image && (
                          <Image
                            src={category.image}
                            alt={category.name}
                            height={400}
                            width={400}
                            className="rounded-lg group-hover:scale-110 duration-500"
                          />
                        )}
                      </div>
                      <div className="lower_txt flex justify-center">
                        <div className="price_text_image text-center m-5">
                          <h1
                            className="hover:opacity-60 transition-opacity duration-300 cursor-pointer"
                            style={{ fontWeight: "400", fontSize: "17px" }}
                          >
                            {category.name}
                          </h1>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
