import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductGallery from "@/components/storefront/product/ProductGallery";
import ProductInfoPanel from "@/components/storefront/product/ProductInfoPanel";
import ProductReviews from "@/components/storefront/product/ProductReviews";
import RelatedProducts from "@/components/storefront/shop/RelatedProducts";
import "@/components/ui/components/shop/scrollbar.css";
import { ROUTES } from "@/config/constants";
import { clientEnv } from "@/config/env";
import { getProductBySlug } from "@/server/queries";

interface PageProps {
  params: { productName: string };
}

/**
 * Product pages are the SEO surface of the site, so the record is fetched on
 * the server and rendered into the HTML. Reviews and related products stay
 * client-side: they change often and are not part of the indexed content.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.productName);
  if (!product) return { title: "Product not found" };

  const description = product.description?.slice(0, 160) || `${product.name} from our leather collection.`;

  return {
    title: product.name,
    description,
    alternates: { canonical: ROUTES.product(product.slug) },
    openGraph: {
      title: product.name,
      description,
      type: "website",
      url: ROUTES.product(product.slug),
      siteName: clientEnv.NEXT_PUBLIC_APP_NAME,
      images: product.imageDefault ? [{ url: product.imageDefault }] : undefined,
    },
  };
}

/** schema.org Product: lets search engines show price and stock with the result. */
function productJsonLd(product: NonNullable<Awaited<ReturnType<typeof getProductBySlug>>>) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || undefined,
    image: product.imageDefault ? [product.imageDefault] : undefined,
    brand: { "@type": "Brand", name: clientEnv.NEXT_PUBLIC_APP_NAME },
    offers: {
      "@type": "Offer",
      url: new URL(ROUTES.product(product.slug), clientEnv.NEXT_PUBLIC_APP_URL).toString(),
      priceCurrency: "BDT",
      price: product.discountedPrice,
      availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const product = await getProductBySlug(params.productName);
  if (!product) notFound();

  // "<" escaped so text in a description can never close the script tag.
  const jsonLd = JSON.stringify(productJsonLd(product)).replace(/</g, "\\u003c");

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <div className="productIdCart my-2">
        <div className="upper_part max-w-7xl mx-auto px-4">
          <div className="flex w-full space-x-4">
            <ProductGallery product={product} />
            <ProductInfoPanel
              product={product}
              isLoading={false}
              className=" three hidden md:block md:w-1/2 lg:w-2/6   border border-px shadow ms-5"
            />
          </div>
          <ProductInfoPanel
            product={product}
            isLoading={false}
            className=" three w-full  md:hidden border border-px shadow "
          />
        </div>
      </div>

      <div className="description_&_review_sectionmy-2">
        <div className="upper_part max-w-7xl mx-auto px-4">
          <ProductReviews productId={product.id} />
        </div>
      </div>

      <div className=" text flex justify-center  max-w-xl xl:max-w-7xl container mx-auto mt-10">
        <div className="text text-center">
          <h2 className="text-2xl md:text-4xl font-bold ">
            <span className="text-[#E8A811]">RELATED</span> PRODUCTS
          </h2>
          <p className=" text-md  decoration-gray-800 hover:opacity-60 transition-opacity duration-300 cursor-pointer my-3">
            BAGS
          </p>
        </div>
      </div>
      <RelatedProducts productName={product.name} />
    </>
  );
}
