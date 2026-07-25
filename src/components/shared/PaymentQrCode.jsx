import { QRCodeSVG } from "qrcode.react";
import { getFormattedUriForPayment } from "../../utils/utils";

export default function PaymentQrCode({ invoice, totals, size = 80, className = "" }) {
  const rawPaymentLink = invoice?.paymentLink;
  if (!rawPaymentLink || !rawPaymentLink.trim()) return null;

  const qrUri = getFormattedUriForPayment(rawPaymentLink, invoice, totals);

  return (
    <div
      className={`flex flex-col items-center justify-center p-2 bg-white border border-slate-200 rounded-lg shadow-2xs ${className}`}
    >
      <QRCodeSVG value={qrUri} size={size} level="M" includeMargin={false} />
      <span className="text-[8px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
        Scan to Pay
      </span>
    </div>
  );
}
