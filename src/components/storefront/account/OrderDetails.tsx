import { DEFAULT_SHIPPING_COST, SHIPPING_OPTIONS } from "@/config/constants";
import { formatDate, formatMoney } from "@/lib/utils";
import type { Order, OrderItem } from "@/types/order";
import type { Product } from "@/types/product";

/**
 * One order summary for both places it is shown:
 *  - `variant="account"`  → /myAccount/viewOrder/[id]
 *  - `variant="received"` → /checkout/orderReceived/[id]
 * The two used to be copy-pasted components with different hardcoded shipping
 * and different currency symbols.
 */

export type OrderDetailsVariant = "account" | "received";

interface OrderDetailsProps {
  order: Order;
  variant?: OrderDetailsVariant;
}

interface OrderLine {
  key: string;
  name: string;
  quantity: number;
  color: string;
  lineTotal: number;
}

const asProduct = (product: OrderItem["product"]): Partial<Product> =>
  product && typeof product === "object" ? product : {};

function toLines(items: OrderItem[] | undefined): OrderLine[] {
  return (items ?? []).map((item, index) => {
    const product = asProduct(item.product);
    const price = Number(product.discountedPrice ?? 0);
    const quantity = Number(item.quantity ?? 0);
    return {
      key: item._id ?? `${product.id ?? product._id ?? "item"}-${index}`,
      name: product.name ?? "",
      quantity,
      color: item.color ?? "",
      lineTotal: price * quantity,
    };
  });
}

/** The order's real shipping cost when it can be derived, else the default. */
function shippingFor(order: Order, subtotal: number): number {
  const derived = Number(order.totalPrice ?? 0) - subtotal;
  return Number.isFinite(derived) && derived > 0 ? derived : DEFAULT_SHIPPING_COST;
}

const shippingLabel = (cost: number): string | null =>
  SHIPPING_OPTIONS.find((option) => option.cost === cost)?.label ?? null;

export default function OrderDetails({ order, variant = "account" }: OrderDetailsProps) {
  const lines = toLines(order?.orderItems);
  const subtotal = lines.reduce((total, line) => total + line.lineTotal, 0);
  const shipping = shippingFor(order, subtotal);
  const label = shippingLabel(shipping);

  if (variant === "received") {
    return (
      <div className="max-w-3xl mx-auto p-6">
        {/* Success Message */}
        <div className="border-2 border-dashed border-green-600 p-4 mb-8 text-center">
          <h1 className="text-green-600 text-xl">Thank you. Your order has been received.</h1>
        </div>

        {/* Order Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 bg-gray-50 text-center">
            <div className="text-sm text-gray-600">Order number:</div>
            <div className="font-medium text-xs break-words">#{order?._id}</div>
          </div>
          <div className="p-4 bg-gray-50 text-center">
            <div className="text-sm text-gray-600">Date:</div>
            <div className="font-medium text-xs"> {formatDate(order?.dateOrdered)}</div>
          </div>
          <div className="p-4 bg-gray-50 text-center">
            <div className="text-sm text-gray-600">Total:</div>
            <div className="font-medium"> {formatMoney(order?.totalPrice)}</div>
          </div>
          <div className="p-4 bg-gray-50 text-center">
            <div className="text-sm text-gray-600">Payment method:</div>
            <div className="font-medium">Cash on delivery</div>
          </div>
        </div>

        <p className="text-gray-600 mb-8">Pay with cash upon delivery.</p>

        {/* Order Details Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-6">ORDER DETAILS</h2>

          <div className="border-t border-gray-200">
            <div className="flex justify-between py-4 border-b border-gray-200">
              <div className="text-gray-600">PRODUCT</div>
              <div className="text-gray-600">TOTAL</div>
            </div>

            {lines.map((line) => (
              <div key={line.key} className="flex justify-between py-4 border-b border-gray-200">
                <div>
                  <div>
                    {line.name} × {line.quantity}
                  </div>
                  <div className="text-sm text-gray-600">Color: {line.color}</div>
                </div>
                <div> {formatMoney(line.lineTotal)}</div>
              </div>
            ))}

            <div className="flex justify-between py-4 border-b border-gray-200">
              <div>Subtotal:</div>
              <div>{formatMoney(subtotal)}</div>
            </div>

            <div className="flex justify-between py-4 border-b border-gray-200">
              <div>Shipping:</div>
              <div className="text-right">
                <div>{formatMoney(shipping)}</div>
                {label && <div className="text-sm text-gray-600">via {label}</div>}
              </div>
            </div>

            <div className="flex justify-between py-4 border-b border-gray-200">
              <div>Payment method:</div>
              <div>Cash on delivery</div>
            </div>

            <div className="flex justify-between py-4 font-semibold">
              <div>TOTAL:</div>
              <div>{formatMoney(order?.totalPrice)}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="right w-full md:w-2/3 lg:w-3/4  px-8 py-2.5">
      <div className="upper_text">
        <p className="text-gray-500 text-sm">
          Order <span className="text-black px-2 py-1.5 bg-gray-100 font-medium">#{order?._id}</span> was placed on{" "}
          <span className="text-black px-2 py-1.5 bg-gray-100 font-medium"> {formatDate(order?.dateOrdered)}</span> and
          is currently <span className="text-black px-2 py-1.5 bg-gray-100 font-medium">{order?.status}</span> .
        </p>
      </div>
      <div className="orderDetails mt-10">
        <div className="text mb-5">
          <p className="text-2xl txt-black">ORDER DETAILS</p>
        </div>

        <div className="productDetails mb-12">
          <div className="flex justify-between border-b border-gray-300">
            <div className="items ">
              <p className="px-2.5 py-4 font-regular ">PRODUCT</p>
            </div>
            <div className="total">
              <p className="px-2.5 py-4 font-regular ">TOTAL</p>
            </div>
          </div>

          {lines.map((line) => (
            <div key={line.key} className="flex justify-between border-b border-gray-300">
              <div className="items px-3 py-4 font-regular text-sm ">
                <p className="hover:text-gray-400 duration-300 cursor-pointer">
                  {line.name} × {line.quantity}
                </p>
                <p className="mt-2.5 text-gray-500 text-xs">
                  <span className="text-black text-sm">Color:</span>
                  {line.color}
                </p>
              </div>
              <div className="total flex items-center">
                <p className="px-3 py-4 font-regular text-sm text-gray-700"> {formatMoney(line.lineTotal)}</p>
              </div>
            </div>
          ))}

          <div className="flex justify-between border-b border-gray-300">
            <div className="items">
              <p className="px-3 py-4 font-regular text-sm">Subtotal:</p>
            </div>
            <div className="total flex items-center">
              <p className="px-3 py-4 font-regular text-sm text-gray-700"> {formatMoney(subtotal)}</p>
            </div>
          </div>
          <div className="flex justify-between border-b border-gray-300">
            <div className="items ">
              <p className="px-3 py-4 font-regular text-sm">Shipping:</p>
            </div>
            <div className="total flex items-center">
              <p className="px-3 py-4 font-regular text-xs text-gray-700">
                {" "}
                <span className="text-black text-sm">{formatMoney(shipping)} </span>
                {label ? `via ${label}` : null}
              </p>
            </div>
          </div>
          <div className="flex justify-between border-b border-gray-300">
            <div className="items ">
              <p className="px-3 py-4 font-regular text-sm">Payment Method:</p>
            </div>
            <div className="total flex items-center">
              <p className="px-3 py-4 font-regular text-sm text-gray-700"> Cash on delivery</p>
            </div>
          </div>

          <div className="flex justify-between border-b border-gray-300">
            <div className="items ">
              <p className="px-3 py-4 font-regular text-2xl">TOTAL:</p>
            </div>
            <div className="total flex items-center">
              <p className="px-3 py-4 font-regular text-2xl"> {formatMoney(order?.totalPrice)}</p>
            </div>
          </div>
        </div>

        <div className="text mb-5">
          <p className="text-2xl txt-black">BILLING ADDRESS</p>
        </div>
        <div className="details mb-5 text-sm space-y-2">
          <p className="text-gray-700">{order?.name}</p>
          <p className="text-gray-700">{order?.shippingAddress}</p>
          <p className="text-gray-700">{order?.city} </p>
          <p className="text-gray-700">{order?.phone}</p>
          <p className="text-gray-700">{order?.email}</p>
        </div>
      </div>
    </div>
  );
}
