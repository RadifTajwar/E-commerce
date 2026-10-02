"use client";
import AdminPagination, { PAGE_SIZE_OPTIONS } from "@/components/admin/AdminPagination";
import RowActions from "@/components/admin/RowActions";
import TableSkeletonRows from "@/components/admin/TableSkeletonRows";
import Thumb from "@/components/admin/Thumb";
import { usePagination } from "@/components/admin/usePagination";
import {
  Badge,
  Card,
  CardBody,
  EmptyState,
  Table,
  TableWrap,
  TBody,
  TD,
  TH,
  THead,
  TR,
} from "@/components/admin/ui";
import { PAGE_SIZE } from "@/config/constants";
import { formatMoney } from "@/lib/utils";
import { isPending } from "@/store/create-request-slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAllProducts } from "@/store/slices/product.slice";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";

export default function AllProducts({ onEdit, onDelete, filters, reloadKey }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Rows per page lives in the URL beside the page number.
  const rawSize = Number(searchParams.get("limit"));
  const pageSize = PAGE_SIZE_OPTIONS.includes(rawSize) ? rawSize : PAGE_SIZE.admin;

  const productsState = useAppSelector((state) => state.allProducts);
  const { products, meta, error } = productsState;
  // Not just `isLoading`: before the first fetch settles there is nothing to show.
  const busy = isPending(productsState);

  // Single place the product list is fetched from. Every input that should
  // change the results is a dependency, so there is no flag to get out of sync.
  useEffect(() => {
    const page = Number(searchParams.get("page")) || 1;
    dispatch(fetchAllProducts({ page, limit: pageSize, ...filters }));
  }, [searchParams, dispatch, filters, pageSize, reloadKey]);

  // The page number lives in the query string, which is already a dependency.
  const onPageChange = useCallback(() => {}, []);
  const { page, totalPages, goToPage } = usePagination(meta, pageSize, onPageChange);

  const changePageSize = useCallback(
    (next) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("limit", String(next));
      // A different page size renumbers everything, so go back to the start.
      params.set("page", "1");
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  return (
    <>
      {error && !busy && (
        <Card className="mb-5 shrink-0 border-red-200 dark:border-red-900/50">
          <CardBody className="text-sm text-red-600 dark:text-red-400">{error}</CardBody>
        </Card>
      )}

      <TableWrap>
        <Table>
          <THead>
            <TR>
              <TH>Product</TH>
              <TH align="right">Price</TH>
              <TH align="right">Sale price</TH>
              <TH>Stock</TH>
              <TH align="right">Actions</TH>
            </TR>
          </THead>
          <TBody>
            {busy && <TableSkeletonRows columns={5} />}
            {!busy &&
              products?.map((product) => (
                <TR key={product.id}>
                  <TD>
                    <div className="flex items-center gap-3">
                      <Thumb src={product.imageDefault} alt={product.name} />
                      <div className="min-w-0">
                        <p className="truncate font-medium text-slate-900 dark:text-white">
                          {product.name}
                        </p>
                        {product.slug && (
                          <p className="truncate text-xs text-slate-400">{product.slug}</p>
                        )}
                      </div>
                    </div>
                  </TD>
                  <TD align="right" className="whitespace-nowrap">
                    {product.onSale ? (
                      <span className="text-slate-400 line-through">
                        {formatMoney(product.originalPrice ?? 0)}
                      </span>
                    ) : (
                      formatMoney(product.originalPrice ?? 0)
                    )}
                  </TD>
                  <TD align="right" className="whitespace-nowrap font-medium text-slate-900 dark:text-white">
                    {formatMoney(product.discountedPrice ?? 0)}
                  </TD>
                  <TD>
                    <Badge tone={product.inStock ? "green" : "red"}>
                      {product.inStock ? "In stock" : "Out of stock"}
                    </Badge>
                  </TD>
                  <TD align="right">
                    <RowActions
                      label={product.name}
                      onEdit={() => onEdit(product.id)}
                      onDelete={() => onDelete(product.id)}
                    />
                  </TD>
                </TR>
              ))}
          </TBody>
        </Table>

        {!busy && (!products || products.length === 0) && (
          <EmptyState
            title="No products match"
            description="Adjust your filters, or add a product to get started."
          />
        )}
      </TableWrap>

      <AdminPagination
        page={page}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={goToPage}
        onPageSizeChange={changePageSize}
        isBusy={busy}
        className="mt-5"
      />
    </>
  );
}
