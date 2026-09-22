"use client";
import { CartLineCard, CartLineRow } from "@/components/storefront/checkout/CartLineItem";
import EmptyCart from "@/components/storefront/checkout/EmptyCart";
import ShippingOptions from "@/components/storefront/checkout/ShippingOptions";
import { useSelectedShipping } from "@/components/storefront/checkout/useSelectedShipping";
import { ROUTES } from "@/config/constants";
import { decrementItem, incrementItem, removeItemFromCart } from "@/store/slices/cart.slice";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import "./style.css";

export default function CartPage() {
  const [selectedShipping, selectShipping] = useSelectedShipping();

  const cartItems = useSelector((state) => state.cart.items);
  const cartTotal = useSelector((state) => state.cart.total);
  const dispatch = useDispatch();

  const handleRemovefromCart = (id) => {
    dispatch(removeItemFromCart({ id }));
  };
  const handleIncrementItem = (id) => {
    dispatch(incrementItem({ id }));
  };
  const handleDecrementItem = (id) => {
    dispatch(decrementItem({ id }));
  };

  return (
    <div className="total_container  max-w-7xl mx-auto my-10 ">
      <div className="inner_divs lg:flex w-full justify-center">
        {cartItems.length !== 0 && (
          <>
            <div className="left_container_md_to_lg_screen w-full hidden md:block lg:w-7/12 lg-xl:w-2/3 px-4 mb-10">
              <table className="cart-table w-full mb-9">
                <thead className="border-b-2 border-gray-200 w-full">
                  <tr className="flex w-full justify-between">
                    <th className="text-start py-4 px-2.5 w-[40px] text-md text-gray-900 font-normal"></th>
                    <th className="text-start py-4 px-2.5 w-[104px] text-md text-gray-900 font-normal"></th>
                    <th className="text-start py-4 px-2.5 w-[258px] text-md text-gray-900 font-normal">PRODUCT</th>
                    <th className="text-start py-4 px-2.5 w-[117px] text-md text-gray-900 font-normal">PRICE</th>
                    <th className="text-start py-4 px-2.5 w-[133px] text-md text-gray-900 font-normal">QUANTITY</th>
                    <th className="text-start py-4 px-2.5 w-[133px] text-md text-gray-900 font-normal">SUBTOTAL</th>
                  </tr>
                </thead>

                <tbody className="w-full">
                  {cartItems.map((item) => (
                    <CartLineRow
                      key={item.colorId}
                      item={item}
                      onIncrement={handleIncrementItem}
                      onDecrement={handleDecrementItem}
                      onRemove={handleRemovefromCart}
                    />
                  ))}
                </tbody>
              </table>

              <div className="coupon_box flex space-x-4 pt-4 md:justify-center lg:justify-start">
                <input
                  type="text"
                  className="border-2 border-gray-200 p-2 placeholder:text-sm focus:outline-none"
                  placeholder="Coupon code"
                />
                <div className="Apply_coupon_button bg-black  text-white text-center">
                  <button className="text-center w-full py-3 px-4 text-sm font-medium">APPLY COUPON</button>
                </div>
              </div>
            </div>

            <div className="left_container_small_screen md:hidden w-full lg:w-7/12 lg-xl:w-2/3 px-4 mb-10">
              <div className=" w-full">
                {cartItems.map((item) => (
                  <CartLineCard
                    key={item.colorId}
                    item={item}
                    onIncrement={handleIncrementItem}
                    onDecrement={handleDecrementItem}
                    onRemove={handleRemovefromCart}
                  />
                ))}

                <div className="coupon_box sm:flex pt-4 space-y-2 w-full sm:space-y-0 sm:space-x-4 sm:inline-block sm:justify-center">
                  <input
                    type="text"
                    className="inline-block w-full sm:w-auto border-2 border-gray-200 p-2  placeholder:text-sm focus:outline-none"
                    placeholder="Coupon code"
                  />
                  <div className="Apply_coupon_button bg-black  text-white text-center">
                    <button className="text-center w-full sm:w-auto py-3 px-4  sm:text-xs text-sm font-medium">
                      APPLY COUPON
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="right_container w-full lg:w-5/12 lg-xl:w-1/3  px-4">
              <div className="inner_container p-6 border-2 border-gray-300 w-full">
                <div className="cart_total ps-1.5 mb-4 text-gray-900 text-xl font-medium">CART TOTALS</div>
                <div className="upper_container mb-4 w-full">
                  <div className="subtotal flex flex-wrap w-full justify-between items-center border-b border-gray-200 mb-4 md:mb-0 pb-4 md:pb-0">
                    <div className="h-full text text-sm text-gray-900 font-normal  md:px-2.5 md:py-4 ">Subtotal</div>
                    <div className="amount text-sm text-gray-500 font-normal  md:px-3 md:py-4">$ {cartTotal}</div>
                  </div>
                  <div className="shipping  flex flex-wrap md:flex-nowrap md:items-center border-b border-gray-200 justify-between mb-4 md:mb-0 pb-4 md:pb-0">
                    <div className="shipping_left flex flex-wrap md:px-2.5 md:py-4 text-gray-900 text-sm font-normal">
                      Shipping
                    </div>
                    <div className="shipping_right md:px-3 md:py-4">
                      <ShippingOptions value={selectedShipping} onChange={selectShipping} />
                    </div>
                  </div>
                  <div className="total flex justify-between">
                    <div className="text md:px-2.5 md:py-4 text-gray-900 text-sm md:text-lg font-normal">Total</div>
                    <div className="amount md:px-3 md:py-4 text-gray-500 text-lg md:text-xl font-medium">
                      $ {cartTotal + selectedShipping}
                    </div>
                  </div>
                </div>
                <div className="buttons_ADD_TO_CART bg-black  text-white text-center">
                  <Link href={ROUTES.checkout}>
                    <button className="text-center w-full py-3 text-sm font-medium">PROCEED TO CHECKOUT</button>
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      {cartItems.length === 0 && <EmptyCart />}
    </div>
  );
}
