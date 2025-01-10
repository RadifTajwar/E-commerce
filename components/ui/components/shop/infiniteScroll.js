'use client';
import { fetchAllProducts } from '@/redux/product/allProductsSlice';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Card from './card';

export default function InfiniteScroll({ products: initialProducts }) {
    const dispatch = useDispatch();
    const { products: fetchedProducts, isLoading, error, meta } = useSelector((state) => state.allProducts);
    const [allProducts, setAllProducts] = useState(initialProducts || []);
    const [pageNumber, setPageNumber] = useState(1);
    const observerRef = useRef(null);
    const lastProductRef = useRef(null);
    const isFetchingRef = useRef(false); // Prevent multiple fetches

    const maxPages = meta ? Math.ceil(meta.total / meta.limit) : Infinity;

    // Log page and products length
    useEffect(() => console.log('Current Page:', pageNumber), [pageNumber]);
    useEffect(() => console.log('Updated Products Length:', allProducts.length), [allProducts]);

    // Set initial products
    useEffect(() => {
        if (initialProducts?.length > 0 && allProducts.length === 0) {
            setAllProducts(initialProducts);
        }
    }, [initialProducts, allProducts]);

    // Fetch products when page number changes
    useEffect(() => {
        if (pageNumber > 1 && pageNumber <= maxPages && !isFetchingRef.current) {
            isFetchingRef.current = true;
            dispatch(fetchAllProducts({ page: pageNumber, limit: 5 })).finally(() => {
                isFetchingRef.current = false; // Reset after fetch
            });
        }
    }, [dispatch, pageNumber, maxPages]);

    // Append new products
    useEffect(() => {
        if (fetchedProducts?.length > 0 && pageNumber > 1) {
            setAllProducts((prevProducts) => {
                const newProducts = fetchedProducts.filter(
                    (product) => !prevProducts.some((prevProduct) => prevProduct.id === product.id)
                );
                return [...prevProducts, ...newProducts];
            });
        }
    }, [fetchedProducts, pageNumber]);

    // Intersection Observer setup
    useEffect(() => {
        if (!lastProductRef.current || isLoading || isFetchingRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (entry.isIntersecting && pageNumber < maxPages && !isFetchingRef.current) {
                    setPageNumber((prevPage) => prevPage + 1);
                }
            },
            { threshold: 0.2 }
        );

        observer.observe(lastProductRef.current);
        observerRef.current = observer;

        return () => {
            if (observerRef.current) observerRef.current.disconnect();
        };
    }, [allProducts, isLoading, pageNumber, maxPages]); // Observe again when `allProducts` changes

    return (
        <>
            <div className="flex grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8">
                {allProducts.length > 0 ? (
                    allProducts.map((product, index) => (
                        <div
                            key={product.id}
                            ref={index === allProducts.length - 1 ? lastProductRef : null} // Attach ref to the last product
                        >
                            <Card product={product} />
                        </div>
                    ))
                ) : (
                    <div>Loading products...</div>
                )}
            </div>

            {isLoading && <div>Loading more products...</div>}
            {error && <div>Error loading products: {error}</div>}
        </>
    );
}
