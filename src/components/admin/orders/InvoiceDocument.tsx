import { formatMoney } from "@/lib/utils";
import type { Order } from "@/types/order";

export const INVOICE_WIDTH_PX = 794; // A4 at 96dpi

export interface InvoiceMeta {
  shopName: string;
  shopAddress: string;
  paymentMethod: string;
  shippingCost: number;
  discount: number;
}

/**
 * The printable invoice.
 *
 * Fixed width and always light, on purpose. The PDF used to be rasterised from
 * the responsive on-screen markup at a hardcoded scale, so the page it produced
 * depended on the browser window — on a wide screen the right-hand columns fell
 * off the sheet. Capturing a fixed A4-proportioned node instead makes the
 * output identical at every viewport, and keeps a dark-mode dashboard from
 * printing white text onto white paper.
 */
export default function InvoiceDocument({
  order,
  meta,
  id,
}: {
  order: Order & Record<string, unknown>;
  meta: InvoiceMeta;
  id?: string;
}) {
  const items = order.orderItems ?? [];
  const subtotal = items.reduce((sum, item) => {
    const product = item.product as unknown as { discountedPrice?: number } | string;
    const price = typeof product === "object" ? Number(product?.discountedPrice ?? 0) : 0;
    return sum + price * Number(item.quantity ?? 0);
  }, 0);

  const cell = "px-4 py-3 text-[13px]";

  return (
    <div
      id={id}
      style={{ width: INVOICE_WIDTH_PX }}
      className="print-doc bg-white p-10 font-sans text-slate-900"
    >
      <div className="flex items-start justify-between border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-xl font-bold uppercase tracking-wide">Invoice</h2>
          <p className="mt-2 text-[11px] uppercase tracking-wider text-slate-500">
            Status
            <span className="ml-2 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold normal-case tracking-normal text-slate-700">
              {order.status}
            </span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-base font-semibold">{meta.shopName}</p>
          <p className="mt-1 text-[13px] text-slate-500">{meta.shopAddress}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 pt-5">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Date</p>
          <p className="mt-1 text-[13px] text-slate-700">
            {order.dateOrdered
              ? new Date(order.dateOrdered).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : "—"}
          </p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Order no
          </p>
          <p className="mt-1 text-[13px] font-semibold text-slate-900">
            {order.orderNumber ? `#${order.orderNumber}` : `#${order._id}`}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Invoice to
          </p>
          <p className="mt-1 text-[13px] leading-relaxed text-slate-700">
            {order.name}
            <br />
            {order.email}
            <br />
            {order.shippingAddress}
            <br />
            {[order.city, order.country, order.zip].filter(Boolean).join(", ")}
          </p>
        </div>
      </div>

      <table className="mt-8 w-full border-collapse overflow-hidden rounded-lg">
        <thead>
          <tr className="bg-slate-100 text-[11px] uppercase tracking-wider text-slate-600">
            <th className={`${cell} w-12 text-left font-semibold`}>Sr.</th>
            <th className={`${cell} text-left font-semibold`}>Product</th>
            <th className={`${cell} text-center font-semibold`}>Qty</th>
            <th className={`${cell} text-right font-semibold`}>Price</th>
            <th className={`${cell} text-right font-semibold`}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => {
            const product = item.product as unknown as
              | { name?: string; discountedPrice?: number }
              | string;
            const name = typeof product === "object" ? product?.name : "Product";
            const price = typeof product === "object" ? Number(product?.discountedPrice ?? 0) : 0;
            const qty = Number(item.quantity ?? 0);
            return (
              <tr key={`${index}-${name}`} className="border-b border-slate-100">
                <td className={`${cell} text-slate-500`}>{index + 1}</td>
                <td className={`${cell} font-medium`}>
                  {name}
                  {item.color && <span className="ml-2 text-slate-400">({item.color})</span>}
                </td>
                <td className={`${cell} text-center`}>{qty}</td>
                <td className={`${cell} text-right`}>{formatMoney(price)}</td>
                <td className={`${cell} text-right font-semibold`}>{formatMoney(price * qty)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="mt-8 flex justify-between gap-8 rounded-lg bg-slate-50 p-6">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Payment method
          </p>
          <p className="mt-1 text-[13px] text-slate-700">{meta.paymentMethod}</p>
        </div>
        <div className="text-right">
          <div className="flex justify-between gap-10 text-[13px] text-slate-600">
            <span>Subtotal</span>
            <span>{formatMoney(subtotal)}</span>
          </div>
          <div className="mt-1.5 flex justify-between gap-10 text-[13px] text-slate-600">
            <span>Shipping</span>
            <span>{formatMoney(meta.shippingCost)}</span>
          </div>
          {meta.discount > 0 && (
            <div className="mt-1.5 flex justify-between gap-10 text-[13px] text-slate-600">
              <span>Discount</span>
              <span>-{formatMoney(meta.discount)}</span>
            </div>
          )}
          <div className="mt-3 flex justify-between gap-10 border-t border-slate-200 pt-3">
            <span className="text-sm font-semibold">Total</span>
            <span className="text-base font-bold">{formatMoney(order.totalPrice ?? 0)}</span>
          </div>
        </div>
      </div>

      <p className="mt-8 text-center text-[11px] text-slate-400">
        Thank you for shopping with {meta.shopName}.
      </p>
    </div>
  );
}
