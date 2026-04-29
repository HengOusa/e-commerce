import { jsPDF } from "jspdf";
import "jspdf-autotable";
import QRCode from "qrcode";

/* ─── Helpers ─── */
const formatDate = (iso) => {
  if (!iso) return "N/A";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatCurrency = (value) => {
  const num = Number(value) || 0;
  return `$${num.toFixed(2)}`;
};

const getItemFinalPrice = (item) =>
  (item.unit_price || 0) * (1 - (item.discount_percent || 0) / 100);

const getItemTotal = (item) => getItemFinalPrice(item) * (item.qty || 1);

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "delivered":
      return [34, 197, 94]; // green
    case "shipped":
    case "out_for_delivery":
      return [59, 130, 246]; // blue
    case "confirmed":
      return [99, 102, 241]; // indigo
    case "cancelled":
      return [239, 68, 68]; // red
    default:
      return [107, 114, 128]; // gray
  }
};

/* ─── Download / View / Print ─── */
const triggerDownload = (doc, filename) => {
  try {
    const pdfBlob = doc.output("blob");
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  } catch (e) {
    console.warn("Blob download failed, falling back to doc.save():", e);
    try {
      doc.save(filename);
      return true;
    } catch (e2) {
      console.error("doc.save() also failed:", e2);
      return false;
    }
  }
};

/* ─── Main Invoice Builder (async for QR) ─── */
const createInvoiceDoc = async (order) => {
  try {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 40;
    const contentWidth = pageWidth - margin * 2;

    const primaryColor = [22, 163, 74]; // Ousa green
    const darkText = [31, 41, 55];
    const grayText = [107, 114, 128];
    const borderColor = [229, 231, 235];

    /* ═════════════════════════════════════
       1. HEADER (Professional Two-Row)
       ═════════════════════════════════════ */
    // Top accent bar
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, pageWidth, 6, "F");

    // Company block (left)
    let headY = 30;
    doc.setFontSize(26);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...primaryColor);
    doc.text("OUSA", margin, headY);

    headY += 18;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...grayText);
    doc.text("Your Trusted Online Marketplace", margin, headY);

    headY += 14;
    doc.setFontSize(9);
    doc.text("Phnom Penh, Cambodia", margin, headY);
    headY += 12;
    doc.text("support@ousa.com  |  +855 12 345 678", margin, headY);

    // Invoice title block (right, top)
    doc.setFontSize(28);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...darkText);
    doc.text("INVOICE", pageWidth - margin, 30, { align: "right" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...grayText);
    const invMetaY = 52;
    doc.text(`Invoice #: INV-${order.id}`, pageWidth - margin, invMetaY, {
      align: "right",
    });
    doc.text(
      `Date: ${formatDate(order.createdAt)}`,
      pageWidth - margin,
      invMetaY + 14,
      { align: "right" },
    );
    doc.text(
      `Due Date: ${formatDate(order.deliveryDate || order.createdAt)}`,
      pageWidth - margin,
      invMetaY + 28,
      { align: "right" },
    );

    // Status chip
    const statusText = (order.status || "placed").toUpperCase();
    const statusRGB = getStatusColor(order.status);
    const statusW = doc.getTextWidth(statusText) + 14;
    const statusX = pageWidth - margin - statusW;
    const statusY = invMetaY + 42;
    doc.setFillColor(...statusRGB);
    doc.roundedRect(statusX, statusY - 10, statusW, 18, 4, 4, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(statusText, pageWidth - margin - statusW / 2, statusY + 2, {
      align: "center",
    });

    /* ═════════════════════════════════════
       2. BILLING & SHIPPING (Two Column)
       ═════════════════════════════════════ */
    let infoY = 120;
    const col1X = margin;
    const col2X = pageWidth / 2 + 10;

    // Divider line
    doc.setDrawColor(...borderColor);
    doc.setLineWidth(0.5);
    doc.line(margin, infoY - 8, pageWidth - margin, infoY - 8);

    // Section: Billed To
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...darkText);
    doc.text("BILLED TO", col1X, infoY);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(75, 85, 99);
    const customer = order.customer || {};
    let cY = infoY + 16;
    doc.text(
      `${customer.firstName || ""} ${customer.lastName || ""}`.trim() ||
        "Guest Customer",
      col1X,
      cY,
    );
    cY += 14;
    doc.text(customer.address || "—", col1X, cY);
    cY += 14;
    doc.text(
      `${customer.city || ""}${customer.city && customer.postalCode ? ", " : ""}${customer.postalCode || ""}`,
      col1X,
      cY,
    );
    cY += 14;
    doc.text(customer.country || "Cambodia", col1X, cY);
    cY += 14;
    doc.text(`Email: ${customer.email || "N/A"}`, col1X, cY);
    cY += 14;
    doc.text(`Phone: ${customer.phone || "N/A"}`, col1X, cY);

    // Section: Shipped To
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...darkText);
    doc.text("SHIPPED TO", col2X, infoY);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(75, 85, 99);
    let sY = infoY + 16;
    const shipping = order.shippingAddress || customer;
    doc.text(
      `${shipping.firstName || customer.firstName || ""} ${shipping.lastName || customer.lastName || ""}`.trim(),
      col2X,
      sY,
    );
    sY += 14;
    doc.text(shipping.address || customer.address || "—", col2X, sY);
    sY += 14;
    doc.text(
      `${shipping.city || customer.city || ""}${(shipping.city || customer.city) && (shipping.postalCode || customer.postalCode) ? ", " : ""}${shipping.postalCode || customer.postalCode || ""}`,
      col2X,
      sY,
    );
    sY += 14;
    doc.text(shipping.country || customer.country || "Cambodia", col2X, sY);
    sY += 14;
    doc.text(
      `Method: ${order.deliveryMethod?.label || "Standard Delivery"}`,
      col2X,
      sY,
    );
    sY += 14;
    doc.text(
      `Est. Delivery: ${formatDate(order.estimatedDelivery || order.deliveryDate)}`,
      col2X,
      sY,
    );

    /* ═════════════════════════════════════
       3. ITEMS TABLE
       ═════════════════════════════════════ */
    const tableHead = [
      [
        { content: "#", styles: { halign: "center" } },
        { content: "Item", styles: { halign: "left" } },
        { content: "Shop", styles: { halign: "left" } },
        { content: "Qty", styles: { halign: "center" } },
        { content: "Unit Price", styles: { halign: "right" } },
        { content: "Discount", styles: { halign: "center" } },
        { content: "Total", styles: { halign: "right" } },
      ],
    ];

    const tableBody = (order.items || []).map((item, idx) => [
      { content: idx + 1, styles: { halign: "center" } },
      { content: item.name || "Untitled", styles: { halign: "left" } },
      { content: item.shop || "—", styles: { halign: "left" } },
      { content: item.qty || 1, styles: { halign: "center" } },
      {
        content: formatCurrency(item.unit_price || 0),
        styles: { halign: "right" },
      },
      {
        content:
          (item.discount_percent || 0) > 0 ? `${item.discount_percent}%` : "—",
        styles: { halign: "center" },
      },
      {
        content: formatCurrency(getItemTotal(item)),
        styles: { halign: "right" },
      },
    ]);

    const tableStartY = Math.max(cY, sY) + 20;

    doc.autoTable({
      startY: tableStartY,
      head: tableHead,
      body: tableBody,
      theme: "grid",
      headStyles: {
        fillColor: primaryColor,
        textColor: 255,
        fontStyle: "bold",
        fontSize: 10,
        valign: "middle",
        cellPadding: { top: 8, right: 8, bottom: 8, left: 8 },
      },
      bodyStyles: {
        fontSize: 10,
        textColor: 55,
        cellPadding: { top: 7, right: 8, bottom: 7, left: 8 },
      },
      alternateRowStyles: { fillColor: [249, 250, 251] },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: "auto" },
        2: { cellWidth: 80 },
        3: { cellWidth: 40 },
        4: { cellWidth: 70 },
        5: { cellWidth: 60 },
        6: { cellWidth: 70 },
      },
      margin: { left: margin, right: margin },
      styles: {
        overflow: "linebreak",
        lineWidth: 0.5,
        lineColor: borderColor,
      },
    });

    const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 20 : 500;

    /* ═════════════════════════════════════
       4. QR CODE (Async generation)
       ═════════════════════════════════════ */
    // Generate QR with rich order verification data
    const qrPayload = JSON.stringify({
      invoice: `INV-${order.id}`,
      orderId: order.id,
      total: order.total || 0,
      status: order.status || "placed",
      date: order.createdAt,
      verifyUrl: `https://ousa.com/verify/invoice/${order.id}`,
    });

    let qrDataUrl = null;
    try {
      qrDataUrl = await QRCode.toDataURL(qrPayload, {
        width: 200,
        margin: 1,
        color: {
          dark: "#166534",
          light: "#ffffff",
        },
      });
    } catch (qrErr) {
      console.warn("QR code generation failed:", qrErr);
    }

    /* ═════════════════════════════════════
       5. TOTALS SECTION (Right aligned)
       ═════════════════════════════════════ */
    const totalsX = pageWidth - margin - 200;
    let tY = finalY;

    const drawTotalRow = (label, value, isBold = false, isAccent = false) => {
      doc.setFont("helvetica", isBold ? "bold" : "normal");
      if (isAccent) {
        doc.setTextColor(...primaryColor);
      } else {
        doc.setTextColor(isBold ? 31 : 75, isBold ? 41 : 85, isBold ? 55 : 99);
      }
      doc.setFontSize(isBold ? 12 : 10);
      doc.text(label, totalsX, tY);
      doc.text(value, pageWidth - margin, tY, { align: "right" });
      tY += isBold ? 24 : 18;
    };

    // Draw totals box background
    const boxY = finalY - 14;
    const boxH = 110;
    doc.setFillColor(249, 250, 251);
    doc.roundedRect(totalsX - 10, boxY, 210, boxH, 6, 6, "F");

    drawTotalRow("Subtotal:", formatCurrency(order.subtotal || 0));
    drawTotalRow(
      "Shipping:",
      (order.shipping || 0) === 0 ? "Free" : formatCurrency(order.shipping),
    );
    if ((order.tax || 0) > 0) {
      drawTotalRow(`Tax (${order.taxRate || 0}%):`, formatCurrency(order.tax));
    }
    if ((order.discount || 0) > 0) {
      drawTotalRow("Discount:", `-${formatCurrency(order.discount)}`);
    }
    drawTotalRow("Grand Total:", formatCurrency(order.total || 0), true, true);

    /* ═════════════════════════════════════
       6. QR CODE & PAYMENT BLOCK
       ═════════════════════════════════════ */
    let qrY = finalY;
    const qrSize = 80;

    // QR Code (left side, beside totals)
    if (qrDataUrl) {
      doc.addImage(qrDataUrl, "PNG", margin, qrY, qrSize, qrSize);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...primaryColor);
      doc.text("SCAN TO VERIFY", margin + qrSize / 2, qrY + qrSize + 12, {
        align: "center",
      });
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...grayText);
      doc.text(
        "Order Tracking & Payment",
        margin + qrSize / 2,
        qrY + qrSize + 24,
        {
          align: "center",
        },
      );
    }

    // Payment info
    const payY = qrY + qrSize + 40;
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...darkText);
    doc.text("PAYMENT INFORMATION", margin, payY);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(75, 85, 99);
    doc.text(
      `Method: ${order.paymentMethod?.label || "Cash on Delivery"}`,
      margin,
      payY + 14,
    );
    doc.text(`Status: ${order.paymentStatus || "Pending"}`, margin, payY + 26);
    if (order.transactionId) {
      doc.text(`Transaction ID: ${order.transactionId}`, margin, payY + 38);
    }

    /* ═════════════════════════════════════
       7. NOTES & TERMS
       ═════════════════════════════════════ */
    let noteY = Math.max(tY, payY + 50) + 10;
    doc.setDrawColor(...borderColor);
    doc.setLineWidth(0.5);
    doc.line(margin, noteY, pageWidth - margin, noteY);

    noteY += 16;
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...darkText);
    doc.text("NOTES & TERMS", margin, noteY);

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(75, 85, 99);
    const notes = [
      "Thank you for shopping with OUSA! We appreciate your business.",
      "For returns, please contact our customer service within 7 days of delivery.",
      "This invoice serves as proof of purchase and may be required for warranty claims.",
    ];
    let nY = noteY + 14;
    notes.forEach((note) => {
      doc.text(`\u2022 ${note}`, margin, nY);
      nY += 12;
    });

    /* ═════════════════════════════════════
       8. SIGNATURE SECTION
       ═════════════════════════════════════ */
    let signY = nY + 20;
    doc.setDrawColor(75, 85, 99);
    doc.setLineWidth(0.5);

    const signWidth = 140;
    // Left: Authorized Signature
    doc.line(margin, signY, margin + signWidth, signY);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(75, 85, 99);
    doc.text("Authorized Signature", margin, signY + 14);

    // Right: Customer Signature
    doc.line(pageWidth - margin - signWidth, signY, pageWidth - margin, signY);
    doc.text("Customer Signature", pageWidth - margin, signY + 14, {
      align: "right",
    });

    /* ═════════════════════════════════════
       9. FOOTER
       ═════════════════════════════════════ */
    const footerY = pageHeight - 30;
    doc.setDrawColor(...borderColor);
    doc.setLineWidth(0.5);
    doc.line(margin, footerY - 10, pageWidth - margin, footerY - 10);

    doc.setFontSize(8);
    doc.setTextColor(156, 163, 175);
    doc.setFont("helvetica", "italic");
    doc.text(
      "Thank you for shopping with OUSA! Questions? Contact support@ousa.com",
      pageWidth / 2,
      footerY,
      { align: "center" },
    );
    doc.setFontSize(7);
    doc.text(
      `Page 1 of 1  |  Invoice generated on ${new Date().toLocaleString("en-US")}`,
      pageWidth / 2,
      footerY + 12,
      { align: "center" },
    );

    return doc;
  } catch (err) {
    console.error("Failed to build invoice:", err);
    throw err;
  }
};

/* ═════════════════════════════════════
   EXPORTED API (all async for QR support)
   ═════════════════════════════════════ */
export const generateInvoicePDF = async (order) => {
  try {
    const doc = await createInvoiceDoc(order);
    return triggerDownload(doc, `Invoice-${order.id}.pdf`);
  } catch (err) {
    console.error("Failed to generate invoice:", err);
    return false;
  }
};

export const viewInvoicePDF = async (order) => {
  try {
    const doc = await createInvoiceDoc(order);
    const url = doc.output("bloburl");
    window.open(url, "_blank");
    return true;
  } catch (err) {
    console.error("Failed to view invoice:", err);
    return false;
  }
};

export const printInvoicePDF = async (order) => {
  try {
    const doc = await createInvoiceDoc(order);
    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "none";
    iframe.src = url;
    iframe.onload = () => {
      iframe.contentWindow?.print();
      setTimeout(() => {
        if (iframe.parentNode) {
          document.body.removeChild(iframe);
        }
        URL.revokeObjectURL(url);
      }, 1000);
    };
    document.body.appendChild(iframe);
    return true;
  } catch (err) {
    console.error("Failed to print invoice:", err);
    return false;
  }
};
