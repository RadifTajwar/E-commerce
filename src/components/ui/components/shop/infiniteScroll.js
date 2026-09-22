"use client";

import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { notify } from "@/lib/toast";
import { fetchAllProducts } from "@/store/slices/product.slice";
import Card from "./card";

/**
 * The product grid. Page 1 always comes from the store (fetched by
 * `ShopBrowser` from the URL); pages 2..n are appended here as the last card
 * scrolls into view. Category ids and filters arrive as props — nothing is
 * read from localStorage any more.
 */
export default function InfiniteScroll({ products, filters, categoryId, parentCategoryId }) {
  const dispatch = useDispatch();
  const { isLoading, error, meta } = useSelector((state) => state.allProducts);

  const [page, setPage] = useState(1);
  const [items, setItems] = useState(() => products ?? []);
  const [lastNode, setLastNode] = useState(null);
  const isFetchingRef = useRef(false);

  // `meta` is absent until the first page resolves: no pages known yet.
  const maxPages = meta && meta.limit > 0 ? Math.ceil(meta.total / meta.limit) : 0;

  // A new filter/category selection restarts the list.
  const queryKey = useMemo(
    () => JSON.stringify({ filters: filters ?? {}, categoryId, parentCategoryId }),
    [filters, categoryId, parentCategoryId],
  );
  const queryKeyRef = useRef(queryKey);
  useEffect(() => {
    if (queryKeyRef.current === queryKey) return;
    queryKeyRef.current = queryKey;
    setPage(1);
  }, [queryKey]);

  // Page 1 is whatever the store currently holds; later pages are appended
  // below. (The slice replaces its list on every fetch, hence the local copy.)
  useEffect(() => {
    if (page === 1) setItems(products ?? []);
  }, [products, page]);

  // Append the next page. Every value the effect reads is in its deps.
  useEffect(() => {
    if (page <= 1 || maxPages === 0 || page > maxPages || isFetchingRef.current) return;

    let cancelled = false;
    isFetchingRef.current = true;

    dispatch(
      fetchAllProducts({
        ...(filters ?? {}),
        ...(categoryId ? { categoryId } : {}),
        ...(parentCategoryId ? { parentCategoryId } : {}),
        page,
      }),
    )
      .unwrap()
      .then((response) => {
        if (cancelled || !response?.products?.length) return;
        setItems((previous) => [
          ...previous,
          ...response.products.filter((product) => !previous.some((p) => p.id === product.id)),
        ]);
      })
      .catch(() => {
        // The slice stores the message; it is surfaced by the effect below.
      })
      .finally(() => {
        isFetchingRef.current = false;
      });

    return () => {
      cancelled = true;
    };
  }, [dispatch, page, maxPages, filters, categoryId, parentCategoryId]);

  // Surface a failure once per message instead of swallowing it.
  const lastErrorRef = useRef(null);
  useEffect(() => {
    if (error && lastErrorRef.current !== error) {
      lastErrorRef.current = error;
      notify.error(error);
    }
    if (!error) lastErrorRef.current = null;
  }, [error]);

  // Callback ref so the observer re-registers whenever the last card changes.
  const lastProductRef = useCallback((node) => setLastNode(node), []);

  useEffect(() => {
    if (!lastNode || isLoading || maxPages === 0 || page >= maxPages) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting && !isFetchingRef.current) {
          setPage((previous) => previous + 1);
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(lastNode);
    return () => observer.disconnect();
  }, [lastNode, isLoading, page, maxPages]);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8 w-full">
        {items.length > 0 ? (
          items.map((product, index) => (
            <div
              key={product.id}
              ref={index === items.length - 1 ? lastProductRef : null} // Attach ref to the last product
            >
              <Card product={product} />
            </div>
          ))
        ) : isLoading ? null : (
          <div className="w-full bg-red-700 p-4 text-sm text-white font-medium">
            <ErrorOutlineIcon /> No products were found matching your selection.{" "}
          </div>
        )}
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
