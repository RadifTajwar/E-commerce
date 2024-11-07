import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import EachColorBar from './eachColorBar';
import "./scrollbar.css";

export default function ColorBar({ products }) {
    const searchParams = useSearchParams();
    const [colorCounts, setColorCounts] = useState({});
    const stock_status = searchParams.get('stock_status');

    useEffect(() => {
        const colorCount = {};
        const statuses = stock_status ? stock_status.split(",") : [];

        // Filter products based on stock status or include all if no status
        const filteredProducts = statuses.length > 0
            ? Object.values(products).filter(product => {
                return (statuses.includes("inStock") && product.inStock) ||
                    (statuses.includes("onSale") && product.onSale);
            })
            : Object.values(products); // Include all products if no stock_status

        filteredProducts.forEach(product => {
            const color = product.color;
            const hex = product.hex;

            // Initialize if the color is not already in the colorCount
            if (!colorCount[color]) {
                colorCount[color] = { count: 1, hex: hex };
            } else {
                colorCount[color].count++;
            }
        });

        setColorCounts(colorCount);
    }, [products, stock_status]); // Recalculate on products or stock_status change

    const filteredColorCounts = Object.entries(colorCounts).filter(([_, { count }]) => count > 0);

    return (
        <>
            <p className='text-md text-black font-medium my-2'>FILTER BY COLOR</p>
            <div className="rangeBar max-h-56 flex flex-col justify-between gap-y-4 overflow-y-auto mt-5">
                {filteredColorCounts.length > 0 ? (
                    filteredColorCounts.map(([colorName, { count, hex }]) => (
                        <EachColorBar key={colorName} colorName={colorName} count={count} hex={hex} />
                    ))
                ) : (
                    <div className="sss">
                        No colors available for the selected stock status.
                    </div>
                )}
            </div>
        </>
    );
}
