"use client";

import { Skeleton } from "@mui/material";
import { useState } from "react";
import { notify } from "@/lib/toast";
import { useAppDispatch } from "@/store/hooks";
import { addItemToCart } from "@/store/slices/cart.slice";
import type { Product, ProductColorSummary } from "@/types/product";

/**
 * Title, prices, colour picker, quantity stepper, add-to-cart and the product
 * detail rows. Rendered twice (desktop column and mobile block) with a
 * different wrapper class; it used to be a second, hardcoded copy on mobile.
 */

/**
 * Stock for one colour. The admin form writes a single quantity input into both
 * `color[].availableQuantity` and `additionalDetails[].quantity`, so a
 * disagreement means one of them is stale data from the older admin UI — take
 * the higher value rather than blocking a sale on a rotten field.
 * ponytail: the real fix is a one-off data cleanup so the two agree.
 */
export function resolveStock(product: Product | null, color: ProductColorSummary): number | undefined {
  const fromColor = color.availableQuantity;
  const fromDetails = product?.additionalDetails?.find((d) => d.color === color.colorName)?.quantity;
  const known = [fromColor, fromDetails].map(Number).filter((n) => Number.isFinite(n));
  return known.length ? Math.max(...known) : undefined;
}

interface ProductInfoPanelProps {
  product: Product | null;
  isLoading: boolean;
  /** Wrapper classes that decide at which breakpoint this copy is visible. */
  className: string;
}

export default function ProductInfoPanel({ product, isLoading, className }: ProductInfoPanelProps) {
  const dispatch = useAppDispatch();

  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [colorId, setColorId] = useState<string | null>(null);
  const [availableQuantity, setAvailableQuantity] = useState<number | undefined>(undefined);
  const [outOfStock, setOutOfStock] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleIncrease = () => {
    // Never exceed the stock of the selected colour.
    setQuantity((previous) =>
      availableQuantity !== undefined ? Math.min(previous + 1, Math.max(availableQuantity, 1)) : previous + 1,
    );
  };

  const handleDecrease = () => {
    setQuantity((previous) => (previous > 1 ? previous - 1 : 1));
  };

  const handleColorClick = (color: ProductColorSummary) => {
    const stock = resolveStock(product, color);
    setAvailableQuantity(stock);
    if (stock === 0) {
      setOutOfStock(true);
    } else {
      setOutOfStock(false);
      if (stock !== undefined) setQuantity((q) => Math.min(q, Math.max(stock, 1)));
    }
    setSelectedColor(color.colorName ?? null);
    setColorId(color.id ?? null);
  };

  const handleClearClicked = () => {
    setOutOfStock(false);
    setSelectedColor(null);
  };

  const handleAddToCart = () => {
    if (!selectedColor || !colorId || !product) {
      notify.error("Please select a color before adding to cart!");
      return;
    }
    dispatch(
      addItemToCart({
        id: product.id,
        name: product.name ?? "",
        price: Number(product.discountedPrice ?? 0),
        image: product.imageDefault ?? "",
        quantity,
        availableQuantity,
        colorId,
        color: selectedColor,
      }),
    );
  };

  const disabled = !product?.inStock || outOfStock;

  return (
    <div className={className}>
      <div className="inner px-10 py-12 w-full h-full ">
        <div className="txt space-y-2 mb-4">
          <h1 className="text-3xl font-normal text-center text-gray-800">{product?.name}</h1>
          <p className="text-center">
            <span style={{ textDecoration: "line-through", color: "#a9a9a9" }} className="text-lg">
              ${product?.originalPrice}
            </span>
            <span className="text-xl text-gray-700 font-medium" style={{ marginLeft: "8px" }}>
              ${product?.discountedPrice}
            </span>
          </p>
        </div>

        <div className="color_section items-center justify-center relative">
          <p className="text-center text-gray-800 text-lg font-semibold">Color :</p>
          <div className="rangeBar h-auto flex flex-wrap items-center space-x-2 justify-center mb-2">
            {/* Render color options */}
            {!isLoading &&
              product?.color?.map((color) => (
                <div
                  key={color.id ?? color.colorName}
                  className="relative group cursor-pointer flex items-center justify-center"
                >
                  <div
                    className="color_palette rounded-3xl transition-colors flex items-center justify-center mb-1 min-w-[62px] min-h-[62px]"
                    style={{ backgroundColor: color.hex }}
                    onClick={() => handleColorClick(color)}
                  >
                    {/* Color square */}
                  </div>

                  {/* Bottom line that will appear on hover */}
                  <div
                    className={`absolute bottom-0 left-0 w-full h-[2px] bg-black opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full ${
                      selectedColor === color.colorName && `opacity-100 `
                    }`}
                  />
                </div>
              ))}

            {isLoading &&
              Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="relative group flex items-center justify-center">
                  {/* Circle for color */}
                  <Skeleton variant="circular" width={62} height={62} animation="wave" className="mb-1" />
                  {/* Bottom line skeleton */}
                </div>
              ))}

            {/* Clear button positioned to the right */}
            <div className={`text-center clear_button ms-2 ${selectedColor ? "block" : "hidden"}`}>
              <button
                className="text-gray-500 hover:text-gray-900 font-regular text-sm"
                onClick={handleClearClicked}
              >
                x clear
              </button>
            </div>
          </div>
        </div>

        <div className="OutOfStock Text">
          {outOfStock && <p className="text-center text-red-800 text-xl font-semibold">Out of Stock</p>}
        </div>

        <div className="quantity_section flex justify-center">
          <div className="inner flex my-4">
            {/* Minus Button */}
            <button
              onClick={handleDecrease}
              className="border border-2 px-3 py-3 hover:bg-gray-800 hover:text-white transition hover:border-black"
            >
              -
            </button>

            {/* Quantity Display */}
            <span className="px-3 py-3 border-t-2 border-b-2">{quantity}</span>

            {/* Plus Button */}
            <button
              onClick={handleIncrease}
              className="border border-2 px-3 py-3 hover:bg-gray-800 hover:text-white transition hover:border-black"
            >
              +
            </button>
          </div>
        </div>

        <div className="Add_to_cart&Buy_now space-y-2">
          {/* Add to Cart Button */}
          <div className="buttons_ADD_TO_CART bg-black text-white text-center ">
            <button
              className={`text-center w-full py-3 text-sm font-medium ${disabled ? "cursor-not-allowed" : ""}`}
              onClick={handleAddToCart}
              disabled={disabled}
            >
              ADD TO CART
            </button>
          </div>

          {/* Buy Now Button */}
          <div className="buttons_BUY_NOW bg-black text-white text-center ">
            <button
              className={`text-center w-full py-3 text-sm font-medium ${disabled ? "cursor-not-allowed" : ""}`}
              disabled={disabled}
            >
              BUY NOW
            </button>
          </div>
        </div>

        <div className="product_detail my-6">
          <div className="w-full flex justify-between items-center py-4">
            <div className="detail_type">
              <p className="text-sm text-gray-900 font-normal">Leather Type</p>
            </div>
            <div className="detail_type">
              <p className="text-sm text-gray-500 font-normal">Leather Type</p>
            </div>
          </div>
          <div className="line w-full border-t border-gray-300 "></div>

          <div className="w-full flex justify-between items-center py-4">
            <div className="detail_type">
              <p className="text-sm text-gray-900 font-normal">Leather Hide</p>
            </div>
            <div className="detail_type">
              <p className="text-sm text-gray-500 font-normal">Cow</p>
            </div>
          </div>
          <div className="line w-full border-t border-gray-300 "></div>

          <div className="w-full flex justify-between items-center py-4">
            <div className="detail_type">
              <p className="text-sm text-gray-900 font-normal">Size </p>
            </div>
            <div className="detail_type">
              <p className="text-sm text-gray-500 font-normal">Length-12.8 Inch</p>
              <p className="text-sm text-gray-500 font-normal">Height- 10 Inch</p>
              <p className="text-sm text-gray-500 font-normal">Depth- 1.1 Inch</p>
            </div>
          </div>
          <div className="line w-full border-t border-gray-300 "></div>

          <div className="w-full flex justify-between items-center py-4">
            <div className="detail_type">
              <p className="text-sm text-gray-900 font-normal">Warranty </p>
            </div>
            <div className="detail_type">
              <p className="text-sm text-gray-500 font-normal">{product?.productDetails?.warranty}</p>
            </div>
          </div>
          <div className="line w-full border-t border-gray-300 "></div>

          <div className="w-full flex justify-between items-center py-4">
            <div className="detail_type">
              <p className="text-sm text-gray-900 font-normal">Color</p>
            </div>
            <div className="detail_type">
              {/* Map through colors and display their names */}
              <p className="text-sm text-gray-500 font-normal">
                {product?.color?.map((color, index) => (
                  <span key={color.id ?? color.colorName}>
                    {color.colorName}
                    {index < (product?.color?.length ?? 0) - 1 && ", "}
                  </span>
                ))}
              </p>
            </div>
          </div>
        </div>

        <div className="product_caption w-full ">
          <p className="text-sm text-gray-500 font-normal text-center">
            Your everyday job will be easier if you keep all of your paperwork, file, documents, tabs up to 10 inches,
            checkbooks, certificates, business cards, and pencils in an A4 file bag. Cowhide is used to create the bag,
            which has a long lifespan.
          </p>
        </div>
      </div>
    </div>
  );
}
