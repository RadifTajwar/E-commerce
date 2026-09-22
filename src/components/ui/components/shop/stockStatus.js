"use client";

import { useRouter, useSearchParams } from "next/navigation";

/** In stock / on sale facet. Toggling only rewrites the query string. */
export default function StockStatus() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stockStatus = searchParams.get("stock_status") || ""; // Default to an empty string if not present

  const handleFilterClick = (value) => {
    const params = new URLSearchParams(window.location.search);
    const existing = params.get("stock_status") ? params.get("stock_status").split(",") : [];

    // Toggle the selected value
    if (!existing.includes(value)) {
      existing.push(value); // Add filter if it's not in the list
    } else {
      const index = existing.indexOf(value);
      if (index > -1) existing.splice(index, 1);
    }

    // If no filters are selected, remove `stock_status` from the query
    if (existing.length === 0) {
      params.delete("stock_status");
    } else {
      params.set("stock_status", existing.join(","));
    }

    const newUrl = `${window.location.pathname}?${params.toString().replace(/%2C/g, ",")}`;

    router.push(newUrl, { scroll: false });
  };

  return (
    <div className="stockStatus w-full">
      <p className="text-md text-black font-medium my-2">STOCK STATUS</p>
      <div className="flex flex-col space-y-4 mt-5">
        <label className="flex items-center cursor-pointer group">
          <input
            type="checkbox"
            className="w-4 h-4 accent-gray-700 mr-2 group-hover:border-black"
            name="inStock"
            checked={stockStatus.split(",").includes("inStock")}
            onChange={() => handleFilterClick("inStock")}
          />
          <p className="text-sm font-light text-gray-600 group-hover:text-black">In Stock</p>
        </label>

        <label className="flex items-center cursor-pointer group">
          <input
            type="checkbox"
            className="w-4 h-4 accent-gray-700 mr-2 group-hover:border-black"
            name="onSale"
            checked={stockStatus.split(",").includes("onSale")}
            onChange={() => handleFilterClick("onSale")}
          />
          <p className="text-sm font-light text-gray-600 group-hover:text-black">On Sale</p>
        </label>
      </div>
    </div>
  );
}
