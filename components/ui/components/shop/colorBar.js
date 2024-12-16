import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import EachColorBar from './eachColorBar';
import './scrollbar.css';

export default function ColorBar({ products }) {
    const searchParams = useSearchParams();
    const [colorCounts, setColorCounts] = useState({});
    const stock_status = searchParams.get('stock_status');
    const filter_color = searchParams.get('filter_color');

    // Derive the selected colors from the query string (split into an array)
    const selectedColors = filter_color ? filter_color.split(",") : [];

    useEffect(() => {
        const colorCount = {};
        const statuses = stock_status ? stock_status.split(",") : [];

        // Filter products based on stock status (inStock, onSale, or both)
        let filteredProducts = Object.values(products);

        if (statuses.length > 0) {
            filteredProducts = filteredProducts.filter(product => {
                return (
                    (statuses.includes("inStock") && product.inStock) ||
                    (statuses.includes("onSale") && product.onSale)
                );
            });
        }

        // If no color is selected, show all colors in the filtered products
        if (selectedColors.length === 0) {
            filteredProducts.forEach(product => {
                product.color.forEach(colorDetail => {
                    const { colorName, hex } = colorDetail;

                    // Initialize the color count if it doesn't exist
                    if (!colorCount[colorName]) {
                        colorCount[colorName] = { count: 0, hex: hex };
                    }

                    // Increment the count for this color
                    colorCount[colorName].count += 1;
                });
            });
        } else {
            // If a color is selected, filter the products by the selected color
            const productsWithSelectedColor = filteredProducts.filter(product =>
                product.color.some(color => selectedColors.includes(color.colorName))
            );

            // Count the colors in the filtered products that have the selected color
            productsWithSelectedColor.forEach(product => {
                product.color.forEach(colorDetail => {
                    const { colorName, hex } = colorDetail;

                    // Initialize the color count if it doesn't exist
                    if (!colorCount[colorName]) {
                        colorCount[colorName] = { count: 0, hex: hex };
                    }

                    // Increment the count for this color
                    colorCount[colorName].count += 1;
                });
            });
        }

        setColorCounts(colorCount);
    }, [products, stock_status, filter_color]); // Recalculate when products, stock_status, or filter_color change

    // Filter out colors that have zero count
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
