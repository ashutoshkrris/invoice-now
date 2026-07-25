import EditableField from "../EditableField/EditableField";
import { FIELD_LIMITS } from "../../constants/fieldLimits";
import PaymentQrCode from "./PaymentQrCode";
import { isUpiId } from "../../utils/utils";

export default function RemittanceFooter({ invoice, totals, onUpdateField, isExporting }) {
  const hasQr = invoice.showQrCode && invoice.paymentLink && invoice.paymentLink.trim().length > 0;

  return (
    <div className="mt-12 pt-8 border-t border-slate-150 flex flex-col gap-6 text-[11px] text-slate-400 leading-relaxed font-sans avoid-page-slice">
      <div>
        <h4 className="font-extrabold text-[9px] uppercase tracking-wider text-slate-500 mb-1.5">
          Payment Methods & Details
        </h4>

        {/* Input Controls (Hidden during PDF/PNG Export) */}
        {!isExporting && (
          <div className="no-print space-y-3 mb-4 p-3 bg-slate-50/60 rounded-lg border border-slate-200/80">
            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-1">
                Direct Payment Link / UPI ID
              </label>
              <EditableField
                value={invoice.paymentLink || ""}
                onChange={(e) => onUpdateField("paymentLink", e.target.value)}
                maxLength={FIELD_LIMITS.paymentLink}
                className="w-full text-slate-700 bg-white"
                placeholder="Paste Stripe link, PayPal.me, Wise, or UPI ID (e.g. name@upi)"
                isExporting={isExporting}
              />
            </div>

            {invoice.paymentLink && invoice.paymentLink.trim() && (
              <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={invoice.showQrCode ?? true}
                  onChange={(e) => onUpdateField("showQrCode", e.target.checked)}
                  className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 h-3.5 w-3.5 cursor-pointer"
                />
                <span className="text-[10px] font-semibold text-slate-600">
                  Display QR code on invoice layout
                </span>
              </label>
            )}
          </div>
        )}

        {/* Layout Output (Rendered in Preview & Exports) */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="flex-1 w-full">
            <EditableField
              type="textarea"
              value={invoice.paymentInstructions || ""}
              onChange={(e) => onUpdateField("paymentInstructions", e.target.value)}
              maxLength={FIELD_LIMITS.paymentInstructions}
              showCount={true}
              rows="3"
              className="w-full text-slate-500 leading-relaxed"
              placeholder="Add bank accounts, wire transfer instructions, check details or notes here..."
              isExporting={isExporting}
            />

            {/* Clickable URL line rendered on invoice */}
            {invoice.paymentLink &&
              invoice.paymentLink.trim() &&
              (() => {
                const paymentLink = invoice.paymentLink.trim();
                const isUpi = isUpiId(paymentLink);

                return (
                  <div className="mt-2 text-[10px]">
                    {isUpi ? (
                      <>
                        <span className="font-semibold text-slate-500">
                          If the QR code doesn&apos;t work, pay via UPI:{" "}
                        </span>
                        <span className="font-bold text-slate-800 select-all">{paymentLink}</span>
                      </>
                    ) : (
                      <>
                        <div className="font-semibold text-slate-500">
                          If the QR code doesn&apos;t work, pay online:
                        </div>
                        <a
                          href={paymentLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block font-bold text-brand-600 hover:underline break-all"
                        >
                          {paymentLink}
                        </a>
                      </>
                    )}
                  </div>
                );
              })()}
          </div>

          {/* QR Code Block */}
          {hasQr && (
            <div className="shrink-0 self-center sm:self-start">
              <PaymentQrCode invoice={invoice} totals={totals} size={84} />
            </div>
          )}
        </div>
      </div>

      {/* Footer Branding */}
      <div className="text-center pt-4 border-t border-slate-100/40">
        <span className="text-[10px] font-medium tracking-wide text-slate-600 block">
          Generated for free using{" "}
          <a
            href="https://invoicenow.ashutoshkrris.in"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-slate-400/80 hover:text-brand-500 hover:underline transition-colors cursor-pointer"
          >
            Invoice Now
          </a>
        </span>
      </div>
    </div>
  );
}
