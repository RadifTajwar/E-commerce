import { decrementItem, incrementItem, removeItemFromCart } from '@/redux/cart/cartSlicer';
import ProductionQuantityLimitsOutlinedIcon from '@mui/icons-material/ProductionQuantityLimits';
import Image from 'next/image';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
export default function ShoppingCart({ toggleShoppingCart, isVisibleShoppingCart }) {
    const cartItems = useSelector((state) => state.cart.items);
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
        console.log("this id is coming :", id);
        dispatch(decrementItem({ id }));
    }

    return (
        <section className="bg-white dark:bg-gray-900 min-h-screen max-h-screen flex items-center justify-center overflow-y-auto z-50 transition-transform duration-300 min-w-[300px] lg:min-w-[340px]">
            <div className="flex flex-col items-center h-screen justify-center mx-auto w-full sm:max-w-md lg:py-0">
                <div className="w-full bg-white h-screen rounded-lg dark:border dark:bg-gray-800 dark:border-gray-700 flex flex-col overflow-hidden">
                    {/* Top Section */}
                    <div className="top_section flex justify-between py-5 px-4 border-b border-gray-200 sticky top-0 bg-white dark:bg-gray-800 z-10">
                        <h1 className="text-lg font-normal leading-tight tracking-tight text-gray-900 dark:text-white">
                            Shopping Cart
                        </h1>
                        <button
                                    className="text-sm flex items-center leading-tight tracking-tight text-gray-900 md:text-sm dark:text-white cursor-pointer hover:text-gray-600 group"
                                    onClick={toggleShoppingCart}
                                >
                                    <span className="mr-1">
                                        <svg className="h-3 w-3 group-hover:fill-gray-600" viewBox="0 0 24 24">
                                            <path d="M 4.7070312 3.2929688 L 3.2929688 4.7070312 L 10.585938 12 L 3.2929688 19.292969 L 4.7070312 20.707031 L 12 13.414062 L 19.292969 20.707031 L 20.707031 19.292969 L 13.414062 12 L 20.707031 4.7070312 L 19.292969 3.2929688 L 12 10.585938 L 4.7070312 3.2929688 z"></path>
                                        </svg>
                                    </span>
                                    Close
                                </button>
                    </div>

                    {/* Middle Section - Cart Items */}
                    <div className="middle_section flex-grow overflow-y-auto min-h-0 cart_item mt-0">
                        {cartItems.length === 0 ? (
                            <div className="empty_cart_icon_text flex justify-center m-4">
                                <div className="cart_icon text-center p-5">
                                    <ProductionQuantityLimitsOutlinedIcon style={{ fontSize: 100, opacity: 0.08 }} />
                                    <div className="text text-center my-4">
                                        <p className="text-sm text-gray-900 font-normal">No product in the cart</p>
                                    </div>
                                    <div className="buttons_ADD_TO_CART bg-black text-white text-center">
                                        <Link href="/shop"> <button className="text-center py-3 text-xs font-medium" onClick={toggleShoppingCart}>RETURN TO SHOP</button></Link>

                                    </div>
                                </div>
                            </div>
                        ) : (
                            cartItems.map((item, index) => (
                                <div key={index} className="flex justify-between w-full cursor-pointer group hover:bg-slate-100 px-4 py-4 border-b border-gray-200">
                                    <div className="cart_image_&_Text flex">
                                        <div className="cart_image">
                                            <Image src={item.image} alt={item.name} width={65} height={65} />
                                        </div>
                                        <div className="cart_text mx-4">
                                            <p className="text-sm text-gray-900 font-normal">{item.name}</p>
                                            <div className="quantity_section flex justify-start my-2">
                                                <div className="inner flex">
                                                    {/* Minus Button */}
                                                    <button className="border border px-2 py-1 hover:bg-gray-800 hover:text-white transition  hover:border-black text-gray-500 flex items-center justify-center" onClick={() => { handleDecrementItem(item.colorId) }}>
                                                        -
                                                    </button>

                                                    {/* Quantity Display with left and right borders */}
                                                    <span className="px-2 py-1  border-t border-b text-gray-500 text-sm flex items-center justify-center">1</span>

                                                    {/* Plus Button */}
                                                    <button className="border border px-2 py-1 hover:bg-gray-800 hover:text-white transition  hover:border-black text-gray-500 flex items-center justify-center" onClick={() => handleIncrementItem(item.colorId)}>
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="flex items-center my-2">
                                                <p className="text-xs text-gray-500 font-normal">{item.quantity}</p>
                                                <span className="m-1">
                                                    <svg className="h-2 w-2 fill-gray-600" viewBox="0 0 24 24">
                                                        <path d="M 4.7070312 3.2929688 L 3.2929688 4.7070312 L 10.585938 12 L 3.2929688 19.292969 L 4.7070312 20.707031 L 12 13.414062 L 19.292969 20.707031 L 13.414062 12 L 20.707031 4.7070312 L 19.292969 3.2929688 L 12 10.585938 L 4.7070312 3.2929688 z" />
                                                    </svg>
                                                </span>
                                                <p className="text-xs text-gray-700 font-semibold">$ {item.price}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="close_button">
                                        <button
                                            className="m-1 hover:bg-white hover:shadow rounded-full h-5 w-5 flex items-center justify-center"
                                            onClick={() => handleRemovefromCart(item.colorId)}
                                        >
                                            <svg className="h-3 w-3 group-hover:fill-gray-600" viewBox="0 0 24 24">
                                                <path d="M 4.7070312 3.2929688 L 3.2929688 4.7070312 L 10.585938 12 L 3.2929688 19.292969 L 4.7070312 20.707031 L 12 13.414062 L 19.292969 20.707031 L 13.414062 12 L 20.707031 4.7070312 L 19.292968 3.2929688 L 12 10.585938 L 4.7070312 3.2929688 z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Bottom Section */}
                    {cartItems.length !== 0 && (
                        <div className="lower_section py-4 px-4 border-t border-gray-200 bg-white dark:bg-gray-800 z-10">
                            <div className="subtotal flex justify-between items-center pb-4">
                                <h1 className="text-lg font-medium leading-tight tracking-tight text-gray-900 dark:text-white">
                                    Subtotal:
                                </h1>
                                <div className="subtotal_amount text-lg font-medium text-gray-600">
                                    <p>$ {cartTotal}</p>
                                </div>
                            </div>
                            <div className="buttons_view_cart_and_checkout">
                                <div className="view_cartbg text-black text-center bg-[#f7f7f7] mb-2.5 cursor-pointer w-full">
                                    <Link href="/cart"><button className="text-center py-3 text-xs font-medium w-full" onClick={toggleShoppingCart}>VIEW CART</button></Link>
                                </div>
                                <div className="CHECKOUT text-white text-center bg-black cursor-pointer w-full">
                                    <Link href="/checkout"><button className="text-center py-3 text-xs font-medium w-full " onClick={toggleShoppingCart}>CHECKOUT</button ></Link>

                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
