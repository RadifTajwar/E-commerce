import ProductForm from "@/components/admin/products/ProductForm";

/**
 * Thin wrapper kept so the admin products page can keep importing this path.
 */
export default function UpdateProducts({ toggleVisibility, doneUpdate, id, resetId }) {
  return (
    <ProductForm
      mode="edit"
      productId={id}
      onCancel={() => {
        resetId();
        toggleVisibility();
      }}
      onSuccess={() => doneUpdate()}
    />
  );
}
