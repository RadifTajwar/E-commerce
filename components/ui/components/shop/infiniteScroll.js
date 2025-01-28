'use client';
import { fetchAllProducts } from '@/redux/product/allProductsSlice';
import localStorageUtil from '@/utils/localStorageUtil';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Card from './card';
export default function InfiniteScroll({ products: initialProducts }) {
    const params = useParams();
    const dispatch = useDispatch();
    const { products: fetchedProducts, isLoading, error, meta } = useSelector((state) => state.allProducts);
    const slug = params.slug;

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

            if (slug && slug.length === 2) {

                const categoryId = localStorageUtil.getItem('categoryId');
                // Dispatch with categoryId if slug has 2 elements
                dispatch(fetchAllProducts({ page: pageNumber, categoryId: categoryId })).finally(() => {
                    isFetchingRef.current = false;
                });
            } else if (slug && slug.length === 1) {
                // Dispatch with parentCategoryId if slug has 1 element

                const parentId = localStorageUtil.getItem('parentCategoryId');
                dispatch(fetchAllProducts({ page: pageNumber, parentCategoryId: parentId })).finally(() => {
                    isFetchingRef.current = false;
                });
            } else {
                // Fallback if slug is not an array or empty
                console.log("third dhukse");
                dispatch(fetchAllProducts({ page: pageNumber })).finally(() => {
                    isFetchingRef.current = false;
                });
            }

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
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8">
                {allProducts.length > 0 && (
                    allProducts.map((product, index) => (
                        <div
                            key={product.id}
                            ref={index === allProducts.length - 1 ? lastProductRef : null} // Attach ref to the last product
                        >
                            <Card product={product} />
                        </div>
                    ))
                ) }
            </div>

            {isLoading && (
                <div className="m-4 flex justify-center">
                    <div className="border border-gray-700 py-2 px-4 text-black text-sm">
                    <span className="flex justify-center items-center h-full">
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin me-2"></div>
                        Loading...
                    </span>
                        </div>
                   
                </div>
            )}
            {error && <div>Error loading products: {error}</div>}

        </>
    );
}
