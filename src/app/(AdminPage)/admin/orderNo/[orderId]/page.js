"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import InvoiceDocument, { INVOICE_WIDTH_PX } from "@/components/admin/orders/InvoiceDocument";
import {
  Badge,
  Button,
  Card,
  CardBody,
  EmptyState,
  PageHeader,
  statusTone,
} from "@/components/admin/ui";
import { DEFAULT_SHIPPING_COST, ROUTES } from "@/config/constants";
import { notify } from "@/lib/toast";
import { isPending } from "@/store/create-request-slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchOrderById } from "@/store/slices/order.slice";

/** Invoice lines the backend does not send. */
const INVOICE = {
  shopName: "Leather For Luxury",
  shopAddress: "London, london-1230, England",
  paymentMethod: "Cash",
  shippingCost: DEFAULT_SHIPPING_COST,
  discount: 0,
};

const CAPTURE_ID = "invoice-document";

export default function AdminOrderPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = Array.isArray(params.orderId) ? params.orderId[0] : params.orderId;
  const dispatch = useAppDispatch();
  const [downloading, setDownloading] = useState(false);

  const orderState = useAppSelector((state) => state.orderById);
  const { order, error } = orderState;
  const busy = isPending(orderState);

  useEffect(() => {
    if (orderId) dispatch(fetchOrderById(orderId));
  }, [dispatch, orderId]);

  const fileName = order?.orderNumber ? `invoice-${order.orderNumber}.pdf` : "invoice.pdf";

  const downloadInvoice = async () => {
    const element = document.getElementById(CAPTURE_ID);
    if (!element) return;

    setDownloading(true);
    try {
      // Imported here so neither library is in the bundle for admins who never
      // download an invoice.
      const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
        import("jspdf"),
        import("html2canvas"),
      ]);

      // Rasterise the document at its own fixed width, then fit that bitmap to
      // the sheet. jsPDF's own .html() helper re-lays-out the node against the
      // live window, which is what made the output depend on the browser size
      // and clip the right-hand columns.
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
        windowWidth: INVOICE_WIDTH_PX,
        width: INVOICE_WIDTH_PX,
      });

      const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
      const margin = 24;
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const renderWidth = pageWidth - margin * 2;
      const renderHeight = (canvas.height / canvas.width) * renderWidth;
      const usableHeight = pageHeight - margin * 2;

      const image = canvas.toDataURL("image/png");

      if (renderHeight <= usableHeight) {
        pdf.addImage(image, "PNG", margin, margin, renderWidth, renderHeight);
      } else {
        // Taller than one sheet: shift the same image up a page at a time and
        // clip it with the page bounds, so a long order still prints in full.
        let remaining = renderHeight;
        let offset = 0;
        while (remaining > 0) {
          pdf.addImage(image, "PNG", margin, margin - offset, renderWidth, renderHeight);
          remaining -= usableHeight;
          offset += usableHeight;
          if (remaining > 0) pdf.addPage();
        }
      }

      pdf.save(fileName);
    } catch (err) {
      notify.error(err?.message ?? "Could not generate the invoice PDF");
    } finally {
      setDownloading(false);
    }
  };

  if (busy) {
    return (
      <>
        <PageHeader title="Invoice" />
        <Card className="min-h-0 flex-1 overflow-auto">
          <CardBody>
            <div className="space-y-3">
              {[...Array(8)].map((_, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <div key={i} className="h-5 w-full animate-pulse rounded bg-slate-200/70 dark:bg-slate-800" />
              ))}
            </div>
          </CardBody>
        </Card>
      </>
    );
  }

  if (error || !order) {
    return (
      <>
        <PageHeader title="Invoice" />
        <Card>
          <EmptyState
            title="Order not found"
            description={error || "This order may have been removed."}
            action={
              <Button variant="secondary" onClick={() => router.push(ROUTES.admin.orders)}>
                Back to orders
              </Button>
            }
          />
        </Card>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={order.orderNumber ? `Order #${order.orderNumber}` : "Order"}
        description={`${order.name ?? ""} · ${order.email ?? ""}`}
        actions={
          <div className="no-print flex flex-wrap items-center gap-2">
            <Badge tone={statusTone(order.status)}>{order.status}</Badge>
            <Button variant="secondary" onClick={() => router.push(ROUTES.admin.orders)}>
              Back
            </Button>
            <Button variant="secondary" onClick={() => window.print()}>
              Print
            </Button>
            <Button onClick={downloadInvoice} disabled={downloading}>
              {downloading ? "Preparing…" : "Download PDF"}
            </Button>
          </div>
        }
      />

      {/* The document keeps its A4 width; the wrapper scrolls on small screens
          rather than reflowing, so what you see is what the PDF contains. */}
      <Card className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="min-h-0 flex-1 overflow-auto p-4 sm:p-6">
          {/* print-area is what the print stylesheet keeps visible. */}
          <div className="print-area mx-auto w-fit shadow-sm ring-1 ring-slate-200 dark:ring-slate-700">
            <InvoiceDocument id={CAPTURE_ID} order={order} meta={INVOICE} />
          </div>
        </div>
      </Card>
    </>
  );
}
