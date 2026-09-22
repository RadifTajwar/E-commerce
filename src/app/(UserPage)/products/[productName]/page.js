"use client";
import ProductGallery, {
  ProductGallerySkeleton,
} from "@/components/storefront/product/ProductGallery";
import ProductInfoPanel from "@/components/storefront/product/ProductInfoPanel";
import ProductReviews from "@/components/storefront/product/ProductReviews";
import Cart from "@/components/ui/components/cart";
import "@/components/ui/components/shop/scrollbar.css";
import { fetchProductBySlug } from "@/store/slices/product.slice";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function ProductDetailPage() {
  const { productName } = useParams();
  const dispatch = useDispatch();

  const { productData, isLoading } = useSelector((state) => state.productBySlug);

  useEffect(() => {
    if (productName) {
      dispatch(fetchProductBySlug(productName));
    }
  }, [productName, dispatch]);

  return (
    <>
      <div className="productIdCart my-2">
        <div className="upper_part max-w-7xl mx-auto px-4">
          <div className="flex w-full space-x-4">
            {isLoading && <ProductGallerySkeleton />}
            {!isLoading && productData && <ProductGallery product={productData} />}

            <ProductInfoPanel
              product={productData}
              isLoading={isLoading}
              className=" three hidden md:block md:w-1/2 lg:w-2/6   border border-px shadow ms-5"
            />
          </div>
          <ProductInfoPanel
            product={productData}
            isLoading={isLoading}
            className=" three w-full  md:hidden border border-px shadow "
          />
        </div>
      </div>
      {productData && (
        <div className="description_&_review_sectionmy-2">
          <div className="upper_part max-w-7xl mx-auto px-4">
            <ProductReviews productId={productData.id} />
          </div>
        </div>
      )}

      <div className=" text flex justify-center  max-w-xl xl:max-w-7xl container mx-auto mt-10">
        <div className="text text-center">
          <h1 className="text-2xl md:text-4xl font-bold ">
            <span className="text-[#E8A811]">RELATED</span> PRODUCTS
          </h1>
          <p className=" text-md  decoration-gray-800 hover:opacity-60 transition-opacity duration-300 cursor-pointer my-3">
            BAGS
          </p>
        </div>
      </div>
      {productData && <Cart productName={productData.name} />}
    </>
  );
}
