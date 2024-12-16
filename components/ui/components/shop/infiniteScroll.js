'use client';
import { useSearchParams } from 'next/navigation'; // Import useSearchParams
import { Suspense, useEffect, useState } from 'react';
import Card from './card';
export default function InfiniteScroll({ products }) {
    const searchParams = useSearchParams(); // Get search parameters
    const min_price = searchParams.get('min_price'); // Get min_price from search params
    const max_price = searchParams.get('max_price'); // Get max_price from search params
    const filter_color = searchParams.get('filter_color');
    const parentCategory = searchParams.get('parentCategory');
    const childCategory = searchParams.get('childCategory');
    const stock_status = searchParams.get('stock_status');
    const orderby = searchParams.get('orderby');
    const [count, setCount] = useState(20);

    // Transform the products object into an array for easier sorting and filtering
    const productArray = Object.values(products);

    // Filter and sort the products based on the criteria
    const filteredProducts = productArray
        .filter(product => {
            const originalPrice = product.discountedPrice;
            const productColors = product.color; // Access the array of colors
            const isInStock = product.inStock;
            const isOnSale = product.onSale;

            const minPrice = min_price ? parseInt(min_price) : 0;
            const maxPrice = max_price ? parseInt(max_price) : Infinity;
            const selectedColors = filter_color ? filter_color.split(",") : [];
            const selectedStockStatuses = stock_status ? stock_status.split(",") : [];

            const withinPriceRange = originalPrice >= minPrice && originalPrice <= maxPrice;

            // Check if any color in the product's colors matches the selected colors
            const matchesColor = selectedColors.length === 0 || 
                productColors.some(color => selectedColors.includes(color.colorName));

            const matchesStockStatus =
                selectedStockStatuses.length === 0 ||
                (selectedStockStatuses.includes("inStock") && isInStock) ||
                (selectedStockStatuses.includes("onSale") && isOnSale);

            return withinPriceRange && matchesColor && matchesStockStatus;
        })
        .sort((a, b) => {
            if (orderby === "price_asc") {
                return a.discountedPrice - b.discountedPrice;
            } else if (orderby === "price_desc") {
                return b.discountedPrice - a.discountedPrice;
            }
            return 0; // No sorting for other values
        });

    const total = filteredProducts.length; // Use the number of filtered products

    useEffect(() => {
        const onscroll = () => {
            if (window.innerHeight + window.scrollY >= window.document.body.offsetHeight - 200) {
                setCount(prevCount => Math.min(prevCount + 10, total)); // Prevent exceeding total
            }
        };

        window.addEventListener('scroll', onscroll);

        return () => window.removeEventListener('scroll', onscroll);
    }, [total, min_price, max_price, filter_color]); // Add min_price and max_price as dependencies

    const elements = [];
    const effectiveCount = count >= total ? total : count; // Use total if count exceeds it

    for (let i = 0; i < effectiveCount; i++) {
        elements.push(<Card key={filteredProducts[i].id} product={filteredProducts[i]} />); // Pass product as prop
    }

    return (
        <>
       <Suspense fallback={<div>Loading...</div>}>
            <div className="flex grid grid-cols-2 md:grid-cols-3 gap-x-4">
                {elements}
            </div>
            </Suspense>
        </>
    );
}
