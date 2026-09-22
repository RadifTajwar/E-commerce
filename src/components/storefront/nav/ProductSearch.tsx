"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { SearchIcon } from "@/components/ui/icons";
import { useCatalogNavigation } from "@/hooks/useCatalogNavigation";
import { useDebounce } from "@/hooks/useDebounce";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useAppDispatch } from "@/store/hooks";
import { fetchAllProducts } from "@/store/slices/product.slice";
import type { Product } from "@/types";

/**
 * The debounced product search that used to exist twice (nav menu + sidebar)
 * with two copies of the results dropdown.
 */

export type ProductSearchVariant = "navbar" | "sidebar";

export interface ProductSearchProps {
  variant: ProductSearchVariant;
  /** Called after a result is opened (lets the sidebar close itself). */
  onNavigate?: () => void;
}

function useProductSearch() {
  const dispatch = useAppDispatch();
  const [term, setTerm] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedTerm = useDebounce(term, 500);

  useEffect(() => {
    if (!debouncedTerm) {
      setResults([]);
      setIsSearching(false);
      return;
    }
    let cancelled = false;
    setIsSearching(true);
    dispatch(fetchAllProducts({ searchTerm: debouncedTerm }))
      .unwrap()
      .then((res) => {
        if (!cancelled) setResults(res.products);
      })
      .catch(() => {
        if (!cancelled) setResults([]);
      })
      .finally(() => {
        if (!cancelled) setIsSearching(false);
      });
    return () => {
      cancelled = true;
    };
  }, [debouncedTerm, dispatch]);

  const clear = useCallback(() => setResults([]), []);

  return { term, setTerm, results, isSearching, clear };
}

function SearchResults({
  results,
  className,
  onSelect,
}: {
  results: Product[];
  className: string;
  onSelect: (product: Product) => void;
}) {
  return (
    <div className={className}>
      {results.map((product) => (
        <div className="whole" key={product?.id}>
          <div
            className="flex w-full p-2 group hover:bg-gray-100 transition-all duration-300 cursor-pointer"
            onClick={() => onSelect(product)}
          >
            <div className="me-4">
              <Image src={product?.imageDefault} alt={product?.name} width={50} height={50} />
            </div>
            <div>
              <p className="text-gray-900 text-xs font-normal cursor-pointer group-hover:text-gray-600">
                {product?.name}
              </p>
              <p>
                <span style={{ textDecoration: "line-through", color: "#a9a9a9" }} className="text-xs">
                  ${product?.originalPrice}
                </span>
                <span className="text-xs text-gray-900 font-medium" style={{ marginLeft: "8px" }}>
                  ${product?.discountedPrice}
                </span>
              </p>
            </div>
          </div>
          <div className="line w-full h-px bg-gray-300"></div>
        </div>
      ))}
    </div>
  );
}

export default function ProductSearch({ variant, onNavigate }: ProductSearchProps) {
  const { term, setTerm, results, isSearching, clear } = useProductSearch();
  const { goToProduct } = useCatalogNavigation({ onNavigate });
  const containerRef = useRef<HTMLLIElement>(null);
  useClickOutside(containerRef, clear, variant === "navbar");

  const openProduct = (product: Product) => {
    clear();
    goToProduct(product.slug);
  };

  if (variant === "sidebar") {
    return (
      <div className="relative">
        <div className="ps-5 pe-12 py-2 relative">
          <input
            type="text"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Search for products"
            className="border-none px-4 py-2 placeholder:text-sm focus:outline-none mt-1 block w-full shadow-sm sm:text-sm"
          />
          {isSearching ? (
            <div className="absolute top-3 right-2 mt-1 mr-1">
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin "></div>
            </div>
          ) : (
            <div className="absolute top-3 right-2 mt-1 mr-1">
              <SearchIcon className="h-[22px] w-[22px] text-black" />
            </div>
          )}
        </div>
        {results.length > 0 && (
          <SearchResults
            results={results}
            onSelect={openProduct}
            className=" bg-white w-full border border-gray-200 max-h-64 overflow-scroll z-50 shadow-lg"
          />
        )}
      </div>
    );
  }

  return (
    <li className="group relative" ref={containerRef}>
      <div className="flex items-center bg-white p-2 border border-gray-200">
        <input
          type="text"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Search products"
          className="flex-1 px-2 text-sm bg-white outline-none border-r border-black"
        />
        {isSearching ? (
          <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin ms-2"></div>
        ) : (
          <SearchIcon className="text-black w-5 h-5 ms-2" />
        )}
      </div>

      {results.length > 0 && (
        <SearchResults
          results={results}
          onSelect={openProduct}
          className="absolute top-full left-0 bg-white w-full border border-gray-200 max-h-80 overflow-scroll"
        />
      )}
    </li>
  );
}
