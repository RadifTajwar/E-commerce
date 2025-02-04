import { Card, CardContent } from "@/components/ui/card";
// import { addItemToCart } from "@/redux/cart/cartSlicer";
import { addItemToCart } from "@/redux/cart/cartSlicer";
import { fetchProductById } from "@/redux/product/productByIdSlice";
import CryptoJS from 'crypto-js';
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CartIcon from "../../icon/icon";
import SearchIcon from "../../icon/searchIcon";
export default function card({ product }) {


    const Router = useRouter();
    const dispatch = useDispatch();
    const [productsData, setProductsData] = useState([null]);
    const [showCartClicked, setShowCartClicked] = useState(false);
    const [selectedColor, setSelectedColor] = useState(null);
    const [unavailableColors, setUnavailableColors] = useState(false);
    const [colorId, setColorId] = useState(null);
    const [isLoadingCart, setIsLoadingCart] = useState(false);
    const { productData, isLoading, error } = useSelector(
        (state) => state.productById
    );
    const handleAddToCart = () => {
        if (!selectedColor || unavailableColors) {
            alert("Please select a color before adding to cart!"); // Alert if no color is selected
            console.log("Please select a color before adding to cart!");
        } else {
            // If a color is selected, dispatch the action with color
            dispatch(addItemToCart({
                id: product?.id,
                name: product?.name,
                price: product?.discountedPrice,
                image: product?.imageDefault,

                colorId: colorId, // Send the selected color along with other data
                color: selectedColor, // Send the selected color along with other data
            }));
        }
    };

    const handleColorClick = (colorName, colorId, colorQuantity) => {
        console.log(colorName, colorId, colorQuantity);
        if (colorQuantity == 0) {
            setUnavailableColors(true); // Set the unavailable colors state
            setSelectedColor(colorName); // Update the selected color state
            setColorId(colorId); // Reset the selected color ID state
        }
        else {
            setUnavailableColors(false); // Reset the unavailable colors state
            setSelectedColor(colorName); // Update the selected color state
            setColorId(colorId);
        }
        // Update the selected color ID state
    };


    const handleProductClick = () => {
        // Hash the product ID
        const secretKey = 'Tajwar@00452268'; // Keep this secret and do not expose it
        const hashedId = CryptoJS.AES.encrypt(product.id, secretKey).toString();

        // Use an obfuscated key name
        const obfuscatedKey = 'wc_di';

        // Save the hashed ID to localStorage
        localStorage.setItem(obfuscatedKey, hashedId);

        // Redirect to the product page
        Router.push(`/products/${product.slug}`);
    };
    const handleCardCloseClicked = () => {
        setShowCartClicked(false);
        setSelectedColor(null);
    }
    const [localProductData, setLocalProductData] = useState(null);
    const handleCartOpenClicked = () => {
        if (product?.inStock) {
            setIsLoadingCart(true); // Show loader initially
            dispatch(fetchProductById(product.id)); // Fetch product data
        } else {
            handleProductClick();
        }

    };

    const handleClearClicked = () => {
        setSelectedColor(null);
    };



    useEffect(() => {
        if (productData?.id === product.id) {
            setLocalProductData(productData); // Set local product data
            setIsLoadingCart(false); // Hide loader
            setShowCartClicked(true); // Show cart
        }
    }, [productData, product.id]);

    const [isSecondImageVisible, setIsSecondImageVisible] = useState(false);

    useEffect(() => {
        // Toggle between images every 5 seconds
        const interval = setInterval(() => {
            setIsSecondImageVisible((prev) => !prev);
        }, 5000); // Change image every 5 seconds

        return () => clearInterval(interval); // Clean up interval on unmount
    }, []);
    return (
        <>
            <div className=" card ">
                <div className="text-center flex justify-center " >
                    <div className="total_card_&_text w-full max-w-[364px] md:max-w-[318px] lg:max-w-[287px] h-auto border border-gray-100 shadow-sm shadow-gray-300">
                        <Card className="border-0 shadow-none max-w-[364px] md:max-w-[318px] lg:max-w-[287px]  h-auto rounded-none object-contain">
                            <CardContent className="flex items-center justify-center p-0">
                                <div className="image_3 cursor-pointer">
                                    <div className={`inner_imag h-auto w-full relative ${showCartClicked ? `` : `group`}  overflow-hidden`}>
                                        {/* Default Image */}
                                        <div className="image relative lg:hidden" onClick={handleProductClick}>
                                            {/* First Image (opacity transitions in and out smoothly) */}
                                            <Image
                                                alt={product.name}
                                                src={product.imageDefault}
                                                height={500}
                                                width={500}
                                                className={`transition-opacity ease-in-out duration-[1000ms] ${isSecondImageVisible ? "opacity-0" : "opacity-100"}`}
                                            />

                                            {/* Second Image */}
                                            <Image
                                                alt={product.name}
                                                src={product.imageHover}
                                                height={500}
                                                width={500}
                                                className={`
                                                 absolute top-0 left-0 h-auto 
                                                 transition-all 
                                                 [transition-property:transform,opacity]
                                                 [transition-duration:5000ms,1000ms]
                                                 ease-in-out
                                                 ${isSecondImageVisible ? "scale-125 opacity-100" : "opacity-0 scale-100"}
                                                `}
                                            />
                                        </div>

                                        <div className="hidden lg:block image" onClick={handleProductClick}>
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
                                                src={product.imageHover}
                                                height={500}
                                                width={500}
                                                
                                                className="absolute top-0 left-0  h-auto opacity-0 group-hover:opacity-100 group-hover:duration-1000 group-hover:scale-110"
                                            />
                                        </div>




                                        <div className="absolute top-2 left-2 ">

                                            <div className="flex items-center justify-center">
                                                <div className="bg-gray-700 rounded-full py-2 px-4 flex flex-col items-center justify-center text-center h-12 w-12">
                                                    {/* Calculate discount percentage */}
                                                    <p className="m-0 p-0 text-sm font-medium text-white leading-none">
                                                        {product?.originalPrice && product?.discountedPrice
                                                            ? `${Math.round(((product?.originalPrice - product?.discountedPrice) / product?.originalPrice) * 100)}%`
                                                            : '0%'}
                                                    </p>
                                                </div>
                                            </div>
                                            {
                                                !product?.inStock && (
                                                    <>
                                                        <div className="flex items-center justify-center mt-2">
                                                            <div className="bg-white rounded-full py-2 px-4 flex flex-col items-center justify-center text-center border border-gray-50   h-12 w-12">
                                                                <p className="m-0 p-0 text-sm font-medium text-black leading-none">Sold</p>
                                                                <p className="m-0 p-0 text-sm font-medium text-black leading-none">Out</p>
                                                            </div>
                                                        </div>
                                                    </>
                                                )
                                            }




                                        </div>




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
                                            className={`absolute text-center bottom-0 transform ${showCartClicked ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
                                                } transition-all duration-500 hover:text-black lg:block w-full h-full bg-white bg-opacity-90 flex flex-col justify-end`}
                                        >
                                            {/* Close Button */}
                                            <button
                                                className="absolute top-2 right-2 px-2 flex group/inner items-center justify-center transition duration-200 hover:text-gray-500"
                                                onClick={handleCardCloseClicked}
                                            >
                                                ✕ <span className="ms-1 text-black group-hover/inner:text-gray-500 font-semibold text-sm transition duration-200">Close</span>
                                            </button>

                                            {localProductData && showCartClicked && (
                                                <div className="w-full h-full flex flex-col justify-between">
                                                    <div className="flex-grow flex items-center justify-center">
                                                        {/* Color Bar in the Middle */}
                                                        <div className="Inner w-11/12">
                                                            <div className="color_text text-sm font-semibold text-gray-900 text-center">
                                                                Color:
                                                            </div>
                                                            <div className="color_map justify-center flex flex-wrap gap-2 my-2">
                                                                {localProductData.color?.map((color, index) => (
                                                                    <div
                                                                        key={index}
                                                                        className="relative group cursor-pointer flex items-center justify-center flex-shrink-0"
                                                                    >
                                                                        <div
                                                                            className={`color_palette rounded-3xl transition-colors flex items-center justify-center mb-1 w-[62px] h-[62px]`}
                                                                            style={{ backgroundColor: color.hex }}
                                                                            onClick={() => handleColorClick(color.colorName, color.id, color.availableQuantity)}
                                                                        >
                                                                            {/* Color square */}
                                                                        </div>

                                                                        {/* Bottom line that will appear on hover */}
                                                                        <div
                                                                            className={`absolute bottom-0 left-0 w-full h-[2px] bg-black opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full ${selectedColor === color.colorName && `opacity-100`}`}
                                                                        />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            <div
                                                                className={`clear text-xs text-gray-500 mt-2 cursor-pointer hover:text-gray-900 transition-all duration-500 text-center block ${selectedColor ? 'opacity-100 visible' : 'opacity-0 invisible'} `}
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
                        <div className="lower_txt flex justify-start ">
                            <div className="price_text_image text-start  px-5 py-4">
                                <Link href={`/product/1`} >

                                    <h1
                                        className="hover:opacity-60 transition-opacity duration-300 cursor-pointer"
                                        style={{ fontWeight: '400', fontSize: '14px' }} >
                                        {product.name}
                                    </h1>

                                </Link>

                                <p>
                                    <span className="text-xs" style={{ textDecoration: 'line-through', color: '#a9a9a9' }}>৳ {product.originalPrice}</span>
                                    <span className="text-sm font-semibold" style={{ color: '#424242', marginLeft: '8px' }}>৳ {product.discountedPrice}</span>
                                </p>
                            </div>
                        </div>

                    </div>

                </div>
            </div>


        </>
    )
}
