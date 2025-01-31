'use client'
import ImageEffect from "@/components/imageEffect";
import { Card, CardContent } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious
} from "@/components/ui/carousel";
import Cart from "@/components/ui/components/cart";
import AccordionSection from "@/components/ui/components/productCart/accordionSection";
import '@/components/ui/components/shop/scrollbar.css';
import { cn } from "@/lib/utils";
import { addItemToCart } from "@/redux/cart/cartSlicer";
import { fetchProductBySlug } from "@/redux/product/productBySlugSlice";
import { Skeleton } from "@mui/material";
import CryptoJS from 'crypto-js';
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import './style.css';
export default function productId() {
    const pathname = usePathname(); // Get the full pathname
    const [selectedColor, setSelectedColor] = useState(null);
    const [colorId, setColorId] = useState(null);
    const dispatch = useDispatch();

    const handleAddToCart = () => {
        if (!selectedColor) {
            alert("Please select a color before adding to cart!"); // Alert if no color is selected

        } else {
            // If a color is selected, dispatch the action with color
            dispatch(addItemToCart({
                id: productData?.id,
                name: productData?.name,
                price: productData?.discountedPrice,
                image: productData?.imageDefault,
                quantity: quantity,
                colorId: colorId, // Send the selected color along with other data
                color: selectedColor, // Send the selected color along with other data
            }));
        }
    };
    const [quantity, setQuantity] = useState(1); // Initialize quantity state

    const handleIncrease = () => {
        setQuantity(prevQuantity => prevQuantity + 1); // Increment quantity
    };

    const handleDecrease = () => {
        setQuantity(prevQuantity => (prevQuantity > 1 ? prevQuantity - 1 : 1)); // Decrement with a minimum of 1
    };
    // Obfuscated key name
    const obfuscatedKey = 'wc_di';
    const secretKey = 'Tajwar@00452268'; // Must match the one used for encryption

    // Retrieve and decrypt the ID
    const encryptedId = localStorage.getItem(obfuscatedKey);
    const PID = encryptedId
        ? CryptoJS.AES.decrypt(encryptedId, secretKey).toString(CryptoJS.enc.Utf8)
        : null;



    // Access the update category data from the store
    const { productData, isLoading, error } = useSelector((state) => state.productBySlug);

   


    const isSamllScreen = typeof window !== 'undefined' && window.innerWidth >= 768;
    const isLargeScreen = typeof window !== 'undefined' && window.innerWidth >= 1280;
    const productName = pathname.split('/').pop();


    // Fetch the category by ID
    useEffect(() => {




        if (productName) {

            dispatch(fetchProductBySlug(productName));

        }
    }, [productName, dispatch]);

    const [outOfStock, setOutOfStock] = useState(false);


    const handleColorClick = (colorName, colorId, availableQuantity) => {
        if (availableQuantity === 0) {
            setOutOfStock(true);
        } else {
            setOutOfStock(false);
        }
        setSelectedColor(colorName); // Update the selected color state
        setColorId(colorId); // Update the selected color ID state
    };
    const [images, setImages] = useState([]);

    useEffect(() => {
        if (productData) {
            const imageArray = [];

            // Add default and hover images
            if (productData?.imageDefault) imageArray.push(productData?.imageDefault);
            if (productData?.imageHover) imageArray.push(productData?.imageHover);

            // Add additional details images
            if (productData?.additionalDetails) {
                productData?.additionalDetails.forEach((detail) => {
                    if (detail.images && Array.isArray(detail?.images)) {
                        imageArray.push(...detail?.images);
                    }
                });
            }

            // Remove duplicates and update state
            setImages(imageArray);
        }
    }, [productData]);



    const [currentIndex, setCurrentIndex] = useState(0)
    const [mainApi, setMainApi] = useState(null)
    const [thumbnailApi, setThumbnailApi] = useState(null)

    const syncCarousels = useCallback((api, targetIndex) => {
        if (api && typeof api.scrollTo === 'function') {
            api.scrollTo(targetIndex)
            console.log("inside", targetIndex);
        }
        console.log("outside", targetIndex);
    }, [])

    useEffect(() => {
        if (mainApi) syncCarousels(mainApi, currentIndex)
        if (thumbnailApi) syncCarousels(thumbnailApi, currentIndex)
    }, [currentIndex, mainApi, thumbnailApi, syncCarousels])

    const handleThumbnailClick = (index) => {
        setCurrentIndex(index)
    }
    const handleClearClicked = () => {
        setOutOfStock(false);
        setSelectedColor(null);
    }
    return (
        <>





            <div className="productIdCart my-2">
                <div className="upper_part max-w-7xl mx-auto px-4">
                    <div className="flex w-full space-x-4">

                        {
                            isLoading && (
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
                                            <Skeleton
                                                variant="rectangular"
                                                width="100%"
                                                height={600}
                                                className="rounded"
                                                animation="wave"
                                            />
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
                            )
                        }

                        {!isLoading && productData && (
                            <div className="one&two w-full md:w-1/2 lg:w-4/6 lg:flex lg:me-5">
                                <div className="one w-1/4 pe-5 hidden lg:block">
                                    <Carousel
                                        opts={{
                                            align: "start",
                                        }}
                                        orientation="vertical"
                                        className="carousel w-full max-w-full"
                                        setApi={isLargeScreen && setThumbnailApi}
                                    >
                                        <CarouselContent className="-mt-1 h-[600px]">
                                            {images.map((image, index) => (
                                                <CarouselItem key={index} className="pt-1 basis-1/3">
                                                    <div className="p-1">
                                                        <Card className="rounded-none border-none">
                                                            <CardContent className="flex items-center justify-center p-0 overflow-hidden">
                                                                <button
                                                                    onClick={() => handleThumbnailClick(index)}
                                                                    className={cn(
                                                                        "min-h-[174px] min-w-[190px] border-2 transition-colors",
                                                                        currentIndex === index ? "border-red-500" : "border-transparent"
                                                                    )}
                                                                >
                                                                    <Image
                                                                        src={image}
                                                                        height={174}
                                                                        width={184}
                                                                        alt={`Thumbnail ${index + 1}`}
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
                                        <Carousel
                                            className="w-full"
                                            setApi={setMainApi}
                                            onSelect={setCurrentIndex}
                                        >
                                            <CarouselContent>
                                                {images.map((image, index) => (
                                                    <CarouselItem key={index}>
                                                        <div className="p-0">
                                                            <Card className="rounded-none border-none">
                                                                <CardContent className="flex items-center justify-center p-0">
                                                                    <div className="inner w-full relative">
                                                                        <ImageEffect src={image} />
                                                                        <div className="absolute top-4 right-4 space-y-2">
                                                                            {/* Discount Badge */}
                                                                            <div className="bg-gray-700 rounded-full py-2 px-4 flex flex-col items-center justify-center text-center h-14 w-14">
                                                                                {/* Calculate discount percentage */}
                                                                                <p className="m-0 p-0 text-sm font-medium text-white leading-none">
                                                                                    {productData.originalPrice && productData.discountedPrice
                                                                                        ? `${Math.round(((productData.originalPrice - productData.discountedPrice) / productData.originalPrice) * 100)}%`
                                                                                        : '0%'}
                                                                                </p>
                                                                            </div>

                                                                            {/* Sold Out Badge */}
                                                                            {!productData.inStock && (
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
                                        opts={{
                                            slidesPerView: 3,
                                            slidesToScroll: isSamllScreen ? 2 : 1,
                                        }}
                                        setApi={!isLargeScreen && setThumbnailApi}
                                    >
                                        <CarouselContent className="-ml-1">
                                            {images.map((image, index) => (
                                                <CarouselItem key={index} className="pl-1 basis-1/3 sm:basis-1/4 ">
                                                    <div className="p-0">
                                                        <div className="border-none rounded-none">
                                                            <div className="flex items-center justify-center p-0">
                                                                <div className="w-full h-full">
                                                                    <button onClick={() => handleThumbnailClick(index)} className={cn("border-b", currentIndex === index ? "border-red-500" : "border-transparent")}  >
                                                                        <Image
                                                                            src={image}
                                                                            alt="Thumbnail"
                                                                            height={117}
                                                                            width={117}
                                                                            objectFit="contain"
                                                                            className="w-[177px] h-auto md:h-auto md:w-[115px]"
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

                        )}
                        <div className=" three hidden md:block md:w-1/2 lg:w-2/6   border border-px shadow ms-5">
                            <div className="inner px-10 py-12 w-full h-full ">
                                <div className="txt space-y-2 mb-4">
                                    <h1 className="text-3xl font-normal text-center text-gray-800">{productData?.name}</h1>
                                    <p className="text-center">
                                        <span style={{ textDecoration: 'line-through', color: '#a9a9a9' }} className='text-lg'>${productData?.originalPrice}</span>
                                        <span className="text-xl text-gray-700 font-medium" style={{ marginLeft: '8px' }}>${productData?.discountedPrice}</span>
                                    </p>
                                </div>

                                <div className="color_section items-center justify-center relative">
                                    <p className="text-center text-gray-800 text-lg font-semibold">Color :</p>
                                    <div className="rangeBar h-auto flex items-center space-x-2 justify-center mb-2">
                                        {/* Render color options */}
                                        {
                                            !isLoading && (
                                                productData?.color?.map((color, index) => (
                                                    <div
                                                        key={index}
                                                        className="relative group cursor-pointer flex items-center justify-center"
                                                    >
                                                        <div
                                                            className={`color_palette rounded-3xl transition-colors flex items-center justify-center mb-1 min-w-[62px] min-h-[62px]`}
                                                            style={{ backgroundColor: color.hex }}
                                                            onClick={() => handleColorClick(color?.colorName, color?.id, color?.availableQuantity)}
                                                        >
                                                            {/* Color square */}
                                                        </div>

                                                        {/* Bottom line that will appear on hover */}
                                                        <div
                                                            className={`absolute bottom-0 left-0 w-full h-[2px] bg-black opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full ${selectedColor === color.colorName && `opacity-100 `}`}
                                                        />
                                                    </div>
                                                ))
                                            )
                                        }

                                        {
                                            isLoading && (
                                                Array.from({ length: 2 }).map((_, index) => (
                                                    <div
                                                        key={index}
                                                        className="relative group flex items-center justify-center"
                                                    >
                                                        {/* Circle for color */}
                                                        <Skeleton
                                                            variant="circular"
                                                            width={62}
                                                            height={62}
                                                            animation="wave"
                                                            className="mb-1"
                                                        />
                                                        {/* Bottom line skeleton */}

                                                    </div>
                                                ))
                                            )
                                        }


                                        {/* Clear button positioned to the right */}
                                        <div className={`text-center clear_button ms-2 ${selectedColor ? 'block' : 'hidden'}`}>
                                            <button className="text-gray-500 hover:text-gray-900 font-regular text-sm" onClick={handleClearClicked}>x clear</button>
                                        </div>
                                    </div>
                                </div>


                                <div className="OutOfStock Text">
                                    {outOfStock && (
                                        <p className="text-center text-red-800 text-xl font-semibold">Out of Stock</p>
                                    )}
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
                                    <div
                                        className={`buttons_ADD_TO_CART bg-black text-white text-center `}
                                    >
                                        <button
                                            className={`text-center w-full py-3 text-sm font-medium ${!productData?.inStock || outOfStock ? "cursor-not-allowed" : ""}`}
                                            onClick={handleAddToCart}
                                            disabled={!productData?.inStock || outOfStock}
                                        >
                                            ADD TO CART
                                        </button>
                                    </div>

                                    {/* Buy Now Button */}
                                    <div
                                        className={`buttons_BUY_NOW bg-black text-white text-center `}
                                    >
                                        <button
                                            className={`text-center w-full py-3 text-sm font-medium ${!productData?.inStock || outOfStock ? "cursor-not-allowed" : ""}`}
                                            disabled={!productData?.inStock || outOfStock}
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
                                            <p className="text-sm text-gray-500 font-normal">{productData?.productDetails?.warranty}</p>

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
                                                {productData?.color?.map((color, index) => (
                                                    <span key={color.id}>
                                                        {color?.colorName}{index < productData?.color?.length - 1 && ", "}
                                                    </span>
                                                ))}
                                            </p>
                                        </div>
                                    </div>



                                </div>

                                <div className="product_caption w-full ">
                                    <p className="text-sm text-gray-500 font-normal text-center">Your everyday job will be easier if you keep all of your paperwork, file, documents, tabs up to 10 inches, checkbooks, certificates, business cards, and pencils in an A4 file bag. Cowhide is used to create the bag, which has a long lifespan.</p>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className=" three w-full  md:hidden border border-px shadow ">
                        <div className="inner px-10 py-12 w-full h-full ">
                            <div className="txt space-y-2 mb-4">
                                <h1 className=" text-lg md:text-xl xl:text-3xl font-normal text-center text-gray-800">A4 File Bag Series 2</h1>
                                <p className="text-center">
                                    <span style={{ textDecoration: 'line-through', color: '#a9a9a9' }} className='text-md lg:text-lg'>$1350.00</span>
                                    <span className="md:text-lg lg:text-xl text-gray-700 font-medium" style={{ marginLeft: '8px' }}>$3500.00</span>
                                </p>
                            </div>

                            <div className="color_section flex items-center justify-center space-x-4">
                                <div className="">
                                    <p className="text-center text-gray-800  text-md font-semibold">Color :</p>
                                </div>
                                {/* <div className=" rangeBar max-w-[300px] max-h-[65px] overflow-scroll flex space-x-2 justify-between">
                                            {Array.from({ length: 5 }).map((_, index) => (
                                                <div className="color_palette group cursor-pointer min-w-[62px] min-h-[62px] bg-[#740224] rounded-3xl flex items-center justify-center">
                                                    <div className="tick_icon hidden group-hover:block ">
                                                        <DoneIcon className='text-white' />
                                                    </div>
                                                </div>
                                            ))}

                                        </div> */}

                                <div className="rangeBar h-auto max-w-[300px] max-h-[65px] overflow-scroll flex items-center space-x-2 justify-center mb-2">
                                    {productData?.color?.map((color, index) => (
                                        <div
                                            key={index}
                                            className="relative group cursor-pointer flex items-center justify-center"
                                        >
                                            <div
                                                className={`color_palette rounded-3xl transition-colors flex items-center justify-center mb-1 min-w-[62px] min-h-[62px]`}
                                                style={{ backgroundColor: color.hex }}
                                                onClick={() => handleColorClick(color?.colorName, color?.id, color?.availableQuantity)}
                                            >
                                                {/* Color square */}
                                            </div>

                                            {/* Bottom line that will appear on hover */}
                                            <div
                                                className={`absolute bottom-0 left-0 w-full h-[2px] bg-black opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full ${selectedColor === color?.colorName && `opacity-100 `}`}
                                            />
                                        </div>
                                    ))}

                                    {/* Clear button positioned to the right */}
                                    <div className={`text-center clear_button ms-2 ${selectedColor ? 'block' : 'hidden'}`}>
                                        <button className="text-gray-500 hover:text-gray-900 font-regular text-sm" onClick={handleClearClicked}>x clear</button>
                                    </div>
                                </div>

                            </div>

                            <div className="quantity_section flex justify-center">
                                <div className="inner flex  my-4">
                                    {/* Minus Button */}
                                    <button className="border border-2 px-3 py-3 hover:bg-gray-800 hover:text-white transition  hover:border-black" onClick={handleDecrease}>
                                        -
                                    </button>

                                    {/* Quantity Display with left and right borders */}
                                    <span className="px-3 py-3  border-t-2 border-b-2">{quantity}</span>

                                    {/* Plus Button */}
                                    <button className="border border-2 px-3 py-3 hover:bg-gray-800 hover:text-white transition  hover:border-black" onClick={handleIncrease}>
                                        +
                                    </button>
                                </div>
                            </div>

                            <div className="Add_to_cart&Buy_now space-y-2">

                                <div className="buttons_ADD_TO_CART bg-black  text-white text-center">
                                    <button className="text-center w-full py-3 text-sm font-medium" onClick={handleAddToCart}>ADD TO CART</button>
                                </div>
                                <div className="text-center buttons_BUY_NOW bg-black  text-white">
                                    <button className="text-center w-full py-3 text-sm font-medium">BUY NOW</button>
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
                                        <p className="text-sm text-gray-500 font-normal">12 months</p>

                                    </div>
                                </div>
                                <div className="line w-full border-t border-gray-300 "></div>

                                <div className="w-full flex justify-between items-center py-4">
                                    <div className="detail_type">
                                        <p className="text-sm text-gray-900 font-normal">Color  </p>
                                    </div>
                                    <div className="detail_type">
                                        <p className="text-sm text-gray-500 font-normal">Black, Chocolate</p>

                                    </div>
                                </div>



                            </div>

                            <div className="product_caption w-full ">
                                <p className="text-sm text-gray-500 font-normal text-center">Your everyday job will be easier if you keep all of your paperwork, file, documents, tabs up to 10 inches, checkbooks, certificates, business cards, and pencils in an A4 file bag. Cowhide is used to create the bag, which has a long lifespan.</p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            {
                productData && (
                    <div className="description_&_review_sectionmy-2">
                        <div className="upper_part max-w-7xl mx-auto px-4">

                            <AccordionSection productId={productData?.id}/>
                        </div>
                    </div>
                )
            }                            
           




            <div className=" text flex justify-center  max-w-xl xl:max-w-7xl container mx-auto mt-10">
                <div className="text text-center">
                    <h1 className="text-2xl md:text-4xl font-bold ">
                        <span style={{ color: '#E8A811' }}>RELATED</span> PRODUCTS
                    </h1>
                    <p className=" text-md  decoration-gray-800 hover:opacity-60 transition-opacity duration-300 cursor-pointer my-3">
                        BAGS
                    </p>
                </div>

            </div>
            {
                productData && (
                    <>
                        <Cart productName={productData.name} />
                    </>
                )
            }




        </>


    )
}
