import ProductForm from "@/components/admin/products/ProductForm";

/**
 * Thin wrapper kept so the admin products page can keep importing this path.
 * `categoryId` and `isInput` are still passed by the parent but were never
 * used by the form, so they are accepted and ignored.
 */
export default function AddProduct({ toggleAddProductVisible, doneAddProduct }) {
  return (
    <ProductForm
      mode="create"
      onCancel={() => toggleAddProductVisible()}
      onSuccess={() => doneAddProduct("success")}
    />
  );
}
