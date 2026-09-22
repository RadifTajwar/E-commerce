"use client";

import Image from "next/image";
import { CloseIcon } from "@/components/ui/icons";
import type { CartItem } from "@/types/cart";

/**
 * One cart line. The cart page shows a table on md+ and stacked cards below
 * it, so the two layouts are separate components that share the same handlers
 * and line maths (they used to drift: the mobile buttons did nothing and the
 * mobile subtotal showed the whole-cart total).
 */

interface CartLineProps {
  item: CartItem;
  onIncrement: (colorId: string) => void;
  onDecrement: (colorId: string) => void;
  onRemove: (colorId: string) => void;
}

const lineSubtotal = (item: CartItem) => Number(item.price) * item.quantity;

export function CartLineRow({ item, onIncrement, onDecrement, onRemove }: CartLineProps) {
  return (
    <tr className="flex w-full border-b border-gray-200 justify-between">
      <td className="text-start py-4 px-2.5 w-[40px] text-md text-gray-900 font-normal flex items-center justify-center">
        <button
          className="m-0 min-w-[30px] min-h-[30px] flex justify-center items-center  cursor-pointer group"
          aria-label={`Remove ${item.name}`}
          onClick={() => onRemove(item.colorId)}
        >
          <CloseIcon className="h-3 w-3 fill-black group-hover:fill-gray-600" />
        </button>
      </td>
      <td className="text-start py-4 px-2.5 w-[104px] text-md text-gray-900 font-normal flex items-center">
        <Image src={item.image} alt={item.name} height={80} width={80} className="min-h-[80px] min-w-[80px]" />
      </td>
      <td className="text-start py-4 px-2.5 w-[258px] text-sm text-gray-900 font-normal flex items-center hover:text-gray-500 cursor-pointer transition-color duration-200">
        {item.name}-{item.color}
      </td>
      <td className="text-start py-4 px-2.5 w-[117px] text-sm text-gray-600 font-normal flex items-center">
        $ {item.price}
      </td>
      <td className="text-start py-4 px-2.5 w-[133px] text-sm text-gray-900 font-normal flex items-center">
        <div className="quantity_section flex justify-center">
          <div className="inner flex">
            <button
              className="border border-2 px-2 py-2 hover:bg-gray-800 hover:text-white transition  hover:border-black"
              onClick={() => onDecrement(item.colorId)}
            >
              -
            </button>

            <span className="px-3 py-3  border-t-2 border-b-2">{item.quantity}</span>

            <button
              className="border border-2 px-2 py-2 hover:bg-gray-800 hover:text-white transition  hover:border-black"
              onClick={() => onIncrement(item.colorId)}
            >
              +
            </button>
          </div>
        </div>
      </td>
      <td className="text-start py-4 px-2.5 w-[133px] text-md text-gray-800 font-medium flex items-center">
        $ {lineSubtotal(item)}
      </td>
    </tr>
  );
}

export function CartLineCard({ item, onIncrement, onDecrement, onRemove }: CartLineProps) {
  return (
    <div className="border-b border-gray-200 w-full flex pb-6 mb-6">
      <div className="image">
        <Image src={item.image} alt={item.name} height={100} width={100} className="min-w-[100px] min-h-[100px]" />
      </div>
      <div className="product_details w-full ps-6">
        <div className="name_remote_button flex  justify-between  mb-1">
          <p className="text-sm text-gray-900 font-normal  hover:text-gray-500 cursor-pointer transition-color duration-200 mb-2.5">
            {item.name}-{item.color}
          </p>
          <button
            className="m-0 min-w-[30px] min-h-[30px] flex justify-center items-center  cursor-pointer group mb-1"
            aria-label={`Remove ${item.name}`}
            onClick={() => onRemove(item.colorId)}
          >
            <CloseIcon className="h-3 w-3 fill-black group-hover:fill-gray-600" />
          </button>
        </div>
        <div className="name_remote_button flex flex-wrap justify-between mb-1 border-b border-dashed  border-gray-300">
          <p className="text-xs text-gray-900 font-medium  hover:text-gray-500 cursor-pointer transition-color duration-200 mb-1">
            PRICE
          </p>
          <p className="text-sm font-normal text-gray-500 mb-1">$ {item.price}</p>
        </div>
        <div className="name_remote_button flex flex-wrap justify-between items-center mb-1 border-b border-dashed  border-gray-300">
          <p className="text-xs text-gray-900 font-medium  hover:text-gray-500 cursor-pointer transition-color duration-200 mb-1">
            QUANTITY
          </p>
          <div className="quantity_section flex justify-center mb-1">
            <div className="inner flex">
              <button
                className="border border-2 px-2 py-1 hover:bg-gray-800 hover:text-white transition  hover:border-black text-gray-500 flex items-center justify-center"
                onClick={() => onDecrement(item.colorId)}
              >
                -
              </button>

              <span className="px-2 py-1  border-t-2 border-b-2 text-gray-500 text-sm flex items-center justify-center">
                {item.quantity}
              </span>

              <button
                className="border border-2 px-2 py-1 hover:bg-gray-800 hover:text-white transition  hover:border-black text-gray-500 flex items-center justify-center"
                onClick={() => onIncrement(item.colorId)}
              >
                +
              </button>
            </div>
          </div>
        </div>
        <div className="name_remote_button flex flex-wrap justify-between mb-1 ">
          <p className="text-xs text-gray-900 font-medium hover:text-gray-500 cursor-pointer transition-color duration-200 mb-1">
            SUBTOTAL
          </p>
          <p className="text-sm font-medium text-gray-700 mb-1">$ {lineSubtotal(item)}</p>
        </div>
      </div>
    </div>
  );
}
