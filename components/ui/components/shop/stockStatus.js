import { useRouter, useSearchParams } from "next/navigation";

export default function StockStatus() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const stock_status = searchParams.get('stock_status') || ""; // Default to an empty string if not present

    const handleFilterClick = (value) => {
        const params = new URLSearchParams(window.location.search);
        const existingStockStatus = params.get("stock_status") ? params.get("stock_status").split(",") : [];
        
        // Toggle the selected value
        if (!existingStockStatus.includes(value)) {
            existingStockStatus.push(value); // Add filter if it’s not in the list
        } else {
            // Remove the specific filter from the list
            const index = existingStockStatus.indexOf(value);
            if (index > -1) {
                existingStockStatus.splice(index, 1);
            }
        }

        // If no filters are selected, remove `stock_status` from the query
        if (existingStockStatus.length === 0) {
            params.delete("stock_status");
        } else {
            params.set("stock_status", existingStockStatus.join(","));
        }

        router.push(`${window.location.pathname}?${params.toString()}`);
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
                        checked={stock_status.split(",").includes("inStock")}
                        onChange={() => handleFilterClick("inStock")}
                    />
                    <p className="text-sm font-light text-gray-600 group-hover:text-black">In Stock</p>
                </label>

                <label className="flex items-center cursor-pointer group">
                    <input
                        type="checkbox"
                        className="w-4 h-4 accent-gray-700 mr-2 group-hover:border-black"
                        name="onSale"
                        checked={stock_status.split(",").includes("onSale")}
                        onChange={() => handleFilterClick("onSale")}
                    />
                    <p className="text-sm font-light text-gray-600 group-hover:text-black">On Sale</p>
                </label>
            </div>
        </div>
    );
}
