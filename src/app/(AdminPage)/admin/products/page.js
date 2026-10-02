"use client";
import AdminDrawer from "@/components/admin/AdminDrawer";
import ConfirmDeleteDialog from "@/components/admin/ConfirmDeleteDialog";
import AddProduct from "@/components/ui/components/admin/products/addProduct";
import AllProducts from "@/components/ui/components/admin/products/allProducts";
import UpdateProducts from "@/components/ui/components/admin/products/updateProducts";
import { Button, Card, CardBody, Input, PageHeader, Select } from "@/components/admin/ui";
import { PlusIcon } from "@/components/ui/icons";
import { isObjectId } from "@/config/constants";
import { useDebounce } from "@/hooks/useDebounce";
import { notify } from "@/lib/toast";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAllCategories } from "@/store/slices/category.slice";
import { deleteProductById, fetchProductById } from "@/store/slices/product.slice";
import { Suspense, useEffect, useMemo, useState } from "react";

function PageContent() {
  const dispatch = useAppDispatch();

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 400);

  const [updateId, setUpdateId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [isVisibleAddProduct, setIsVisibleAddProduct] = useState(false);
  /**
   * Bumped to force the list to refetch. A counter, not a boolean: the previous
   * `productsFetched` flag was set true by the list and false by the filter
   * effect inside the same commit, so it never actually changed and a later
   * `setState(false)` was a no-op — which is why a newly created product only
   * appeared after a page reload.
   */
  const [reloadKey, setReloadKey] = useState(0);
  const [stock, setStock] = useState("");
  const [sale, setSale] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const { categories } = useAppSelector((state) => state.categories);
  const { productData } = useAppSelector((state) => state.productById);
  const deleteName = productData && productData.id === deleteId ? productData.name : "";

  useEffect(() => {
    dispatch(fetchAllCategories());
  }, [dispatch]);

  // The active query: a chosen category wins over the typed search term, and
  // a price choice always sorts on the discounted price (same as the shop).
  const activeSearchTerm = categoryId || debouncedSearch;
  const filters = useMemo(
    () => ({
      ...(activeSearchTerm ? { searchTerm: activeSearchTerm } : {}),
      ...(sortOrder ? { sortBy: "discountedPrice", sortOrder } : {}),
      ...(stock ? { inStock: stock === "in" } : {}),
      ...(sale ? { onSale: sale === "yes" } : {}),
      ...(minPrice ? { minPrice: Number(minPrice) } : {}),
      ...(maxPrice ? { maxPrice: Number(maxPrice) } : {}),
    }),
    [activeSearchTerm, sortOrder, stock, sale, minPrice, maxPrice],
  );

  const refetch = () => setReloadKey((key) => key + 1);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCategoryId("");
    setSortOrder("");
  };

  const handleCategorySelect = (id) => {
    setCategoryId(id);
    setSearchTerm("");
  };

  const handleSortChange = (value) => {
    setSortOrder(value);
    setCategoryId("");
    setSearchTerm("");
  };

  const doneAddProduct = (result) => {
    if (result === "success") {
      notify.success("Product Added Successfully!");
      refetch();
      setIsVisibleAddProduct(false);
    } else if (result === "duplicate") {
      notify.error("Duplicate Product!");
    } else if (result === "validationError") {
      notify.error("No input field can be empty!");
    } else {
      notify.error("Internal Server Error!");
    }
  };

  const doneUpdate = () => {
    notify.success("Product Updated Successfully!");
    refetch();
  };

  const openUpdate = (id) => setUpdateId(id);
  const closeUpdate = () => setUpdateId(null);

  const openDelete = (id) => {
    setDeleteId(id);
    if (isObjectId(id)) dispatch(fetchProductById(id));
  };
  const closeDelete = () => setDeleteId(null);

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await dispatch(deleteProductById(deleteId)).unwrap();
      closeDelete();
      notify.success("Product Deleted Successfully!");
      refetch();
    } catch (error) {
      notify.error(error.message);
    }
  };

  const toggleAddProductVisible = () => setIsVisibleAddProduct((open) => !open);

  const clearFilters = () => {
    setSearchTerm("");
    setCategoryId("");
    setSortOrder("");
    setStock("");
    setSale("");
    setMinPrice("");
    setMaxPrice("");
  };
  const filtersActive = Boolean(
    searchTerm || categoryId || sortOrder || stock || sale || minPrice || maxPrice,
  );

  return (
    <>
      <PageHeader
        title="Products"
        description="Your full catalogue."
        actions={
          <Button onClick={toggleAddProductVisible}>
            <PlusIcon className="h-4 w-4" />
            Add product
          </Button>
        }
      />

      <Card className="mb-5 shrink-0">
        <CardBody className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Input
            type="search"
            aria-label="Search products"
            placeholder="Search by name…"
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
          />

          <Select
            aria-label="Filter by category"
            value={categoryId}
            onChange={(e) => {
              const id = e.target.value;
              handleCategorySelect(id);
            }}
          >
            <option value="">All categories</option>
            {categories?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>

          <Select aria-label="Filter by stock" value={stock} onChange={(e) => setStock(e.target.value)}>
            <option value="">Any stock</option>
            <option value="in">In stock</option>
            <option value="out">Out of stock</option>
          </Select>

          <Select aria-label="Filter by sale" value={sale} onChange={(e) => setSale(e.target.value)}>
            <option value="">Sale: any</option>
            <option value="yes">On sale</option>
            <option value="no">Not on sale</option>
          </Select>

          <div className="flex items-center gap-2">
            <Input
              type="number"
              min="0"
              aria-label="Minimum price"
              placeholder="Min price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <span className="text-xs text-slate-400">to</span>
            <Input
              type="number"
              min="0"
              aria-label="Maximum price"
              placeholder="Max price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>

          <Select
            aria-label="Sort by price"
            value={sortOrder}
            onChange={(e) => handleSortChange(e.target.value)}
          >
            <option value="">Sort: newest</option>
            <option value="asc">Price: low to high</option>
            <option value="desc">Price: high to low</option>
          </Select>

          <div className="flex items-center justify-end sm:col-span-2 xl:col-span-2">
            {filtersActive && (
              <Button variant="ghost" onClick={clearFilters}>
                Clear filters
              </Button>
            )}
          </div>
        </CardBody>
      </Card>

      <AllProducts
        onEdit={openUpdate}
        onDelete={openDelete}
        filters={filters}
        reloadKey={reloadKey}
      />

      <AdminDrawer isOpen={Boolean(updateId)} onClose={closeUpdate} width="wide">
        <UpdateProducts toggleVisibility={closeUpdate} id={updateId} resetId={closeUpdate} doneUpdate={doneUpdate} />
      </AdminDrawer>

      <AdminDrawer isOpen={isVisibleAddProduct} onClose={toggleAddProductVisible} width="wide">
        <AddProduct
          toggleAddProductVisible={toggleAddProductVisible}
          doneAddProduct={doneAddProduct}
          categoryId={categoryId}
          isInput={searchTerm}
        />
      </AdminDrawer>

      <ConfirmDeleteDialog
        isOpen={Boolean(deleteId)}
        name={deleteName}
        onCancel={closeDelete}
        onConfirm={confirmDelete}
      />
    </>
  );
}

/** useSearchParams() requires a Suspense boundary for static prerendering. */
export default function Page() {
  return (
    <Suspense fallback={null}>
      <PageContent />
    </Suspense>
  );
}
