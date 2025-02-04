'use client'
import { decrementItem, incrementItem, removeItemFromCart } from '@/redux/cart/cartSlicer';
import localStorageUtil from '@/utils/localStorageUtil';
import ProductionQuantityLimitsOutlinedIcon from '@mui/icons-material/ProductionQuantityLimitsOutlined';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './style.css';
export default function page() {
    const [selectedShipping, setSelectedShipping] = useState(60);

    const handleShippingChange = (e) => {
        const cost = Number(e.target.value);
        setSelectedShipping(cost);
        localStorageUtil.setItem("selectedShipping", cost); // Save to local storage
    };
    const cartItems = useSelector((state) => state.cart.items);
    console.log("here cart items are : ", cartItems)
    const cartTotal = useSelector((state) => state.cart.total);
    const dispatch = useDispatch();

    const handleRemovefromCart = (id) => {
        dispatch(removeItemFromCart({ id }));
        console.log("this id is coming :", id);
    };

    const handleIncrementItem = (id) => {
        dispatch(incrementItem({ id }));
    }
    const handleDecrementItem = (id) => {
        dispatch(decrementItem({ id }));
    }

    useEffect(() => {
        const savedShipping = localStorageUtil.getItem("selectedShipping");
        if (savedShipping) {
            setSelectedShipping(Number(savedShipping));
        }
    }, []);

    return (
        <>
            {
                cartItems && (
                    <>
                        <div className="total_container  max-w-7xl mx-auto my-10 ">
                            <div className="inner_divs lg:flex w-full justify-center">
                                {
                                    cartItems?.length !== 0 && (
                                        <>
                                            <div className="left_container_md_to_lg_screen w-full hidden md:block lg:w-7/12 lg-xl:w-2/3 px-4 mb-10">
                                                <table className=" w-full mb-9">
                                                    <thead className="border-b-2 border-gray-200 w-full">
                                                        <tr className="flex w-full justify-between">
                                                            <th className="text-start py-4 px-2.5 w-[40px] text-md text-gray-900 font-normal" ></th>
                                                            <th className="text-start py-4 px-2.5 w-[104px] text-md text-gray-900 font-normal"></th>
                                                            <th className="text-start py-4 px-2.5 w-[258px] text-md text-gray-900 font-normal">PRODUCT</th>
                                                            <th className="text-start py-4 px-2.5 w-[117px] text-md text-gray-900 font-normal">PRICE</th>
                                                            <th className="text-start py-4 px-2.5 w-[133px] text-md text-gray-900 font-normal">QUANTITY</th>
                                                            <th className="text-start py-4 px-2.5 w-[133px] text-md text-gray-900 font-normal">SUBTOTAL</th>
                                                        </tr>
                                                    </thead>

                                                    <tbody className="w-full">
                                                        {cartItems?.map((item, index) => (
                                                            <tr key={index} className="flex w-full border-b border-gray-200 justify-between">

                                                                <td className="text-start py-4 px-2.5 w-[40px] text-md text-gray-900 font-normal flex items-center justify-center" >
                                                                    <button className="m-0 min-w-[30px] min-h-[30px] flex justify-center items-center  cursor-pointer group" onClick={() => { handleRemovefromCart(item?.colorId) }}>
                                                                       
                                                                        <svg className="h-3 w-3 fill-black group-hover:fill-gray-600" viewBox="0 0 24 24">
                                                                            <path d="M 4.7070312 3.2929688 L 3.2929688 4.7070312 L 10.585938 12 L 3.2929688 19.292969 L 4.7070312 20.707031 L 12 13.414062 L 19.292969 20.707031 L 20.707031 19.292969 L 13.414062 12 L 20.707031 4.7070312 L 19.292969 3.2929688 L 12 10.585938 L 4.7070312 3.2929688 z"></path>
                                                                        </svg>
                                                                    </button>
                                                                </td>
                                                                <td className="text-start py-4 px-2.5 w-[104px] text-md text-gray-900 font-normal flex items-center flex items-center">
                                                                    <Image src={item.image} alt={item.name} height={80} width={80} className="min-h-[80px] min-w-[80px]" />
                                                                </td>
                                                                <td className="text-start py-4 px-2.5 w-[258px] text-sm text-gray-900 font-normal flex items-center hover:text-gray-500 cursor-pointer transition-color duration-200">{item?.name}-{item?.color}</td>
                                                                <td className="text-start py-4 px-2.5 w-[117px] text-sm text-gray-600 font-normal flex items-center">$ {item?.price}</td>
                                                                <td className="text-start py-4 px-2.5 w-[133px] text-sm text-gray-900 font-normal flex items-center">
                                                                    <div className="quantity_section flex justify-center">
                                                                        <div className="inner flex">
                                                                         
                                                                            <button className="border border-2 px-2 py-2 hover:bg-gray-800 hover:text-white transition  hover:border-black" onClick={() => { handleDecrementItem(item?.colorId) }}>
                                                                                -
                                                                            </button>

                                                                           
                                                                            <span className="px-3 py-3  border-t-2 border-b-2">{item?.quantity}</span>

                                                                       
                                                                            <button className="border border-2 px-2 py-2 hover:bg-gray-800 hover:text-white transition  hover:border-black" onClick={() => { handleIncrementItem(item?.colorId) }}>
                                                                                +
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="text-start py-4 px-2.5 w-[133px] text-md text-gray-800 font-medium flex items-center">$ {item?.price * item?.quantity}</td>
                                                            </tr>

                                                        ))}

                                                    </tbody>



                                                </table>

                                                <div className="coupon_box flex space-x-4 pt-4 md:justify-center lg:justify-start">
                                                    <input type="text" className="border-2 border-gray-200 p-2 placeholder:text-sm focus:outline-none" placeholder="Coupon code" />
                                                    <div className="Apply_coupon_button bg-black  text-white text-center">
                                                        <button className="text-center w-full py-3 px-4 text-sm font-medium">APPLY COUPON</button>
                                                    </div>
                                                </div>


                                            </div>

                                            <div className="left_container_small_screen md:hidden w-full lg:w-7/12 lg-xl:w-2/3 px-4 mb-10">
                                                <div className=" w-full">
                                                    
                                                    {
                                                        cartItems.map((item,index) => (
                                                            <div   key={index} className="border-b border-gray-200 w-full flex pb-6 mb-6">
                                                                <div className="image">
                                                                    <Image src={item.image} alt={item.name} height={100} width={100} className='min-w-[100px] min-h-[100px]' />
                                                                </div>
                                                                <div className="product_details w-full ps-6">
                                                                    <div className="name_remote_button flex  justify-between  mb-1">
                                                                        <p className='text-sm text-gray-900 font-normal  hover:text-gray-500 cursor-pointer transition-color duration-200 mb-2.5'>{item.name}-{item.color}</p>
                                                                        <button className="m-0 min-w-[30px] min-h-[30px] flex justify-center items-center  cursor-pointer group mb-1"  onClick={() => { handleRemovefromCart(item.colorId) }}>
                                                                            <svg className="h-3 w-3 fill-black group-hover:fill-gray-600" viewBox="0 0 24 24">
                                                                                <path d="M 4.7070312 3.2929688 L 3.2929688 4.7070312 L 10.585938 12 L 3.2929688 19.292969 L 4.7070312 20.707031 L 12 13.414062 L 19.292969 20.707031 L 20.707031 19.292969 L 13.414062 12 L 20.707031 4.7070312 L 19.292969 3.2929688 L 12 10.585938 L 4.7070312 3.2929688 z"></path>
                                                                            </svg>
                                                                        </button>
                                                                    </div>
                                                                    <div className="name_remote_button flex flex-wrap justify-between mb-1 border-b border-dashed  border-gray-300">
                                                                        <p className='text-xs text-gray-900 font-medium  hover:text-gray-500 cursor-pointer transition-color duration-200 mb-1'>PRICE</p>
                                                                        <p className='text-sm font-normal text-gray-500 mb-1'>$ {item.price}</p>
                                                                    </div>
                                                                    <div className="name_remote_button flex flex-wrap justify-between items-center mb-1 border-b border-dashed  border-gray-300">
                                                                        <p className='text-xs text-gray-900 font-medium  hover:text-gray-500 cursor-pointer transition-color duration-200 mb-1'>QUANTITY</p>
                                                                        <div className="quantity_section flex justify-center mb-1">
                                                                            <div className="inner flex">
                                                                            
                                                                                <button className="border border-2 px-2 py-1 hover:bg-gray-800 hover:text-white transition  hover:border-black text-gray-500 flex items-center justify-center" onClick={() => { handleDecrementItem }}>
                                                                                    -
                                                                                </button>

                                                                                <span className="px-2 py-1  border-t-2 border-b-2 text-gray-500 text-sm flex items-center justify-center">{item.quantity}</span>

                                                                                
                                                                                <button className="border border-2 px-2 py-1 hover:bg-gray-800 hover:text-white transition  hover:border-black text-gray-500 flex items-center justify-center" onClick={() => { handleIncrementItem }}>
                                                                                    +
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="name_remote_button flex flex-wrap justify-between mb-1 ">
                                                                        <p className='text-xs text-gray-900 font-medium hover:text-gray-500 cursor-pointer transition-color duration-200 mb-1'>SUBTOTAL</p>
                                                                        <p className='text-sm font-medium text-gray-700 mb-1'>$ {cartTotal}</p>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        ))
                                                    }



                                                    <div className="coupon_box sm:flex pt-4 space-y-2 w-full sm:space-y-0 sm:space-x-4 sm:inline-block sm:justify-center">
                                                        <input type="text" className="inline-block w-full sm:w-auto border-2 border-gray-200 p-2  placeholder:text-sm focus:outline-none" placeholder="Coupon code" />
                                                        <div className="Apply_coupon_button bg-black  text-white text-center">
                                                            <button className="text-center w-full sm:w-auto py-3 px-4  sm:text-xs text-sm font-medium">APPLY COUPON</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="right_container w-full lg:w-5/12 lg-xl:w-1/3  px-4">
                                                <div className="inner_container p-6 border-2 border-gray-300 w-full">
                                                    <div className="cart_total ps-1.5 mb-4 text-gray-900 text-xl font-medium">
                                                        CART TOTALS
                                                    </div>
                                                    <div className="upper_container mb-4 w-full">


                                                        <div className="subtotal flex flex-wrap w-full justify-between items-center border-b border-gray-200 mb-4 md:mb-0 pb-4 md:pb-0">
                                                            <div className="h-full text text-sm text-gray-900 font-normal  md:px-2.5 md:py-4 ">
                                                                Subtotal
                                                            </div>
                                                            <div className="amount text-sm text-gray-500 font-normal  md:px-3 md:py-4">
                                                                $ {cartTotal}
                                                            </div>
                                                        </div>
                                                        <div className="shipping  flex flex-wrap md:flex-nowrap md:items-center border-b border-gray-200 justify-between mb-4 md:mb-0 pb-4 md:pb-0">
                                                            <div className="shipping_left flex flex-wrap md:px-2.5 md:py-4 text-gray-900 text-sm font-normal">
                                                                Shipping
                                                            </div>
                                                            <div className="shipping_right md:px-3 md:py-4">
                                                                <ul className="space-y-4">
                                                                    <li className="flex items-start justify-end text-end space-x-2">
                                                                        <p className="text-sm text-black font-normal">Home Delivery - Chattogram City: $60.00</p>
                                                                        <input
                                                                            type="radio"
                                                                            name="shipping_method"
                                                                            value={60}
                                                                            checked={selectedShipping === 60}
                                                                            onChange={handleShippingChange}
                                                                            className="shipping_method mt-1"
                                                                        />
                                                                    </li>
                                                                    <li className="flex items-start justify-end text-end space-x-2">
                                                                        <p className="text-sm text-black font-normal">Home Delivery - Dhaka City: $100.00</p>
                                                                        <input
                                                                            type="radio"
                                                                            name="shipping_method"
                                                                            value={100}
                                                                            checked={selectedShipping === 100}
                                                                            onChange={handleShippingChange}
                                                                            className="shipping_method mt-1"
                                                                        />
                                                                    </li>
                                                                    <li className="flex items-start justify-end text-end space-x-2">
                                                                        <p className="text-sm text-black font-normal">Home Delivery - Outside District: $120.00</p>
                                                                        <input
                                                                            type="radio"
                                                                            name="shipping_method"
                                                                            value={120}
                                                                            checked={selectedShipping === 120}
                                                                            onChange={handleShippingChange}
                                                                            className="shipping_method mt-1"
                                                                        />
                                                                    </li>
                                                                </ul>
                                                                <p className="mt-4 text-sm text-gray-700">Selected Shipping Cost: ${selectedShipping}</p>
                                                            </div>
                                                        </div>
                                                        <div className="total flex justify-between">
                                                            <div className="text md:px-2.5 md:py-4 text-gray-900 text-sm md:text-lg font-normal">
                                                                Total
                                                            </div>
                                                            <div className="amount md:px-3 md:py-4 text-gray-500 text-lg md:text-xl font-medium">
                                                                $ {cartTotal + selectedShipping}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="buttons_ADD_TO_CART bg-black  text-white text-center">
                                                        <Link href="/checkout"> <button className="text-center w-full py-3 text-sm font-medium">PROCEED TO CHECKOUT</button>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )
}
                            </div>
                            {
                                 cartItems.length === 0 && (
                                    <>
                                        <div className="empty_cart_icon_text flex justify-center m-4 max-w-6xl mx-auto">
                                            <div className="cart_icon text-center p-5 w-full">
                                                <ProductionQuantityLimitsOutlinedIcon className="!text-[150px] md:!text-[200px] lg:!text-[250px] opacity-[0.08]" />
                                                <div className="text text-center my-4">
                                                    <p className=" text-2xl md:text-3xl lg:text-4xl text-gray-900 font-medium mb-4">Your cart is currently empty.</p>
                                                    <p className=" text-xs md:text-sm text-gray-500 font-normal">Before proceed to checkout you must add some products to your shopping cart.</p>
                                                    <p className="text-xs md:text-sm text-gray-500 font-normal">
                                                        You will find a lot of interesting products on our "Shop" page. </p>
                                                </div>


                                                <div className="buttons_ADD_TO_CART bg-black text-white text-center w-full">
                                                    <Link href="/shop">
                                                        <button className="text-center py-3 text-md font-medium w-full cursor-pointer" >RETURN TO SHOP</button>
                                                    </Link>
                                                </div>

                                            </div>
                                        </div>
                                    </>
                                )
                            }
                        </div>
                    </>
                )
            }



        </>
    )
}