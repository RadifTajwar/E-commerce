"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Card, CardContent } from "@/components/ui/card";
import { notify } from "@/lib/toast";
import { discountPercent } from "@/lib/utils";
import { productService } from "@/services/product.service";
import { addItemToCart } from "@/store/slices/cart.slice";
import CartIcon from "../../icon/icon";
import SearchIcon from "../../icon/searchIcon";

/** The two stacked images. The swap is a CSS animation, so no timer per card. */
function CardImages({ product, onOpen }) {
  const hoverImage = product?.imageHover || product?.imageDefault;

  return (
    <>
      {/* Default Image */}
      <div className="image relative lg:hidden" onClick={onOpen}>
        {/* First image fades out and back in; the second sits behind it. */}
        <Image
          alt={product.name}
          src={product.imageDefault}
          height={500}
          width={500}
          className="relative z-10 animate-fadeInOut"
        />

        {/* Second Image */}
        <Image
          alt={product.name}
          src={hoverImage}
          height={500}
          width={500}
          className="absolute top-0 left-0 h-auto"
        />
      </div>

      <div className="hidden lg:block image" onClick={onOpen}>
        <Image
          alt={product.name}
          src={product.imageDefault}
          height={500}
          width={500}
          className=" group-hover:opacity-0 duration-500"
        />

        {/* Hover Image */}
        <Image
          alt={product.name}
          src={hoverImage}
          height={500}
          width={500}
          className="absolute top-0 left-0  h-auto opacity-0 group-hover:opacity-100 group-hover:duration-1000 group-hover:scale-110"
        />
      </div>
    </>
  );
}

/** Discount percentage and the "Sold Out" pill. */
function CardBadges({ product }) {
  return (
    <div className="absolute top-2 left-2 ">
      <div className="flex items-center justify-center">
        <div className="bg-gray-700 rounded-full py-2 px-4 flex flex-col items-center justify-center text-center h-12 w-12">
          {/* Calculate discount percentage */}
          <p className="m-0 p-0 text-sm font-medium text-white leading-none">
            {`${discountPercent(product?.originalPrice, product?.discountedPrice)}%`}
          </p>
        </div>
      </div>
      {!product?.inStock && (
        <>
          <div className="flex items-center justify-center mt-2">
            <div className="bg-white rounded-full py-2 px-4 flex flex-col items-center justify-center text-center border border-gray-50   h-12 w-12">
              <p className="m-0 p-0 text-sm font-medium text-black leading-none">Sold</p>
              <p className="m-0 p-0 text-sm font-medium text-black leading-none">Out</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/** Name and prices under the image. */
function CardPriceFooter({ product }) {
  return (
    <div className="lower_txt flex justify-start ">
      <div className="price_text_image text-start  px-5 py-4">
        <Link href={`/products/${product?.slug}`}>
          <h1
            className="hover:opacity-60 transition-opacity duration-300 cursor-pointer"
            style={{ fontWeight: "400", fontSize: "14px" }}
          >
            {product.name}
          </h1>
        </Link>

        <p>
          <span className="text-xs" style={{ textDecoration: "line-through", color: "#a9a9a9" }}>
            ৳ {product.originalPrice}
          </span>
          <span className="text-sm font-semibold" style={{ color: "#424242", marginLeft: "8px" }}>
            ৳ {product.discountedPrice}
          </span>
        </p>
      </div>
    </div>
  );
}

export default function ProductCard({ product }) {
  const router = useRouter();
  const dispatch = useDispatch();

  // Product details are fetched per card, so one card can never flip another.
  const [details, setDetails] = useState(null);
  const [isLoadingCart, setIsLoadingCart] = useState(false);
  const [showCartClicked, setShowCartClicked] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const [unavailableColors, setUnavailableColors] = useState(false);
  const [colorId, setColorId] = useState(null);
  const [availableQuantity, setAvailableQuantity] = useState(undefined);

  const handleAddToCart = () => {
    if (!selectedColor || unavailableColors) {
      notify.error("Please select a color before adding to cart!");
      return;
    }
    dispatch(
      addItemToCart({
        id: product?.id,
        name: product?.name,
        price: product?.discountedPrice,
        image: product?.imageDefault,
        availableQuantity,
        colorId,
        color: selectedColor,
      })
    );
  };

  const handleColorClick = (colorName, id, colorQuantity) => {
    setAvailableQuantity(
      colorQuantity === undefined || colorQuantity === null ? undefined : Number(colorQuantity)
    );
    setUnavailableColors(Number(colorQuantity) === 0);
    setSelectedColor(colorName);
    setColorId(id);
  };

  const handleProductClick = () => {
    router.push(`/products/${product.slug}`);
  };

  const handleCardCloseClicked = () => {
    setShowCartClicked(false);
    setSelectedColor(null);
  };

  const handleCartOpenClicked = async () => {
    if (!product?.inStock) {
      handleProductClick();
      return;
    }
    setIsLoadingCart(true);
    try {
      const data = await productService.getById(product.id);
      setDetails(data);
      setShowCartClicked(true);
    } catch {
      notify.error("Could not load this product. Please try again.");
    } finally {
      setIsLoadingCart(false);
    }
  };

  const handleClearClicked = () => {
    setSelectedColor(null);
  };

  return (
    <>
      <div className=" card ">
        <div className="text-center flex justify-center ">
          <div className="total_card_&_text w-full max-w-[364px] md:max-w-[318px] lg:max-w-[287px] h-auto border border-gray-100 shadow-sm shadow-gray-300">
            <Card className="border-0 shadow-none max-w-[364px] md:max-w-[318px] lg:max-w-[287px]  h-auto rounded-none object-contain">
              <CardContent className="flex items-center justify-center p-0">
                <div className="image_3 cursor-pointer">
                  <div
                    className={`inner_imag h-auto w-full relative ${
                      showCartClicked ? `` : `group`
                    }  overflow-hidden`}
                  >
                    <CardImages product={product} onOpen={handleProductClick} />

                    <CardBadges product={product} />

                    {/* Icon Pop-Up Div */}

                    <div className="absolute right-0 top-0 lg:-right-2 lg:mt-2 w-auto bg-white opacity-100 lg:opacity-0 lg:group-hover:opacity-100 lg:group-hover:-translate-x-1/3 transition-all duration-300 ease-out h-auto transform hidden lg:block md:block lg:border-t border-b border-l border-gray-100">
                      <div className="flex flex-col items-center gap-2">
                        {/* Outer group */}
                        <div className="flex group/inner items-center justify-center w-12 h-11">
                          {/* Inner group */}
                          <div className="relative transition-transform duration-300">
                            {/* Search Icon */}
                            <SearchIcon />
                          </div>
                        </div>

                        {/* Cart Icon (with hover effect on outer group) */}
                        <div
                          className="text-gray-600 hover:text-gray-700 transition-colors duration-200 w-12 h-11 justify-center items-center flex"
                          onClick={handleCartOpenClicked}
                        >
                          <CartIcon />
                        </div>
                      </div>
                    </div>

                    {/* "VIEW ALL" button */}

                    {isLoadingCart && (
                      <div
                        className="absolute text-center bottom-0 left-0 right-0 top-0 transform translate-y-0 opacity-100
                transition-all duration-500 hover:text-black lg:block w-full h-full bg-white bg-opacity-60 "
                      >
                        <div className="flex justify-center items-center h-full">
                          <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      </div>
                    )}

                    <div
                      className={`absolute text-center bottom-0 transform ${
                        showCartClicked ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
                      } transition-all duration-500 hover:text-black lg:block w-full h-full bg-white bg-opacity-90 flex flex-col justify-end`}
                    >
                      {/* Close Button */}
                      <button
                        className="absolute top-2 right-2 px-2 flex group/inner items-center justify-center transition duration-200 hover:text-gray-500"
                        onClick={handleCardCloseClicked}
                      >
                        ✕{" "}
                        <span className="ms-1 text-black group-hover/inner:text-gray-500 font-semibold text-sm transition duration-200">
                          Close
                        </span>
                      </button>

                      {details && showCartClicked && (
                        <div className="w-full h-full flex flex-col justify-between">
                          <div className="flex-grow flex items-center justify-center">
                            {/* Color Bar in the Middle */}
                            <div className="Inner w-11/12">
                              <div className="color_text text-sm font-semibold text-gray-900 text-center">
                                Color:
                              </div>
                              <div className="color_map justify-center flex flex-wrap gap-2 my-2">
                                {details.color?.map((color) => (
                                  <div
                                    key={color?.id ?? color?.colorName}
                                    className="relative group cursor-pointer flex items-center justify-center flex-shrink-0"
                                  >
                                    <div
                                      className={`color_palette rounded-3xl transition-colors flex items-center justify-center mb-1 w-[62px] h-[62px]`}
                                      style={{ backgroundColor: color.hex }}
                                      onClick={() =>
                                        handleColorClick(
                                          color.colorName,
                                          color.id,
                                          color.availableQuantity
                                        )
                                      }
                                    >
                                      {/* Color square */}
                                    </div>

                                    {/* Bottom line that will appear on hover */}
                                    <div
                                      className={`absolute bottom-0 left-0 w-full h-[2px] bg-black opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full ${
                                        selectedColor === color.colorName && `opacity-100`
                                      }`}
                                    />
                                  </div>
                                ))}
                              </div>
                              <div
                                className={`clear text-xs text-gray-500 mt-2 cursor-pointer hover:text-gray-900 transition-all duration-500 text-center block ${
                                  selectedColor ? "opacity-100 visible" : "opacity-0 invisible"
                                } `}
                                onClick={handleClearClicked}
                              >
                                ✕ Clear
                              </div>
                            </div>
                          </div>
                          {unavailableColors && (
                            <div className="text-center text-red-500 text-sm font-semibold mt-2 mb-4">
                              Out of stock
                            </div>
                          )}
                          {/* Add To Cart Button */}
                          <button
                            className="w-full text-white py-2 hover:bg-opacity-100 transition duration-100 bg-black"
                            onClick={handleAddToCart}
                          >
                            Add To Cart
                          </button>

                          {/* Out of stock message at the bottom */}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <CardPriceFooter product={product} />
          </div>
        </div>
      </div>
    </>
  );
}
