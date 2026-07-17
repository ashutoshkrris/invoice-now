import EditableField from "../EditableField/EditableField";
import { FIELD_LIMITS } from "../../constants/fieldLimits";

export default function TotalsSummary({
  invoice,
  onUpdateField,
  totals,
  activeCurrencySymbol,
  isExporting,
}) {
  // Determine if there are active discounts or taxes to show during export layouts
  const hasDiscount = totals.discount > 0 || invoice.globalDiscount > 0;
  const hasTax = totals.tax > 0 || invoice.globalTaxRate > 0;

  return (
    <div className="grid grid-cols-12 gap-6 mt-8 border-t border-slate-100 pt-6">
      {/* --- LEFT HAND SECTION: TERMS & NOTES --- */}
      <div className="col-span-12 sm:col-span-7 space-y-4 text-xs order-2 sm:order-1 text-left">
        <div>
          <p className="font-extrabold text-[9px] uppercase tracking-wider text-slate-400 mb-1">
            Additional Terms / Instructions
          </p>
          <EditableField
            type="textarea"
            value={invoice.terms}
            onChange={(e) => onUpdateField("terms", e.target.value)}
            maxLength={FIELD_LIMITS.terms}
            showCount={true}
            rows="3"
            className="w-full text-slate-500 leading-relaxed bg-transparent"
            placeholder="Please make the payment by the due date."
            isExporting={isExporting}
          />
        </div>
        <div>
          <p className="font-extrabold text-[9px] uppercase tracking-wider text-slate-400 mb-1">
            Customer Notes
          </p>
          <EditableField
            type="textarea"
            value={invoice.notes}
            onChange={(e) => onUpdateField("notes", e.target.value)}
            maxLength={FIELD_LIMITS.notes}
            showCount={true}
            rows="2"
            className="w-full text-slate-500 leading-relaxed bg-transparent"
            placeholder="It was great doing business with you."
            isExporting={isExporting}
          />
        </div>
      </div>

      {/* --- RIGHT HAND SECTION: CLEAN TOTALS STACK --- */}
      <div className="col-span-12 sm:col-span-5 text-xs text-slate-600 space-y-2.5 max-w-sm ml-auto w-full order-1 sm:order-2 select-none avoid-page-slice">
        {/* 1. Subtotal Row */}
        <div className="grid grid-cols-2 items-center py-0.5 w-full">
          <span className="font-bold text-slate-400 uppercase text-[10px] text-left">Subtotal</span>
          <span className="font-bold text-slate-900 text-right pr-6" data-testid="subtotal-display">
            {activeCurrencySymbol}
            {totals.subtotal.toFixed(2)}
          </span>
        </div>

        {/* 2. Discount Selection Row */}
        {invoice.discountScope !== "none" && (!isExporting || hasDiscount) && (
          <div className="grid grid-cols-2 items-center py-0.5 min-h-[24px] w-full">
            <div className="flex items-center gap-1.5 text-left h-full">
              <span className="font-bold text-slate-400 uppercase text-[10px]">Discount</span>
              {invoice.discountScope === "subtotal" && !isExporting && (
                <select
                  value={invoice.discountType || "percentage"}
                  onChange={(e) => onUpdateField("discountType", e.target.value)}
                  className="no-print bg-slate-50 outline-none text-[9px] font-bold border border-slate-200 rounded px-1 py-0.5 cursor-pointer text-slate-500 transition-colors"
                  aria-label="Discount Type"
                >
                  <option value="percentage">%</option>
                  <option value="flat">Amt</option>
                </select>
              )}
            </div>

            <div
              className="flex items-center justify-end text-right font-bold text-rose-600 w-full pr-6"
              data-testid="discount-display-container"
            >
              {invoice.discountScope === "subtotal" ? (
                <div className="inline-flex items-center justify-end whitespace-nowrap">
                  {invoice.discountType === "flat" && (
                    <span className="text-[11px] self-center">{activeCurrencySymbol}</span>
                  )}
                  <EditableField
                    type="number"
                    value={invoice.globalDiscount}
                    onChange={(e) =>
                      onUpdateField("globalDiscount", parseFloat(e.target.value) || 0)
                    }
                    className={`${isExporting ? "w-auto text-right" : "w-14 text-right"} text-rose-600 font-bold bg-transparent p-0 border-0 focus:ring-0`}
                    placeholder="0"
                    isExporting={isExporting}
                  />
                  {invoice.discountType === "percentage" && (
                    <span className="text-[11px] self-center ml-0.5">%</span>
                  )}
                </div>
              ) : (
                <span>
                  -{activeCurrencySymbol}
                  {totals.discount.toFixed(2)}
                </span>
              )}
            </div>
          </div>
        )}

        {/* 3. Tax Rate Row */}
        {invoice.taxScope !== "none" && (!isExporting || hasTax) && (
          <div className="grid grid-cols-2 items-center py-0.5 min-h-[24px] w-full">
            <div className="flex items-center gap-1.5 text-left">
              <EditableField
                value={invoice.taxName || "Tax"}
                onChange={(e) => onUpdateField("taxName", e.target.value)}
                maxLength={FIELD_LIMITS.taxName}
                className="font-bold text-slate-400 uppercase text-[10px] max-w-[65px] bg-transparent p-0 border-0 focus:ring-0"
                placeholder="Tax"
                isExporting={isExporting}
              />
              {invoice.taxScope === "subtotal" && !isExporting && (
                <select
                  value={invoice.taxType || "percentage"}
                  onChange={(e) => onUpdateField("taxType", e.target.value)}
                  className="no-print bg-slate-50 outline-none text-[9px] font-bold border border-slate-200 rounded px-1 py-0.5 cursor-pointer text-slate-500 transition-colors"
                  aria-label="Tax Type"
                >
                  <option value="percentage">%</option>
                  <option value="flat">Amt</option>
                </select>
              )}
            </div>

            <div
              className="flex items-center justify-end text-right font-bold text-slate-900 w-full pr-6"
              data-testid="tax-display-container"
            >
              {invoice.taxScope === "subtotal" ? (
                <div className="inline-flex items-center justify-end whitespace-nowrap">
                  {invoice.taxType === "flat" && (
                    <span className="text-[11px] text-slate-400 mr-0.5">
                      {activeCurrencySymbol}
                    </span>
                  )}
                  <EditableField
                    type="number"
                    value={invoice.globalTaxRate}
                    onChange={(e) =>
                      onUpdateField("globalTaxRate", parseFloat(e.target.value) || 0)
                    }
                    className={`${isExporting ? "w-auto text-right" : "w-14 text-right"} font-bold text-slate-900 bg-transparent p-0 border-0 focus:ring-0`}
                    placeholder="0"
                    isExporting={isExporting}
                  />
                  {invoice.taxType === "percentage" && (
                    <span className="text-[11px] text-slate-400 ml-0.5">%</span>
                  )}
                </div>
              ) : (
                <span>
                  {activeCurrencySymbol}
                  {totals.tax.toFixed(2)}
                </span>
              )}
            </div>
          </div>
        )}

        {/* 4. Shipping Charges Row */}
        {invoice.shippingCharges !== null &&
        invoice.shippingCharges !== undefined &&
        (invoice.shippingCharges > 0 ||
          typeof invoice.shippingCharges === "number" ||
          isExporting) ? (
          <div className="grid grid-cols-2 items-center py-0.5 w-full relative">
            <span className="font-bold text-slate-400 uppercase text-[10px] text-left">
              Shipping
            </span>
            <div className="flex items-center justify-end text-right w-full relative pr-6">
              <div className="inline-flex items-center justify-end whitespace-nowrap">
                <span className="text-[10px] text-slate-900 mr-0.5">{activeCurrencySymbol}</span>
                <EditableField
                  type="number"
                  value={
                    invoice.shippingCharges === 0 || !invoice.shippingCharges
                      ? ""
                      : invoice.shippingCharges
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "") {
                      onUpdateField("shippingCharges", 0);
                    } else {
                      onUpdateField("shippingCharges", parseFloat(val) || 0);
                    }
                  }}
                  className={`${isExporting ? "w-auto text-right" : "w-14 text-right"} font-semibold text-slate-900 bg-transparent p-0 border-0 focus:ring-0`}
                  placeholder="0.00"
                  isExporting={isExporting}
                />
              </div>
              {!isExporting && (
                <button
                  type="button"
                  onClick={() => onUpdateField("shippingCharges", null)}
                  className="no-print absolute right-0 text-slate-300 hover:text-rose-500 text-[10px] font-bold transition-colors cursor-pointer w-4 text-center"
                  title="Remove shipping charges"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        ) : (
          !isExporting && (
            <div className="grid grid-cols-2 items-center py-0.5 w-full">
              <button
                type="button"
                onClick={() => onUpdateField("shippingCharges", 0)}
                className="text-[10px] font-extrabold text-brand-600 hover:underline transition-all cursor-pointer text-left"
              >
                + Add Shipping Charges
              </button>
              <span className="text-slate-300 font-medium text-[11px] select-none text-right pr-6">
                —
              </span>
            </div>
          )
        )}

        {/* 5. Grand Total Row */}
        <div className="grid grid-cols-2 items-center py-1.5 border-t border-slate-100 font-bold text-slate-900 w-full">
          <span className="uppercase text-[10px] tracking-wider text-slate-400 text-left">
            Total
          </span>
          <span className="text-sm text-right pr-6" data-testid="grand-total-display">
            {activeCurrencySymbol}
            {totals.grandTotal.toFixed(2)}
          </span>
        </div>

        {/* 6. Amount Paid Row */}
        {(!isExporting || invoice.amountPaid > 0) && (
          <div className="grid grid-cols-2 items-center py-0.5 w-full">
            <span className="font-bold text-slate-400 uppercase text-[10px] text-left">
              Amount Paid
            </span>
            <div className="flex items-center justify-end text-right w-full pr-6">
              <div className="inline-flex items-center justify-end whitespace-nowrap">
                <span className="text-[10px] text-slate-400 mr-0.5">{activeCurrencySymbol}</span>
                <EditableField
                  type="number"
                  value={invoice.amountPaid === 0 || !invoice.amountPaid ? "" : invoice.amountPaid}
                  min={0}
                  onChange={(e) => onUpdateField("amountPaid", parseFloat(e.target.value) || 0)}
                  className={`${isExporting ? "w-auto text-right" : "w-16 text-right"} font-semibold text-slate-900 bg-transparent p-0 border-0 focus:ring-0`}
                  placeholder="0.00"
                  isExporting={isExporting}
                />
              </div>
            </div>
          </div>
        )}

        {/* 7. Balance Due Row */}
        <div className="grid grid-cols-2 items-center border-t-2 border-slate-200 pt-3 text-sm font-black text-slate-900 w-full">
          <span className="text-left">Balance Due</span>
          <span
            className="text-lg text-right pr-6"
            style={{ color: invoice.brandColor || "inherit" }}
            data-testid="balance-due-display"
          >
            {activeCurrencySymbol}
            {totals.balanceDue.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
