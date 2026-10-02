"use client";

import Image from "next/image";
import type { CartItem } from "@/types/cart";
import ShippingOptions from "./ShippingOptions";

interface OrderSummaryProps {
  items: CartItem[];
  cartTotal: number;
  selectedShipping: number;
  onShippingChange: (cost: number) => void;
  onIncrement: (colorId: string) => void;
  onDecrement: (colorId: string) => void;
  isSubmitting: boolean;
}

/** The "YOUR ORDER" column of the checkout page, including the submit button. */
export default function OrderSummary({
  items,
  cartTotal,
  selectedShipping,
  onShippingChange,
  onIncrement,
  onDecrement,
  isSubmitting,
}: OrderSummaryProps) {
  return (
    <div className="inner p-8 bg-gray-100 bg-opacity-70">
      <div className="your_order_text text-center text-xl mb-5">YOUR ORDER</div>

      <div className="product_detail py-1 px-4 bg-white  mb-5">
        <div className="inner">
          <div className="header flex justify-between border-b-2 border-gray-200 ">
            <div className="text_product px-2.5 py-4">PRODUCT</div>
            <div className="text_subtotal px-2.5 py-4">SUBTOTAL</div>
          </div>
          <div className="all_product">
            <div className="inner_products max-h-48 overflow-y-auto">
              {items.map((item) => (
                <div
                  key={item.colorId}
                  className="w-full product_container px-3 py-4 flex justify-between items-center border-b border-gray-200"
                >
                  <div className="image_&_text flex items-center w-full">
                    <div className="image me-2.5">
                      <Image
                        src={item.image}
                        alt={item.name}
                        height={65}
                        width={65}
                        className="min-h-[65px] min-w-[65px]"
                      />
                    </div>
                    <div className="sm:flex justify-between items-center w-full">
                      <div className="text_&_amount">
                        <p className="text-gray-500 text-sm font-normal">
                          {item.name}-{item.color}
                        </p>
                        <div className="quantity_section mt-2.5 mb-2.5 sm:mb-0">
                          <div className="inner flex">
                            <div
                              className="border border-2 px-2 py-1 hover:bg-gray-800 hover:text-white transition  hover:border-black text-gray-500 flex items-center justify-center cursor-pointer"
                              onClick={() => onDecrement(item.colorId)}
                            >
                              -
                            </div>

                            <span className="px-2 py-1  border-t-2 border-b-2 text-gray-500 text-sm flex items-center justify-center">
                              {item.quantity}
                            </span>

                            <div
                              className="border border-2 px-2 py-1 hover:bg-gray-800 hover:text-white transition  hover:border-black text-gray-500 flex items-center justify-center cursor-pointer"
                              onClick={() => onIncrement(item.colorId)}
                            >
                              +
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="price">
                        <p className="text-gray-500 text-sm font-normal">$ {item.quantity * item.price}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="subtotal flex flex-wrap w-full justify-between items-center border-b border-gray-200 pt-4 md:pt-0  mb-4 md:mb-0 pb-4 md:pb-0">
              <div className="h-full text text-sm text-gray-900 font-normal  md:px-2.5 md:py-4 ">Subtotal</div>
              <div className="amount text-sm text-gray-500 font-normal  md:px-3 md:py-4">$ {cartTotal}</div>
            </div>
            <div className="shipping  flex flex-wrap md:flex-nowrap md:items-center border-b border-gray-200 justify-between mb-4 md:mb-0 pb-4 md:pb-0">
              <div className="shipping_left flex flex-wrap md:px-2.5 md:py-4 text-gray-900 text-sm font-normal">
                Shipping
              </div>
              <div className="shipping_right md:px-3 md:py-4">
                <ShippingOptions value={selectedShipping} onChange={onShippingChange} />
              </div>
            </div>
            <div className="total flex justify-between">
              <div className="text md:px-2.5 md:py-4 text-gray-900 text-sm md:text-lg font-normal">Total</div>
              <div className="amount md:px-3 md:py-4 text-gray-500 text-lg md:text-xl font-medium">
                $ {cartTotal + selectedShipping}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="cash_on_delivery_text text-start  mb-5 text-gray-900 text sm font-normal">Cash on delivery</div>
      <div className="delivery_method w-full bg-white p-4 mt-4">
        <p className="text-sm text-gray-500 font-normal"> Pay with cash upon delivery.</p>
      </div>
      <div className="place_order_section mt-5 py-5 border-t border-gray-200">
        <p className="text-gray-500 text-sm font-normal">
          Your personal data will be used to process your order, support your experience throughout this website, and
          for other purposes described in our{" "}
          <span className="text-black text-sm font-medium">privacy policy.</span>{" "}
        </p>
      </div>

      <div className="place_order_button bg-black  text-white text-center">
        <button className="text-center w-full py-3 text-sm font-medium" type="submit">
          {isSubmitting ? "Processing..." : "PLACE ORDER"}
        </button>
      </div>
    </div>
  );
}
