"use client";

import type { ChangeEvent } from "react";
import { CURRENCY_SYMBOL } from "@/config/constants";

const ROW = "grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6";
const ROW_LABEL = "block text-sm text-gray-700 dark:text-gray-400 col-span-4 sm:col-span-2 font-medium";
const PREFIX =
  "inline-flex items-center px-3 rounded rounded-r-none border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm focus:bg-white focus:border-blue-500 dark:bg-gray-700 dark:text-gray-300 dark:border dark:border-gray-600";
const PRICE_INPUT =
  "block w-full px-3 py-1 text-sm focus:outline-none dark:text-gray-300 leading-5 rounded-md focus:border-gray-200 border-gray-200 dark:border-gray-600 focus:ring focus:ring-green-300 dark:focus:border-gray-500 dark:focus:ring-gray-300 dark:bg-gray-700 bg-gray-50 mr-2 rounded w-full h-12 p-2 text-sm border border-gray-300 focus:bg-white focus:border-blue-500 focus:outline-none rounded-l-none";

export interface PriceFieldsProps {
  originalPrice: string;
  discountedPrice: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export function PriceFields({ originalPrice, discountedPrice, onChange }: PriceFieldsProps) {
  return (
    <>
      <div className={ROW}>
        <label className={ROW_LABEL}>
          Product Price
        </label>
        <div className="col-span-8 sm:col-span-4">
          <div className="flex flex-row">
            <span className={PREFIX}>{CURRENCY_SYMBOL}</span>
            <input
              className={PRICE_INPUT}
              type="text"
              name="originalPrice"
              placeholder="Enter Product Price"
              value={originalPrice}
              onChange={onChange}
            />
          </div>
        </div>
      </div>

      <div className={ROW}>
        <label className={ROW_LABEL}>
          Sell Price <br />{" "}
          <span className="text-red-500">(Must be less than Original Price)</span>
        </label>
        <div className="col-span-8 sm:col-span-4">
          <div className="flex flex-row">
            <span className={PREFIX}>{CURRENCY_SYMBOL}</span>
            <input
              className={PRICE_INPUT}
              type="text"
              name="discountedPrice"
              placeholder="Enter Product Price"
              value={discountedPrice}
              onChange={onChange}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default PriceFields;
