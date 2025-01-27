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
        if(product?.inStock){
            setIsLoadingCart(true); // Show loader initially
            dispatch(fetchProductById(product.id)); // Fetch product data
        }else{
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
                                        <div className="image" onClick={handleProductClick}>
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
                                               ! product?.inStock && (
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
                                        <div className="absolute top-0 -right-2 mt-2 w-auto bg-white opacity-0 group-hover:opacity-100 group-hover:-translate-x-1/3 transition-all duration-300 ease-out h-auto transform hidden lg:block">
                                            <div className="flex flex-col items-center gap-2 hidden md:block">
                                                {/* Outer group */}
                                                <div className="flex group/inner items-center justify-center w-12 h-11">
                                                    {/* Inner group */}
                                                    <div className="relative   transition-transform duration-300">
                                                        {/* Search Icon */}
                                                        <SearchIcon />

                                                        {/* The span that appears on hover of group-inner */}
                                                        {/* <span className="absolute left-0 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                            S
                                                        </span> */}
                                                    </div>
                                                </div>

                                                {/* Cart Icon (with hover effect on outer group) */}
                                                <div className="text-gray-600 hover:text-gray-700 transition-colors duration-200 w-12 h-11 justify-center items-center flex"
                                                    onClick={handleCartOpenClicked}>
                                                    <CartIcon />

                                                </div>
                                            </div>
                                        </div>



                                        {/* Cart icon div */}
                                        <div className="absolute left-0 bottom-0  w-auto  p-2 h-auto transform lg:opacity-0" style={{ backgroundColor: '#E8A811' }} >
                                            <div className="flex flex-col items-center gap-2">


                                                {/* Cart Icon */}
                                                <div className="text-red-500 hover:text-red-700 transition-colors duration-200 ">
                                                    <svg viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg" className="h-6 y-6">
                                                        <path d="m5.50835165 12.5914912c-.00106615-.0057657-.00203337-.011566-.00289985-.0173991l-1.22011509-7.32069058c-.12054699-.72328196-.74633216-1.25340152-1.47959089-1.25340152h-.30574582c-.27614237 0-.5-.22385763-.5-.5s.22385763-.5.5-.5h.30574582c1.1918179 0 2.21327948.84029234 2.44951006 2h16.24474412c.3321894 0 .5720214.31795246.480762.63736056l-2 7.00000004c-.0613288.2146507-.2575218.3626394-.480762.3626394h-12.90976979l.12443308.7465985c.12054699.7232819.74633216 1.2534015 1.47959089 1.2534015h11.30574582c.2761424 0 .5.2238576.5.5s-.2238576.5-.5.5h-11.30574582c-1.22209789 0-2.26507316-.8835326-2.46598481-2.0890025l-.21991747-1.3195048zm-.08478811-6.5914912 1 6h12.69928576l1.7142857-6zm2.57643646 15c-1.1045695 0-2-.8954305-2-2s.8954305-2 2-2 2 .8954305 2 2-.8954305 2-2 2zm0-1c.55228475 0 1-.4477153 1-1s-.44771525-1-1-1-1 .4477153-1 1 .44771525 1 1 1zm9 1c-1.1045695 0-2-.8954305-2-2s.8954305-2 2-2 2 .8954305 2 2-.8954305 2-2 2zm0-1c.5522847 0 1-.4477153 1-1s-.4477153-1-1-1-1 .4477153-1 1 .4477153 1 1 1z" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>

                                        {/* small screen add to wishlist rounded div */}
                                        <div className="absolute top-0 right-0  m-2 w-auto  p-2 h-auto bg-white transform lg:opacity-0 rounded-full"   >
                                            <div className="flex flex-col items-center gap-2 ">


                                                {/* love icon */}
                                                <div className="text-red-500 hover:text-red-700 transition-colors duration-200 ">
                                                    <svg fill="#000000" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-6 y-6">

                                                        <path d="M20.5,4.609A5.811,5.811,0,0,0,16,2.5a5.75,5.75,0,0,0-4,1.455A5.75,5.75,0,0,0,8,2.5,5.811,5.811,0,0,0,3.5,4.609c-.953,1.156-1.95,3.249-1.289,6.66,1.055,5.447,8.966,9.917,9.3,10.1a1,1,0,0,0,.974,0c.336-.187,8.247-4.657,9.3-10.1C22.45,7.858,21.453,5.765,20.5,4.609Zm-.674,6.28C19.08,14.74,13.658,18.322,12,19.34c-2.336-1.41-7.142-4.95-7.821-8.451-.513-2.646.189-4.183.869-5.007A3.819,3.819,0,0,1,8,4.5a3.493,3.493,0,0,1,3.115,1.469,1.005,1.005,0,0,0,1.76.011A3.489,3.489,0,0,1,16,4.5a3.819,3.819,0,0,1,2.959,1.382C19.637,6.706,20.339,8.243,19.826,10.889Z" />

                                                    </svg>
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
