import EditableField from "../EditableField";
import { FIELD_LIMITS } from "../../constants/fieldLimits";

export default function TotalsSummary({
  invoice,
  onUpdateField,
  totals,
  activeCurrencySymbol,
  isExporting,
}) {
  // Determine if there are active discounts or taxes to show during export
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
      <div className="col-span-12 sm:col-span-5 text-xs text-slate-600 space-y-2.5 max-w-sm ml-auto w-full order-1 sm:order-2 select-none">
        {/* 1. Subtotal */}
        <div className="flex justify-between items-center py-0.5">
          <span className="font-bold text-slate-400 uppercase text-[10px]">Subtotal</span>
          <span className="font-bold text-slate-900">
            {activeCurrencySymbol}{" "}
            {(
              totals.subtotal + (invoice.discountScope === "subtotal" ? totals.discount : 0)
            ).toFixed(2)}
          </span>
        </div>

        {/* 2. Discount */}
        {invoice.discountScope !== "none" && (!isExporting || hasDiscount) && (
          <div className="flex justify-between items-center py-0.5 min-h-[24px]">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-400 uppercase text-[10px]">Discount</span>
              {invoice.discountScope === "subtotal" && !isExporting && (
                <select
                  value={invoice.discountType || "percentage"}
                  onChange={(e) => onUpdateField("discountType", e.target.value)}
                  className="no-print bg-slate-50 outline-none text-[9px] font-bold border border-slate-200 rounded px-1 py-0.5 cursor-pointer text-slate-500 transition-colors"
                >
                  <option value="percentage">%</option>
                  <option value="flat">Amt</option>
                </select>
              )}
            </div>
            <div className="flex items-center justify-end text-right font-bold text-rose-600">
              {invoice.discountScope === "subtotal" ? (
                <div className="flex items-center justify-end">
                  {invoice.discountType === "flat" && (
                    <span className="text-[11px] mr-0.5">{activeCurrencySymbol}</span>
                  )}
                  <EditableField
                    type="number"
                    value={invoice.globalDiscount}
                    onChange={(e) =>
                      onUpdateField("globalDiscount", parseFloat(e.target.value) || 0)
                    }
                    className="w-16 text-right text-rose-600 font-bold bg-transparent"
                    placeholder="0"
                    isExporting={isExporting}
                  />
                  {invoice.discountType === "percentage" && (
                    <span className="text-[11px] ml-0.5">%</span>
                  )}
                </div>
              ) : (
                <span>
                  -{activeCurrencySymbol} {totals.discount.toFixed(2)}
                </span>
              )}
            </div>
          </div>
        )}

        {/* 3. Tax */}
        {invoice.taxScope !== "none" && (!isExporting || hasTax) && (
          <div className="flex justify-between items-center py-0.5 min-h-[24px]">
            <div className="flex items-center gap-1.5">
              <EditableField
                value={invoice.taxName || "Tax"}
                onChange={(e) => onUpdateField("taxName", e.target.value)}
                maxLength={FIELD_LIMITS.taxName}
                className="font-bold text-slate-400 uppercase text-[10px] max-w-[65px] bg-transparent"
                placeholder="Tax"
                isExporting={isExporting}
              />
              {invoice.taxScope === "subtotal" && !isExporting && (
                <select
                  value={invoice.taxType || "percentage"}
                  onChange={(e) => onUpdateField("taxType", e.target.value)}
                  className="no-print bg-slate-50 outline-none text-[9px] font-bold border border-slate-200 rounded px-1 py-0.5 cursor-pointer text-slate-500 transition-colors"
                >
                  <option value="percentage">%</option>
                  <option value="flat">Amt</option>
                </select>
              )}
            </div>
            <div className="flex items-center justify-end text-right font-bold text-slate-900">
              {invoice.taxScope === "subtotal" ? (
                <div className="flex items-center justify-end">
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
                    className="w-16 text-right font-bold text-slate-900 bg-transparent"
                    placeholder="0"
                    isExporting={isExporting}
                  />
                  {invoice.taxType === "percentage" && (
                    <span className="text-[11px] text-slate-400 ml-0.5">%</span>
                  )}
                </div>
              ) : (
                <span>
                  {activeCurrencySymbol} {totals.tax.toFixed(2)}
                </span>
              )}
            </div>
          </div>
        )}

        {/* 4. Shipping Charges */}
        {invoice.shippingCharges !== null &&
        invoice.shippingCharges !== undefined &&
        (invoice.shippingCharges > 0 ||
          typeof invoice.shippingCharges === "number" ||
          isExporting) ? (
          <div className="flex justify-between items-center py-0.5">
            <span className="font-bold text-slate-400 uppercase text-[10px]">Shipping</span>
            <div className="flex items-center justify-end text-right group/shipping">
              <span className="text-[10px] text-slate-400 mr-0.5">{activeCurrencySymbol}</span>
              <input
                type="number"
                // Ensure that backspacing empty doesn't pass undefined values to uncontrolled inputs
                value={
                  invoice.shippingCharges === 0 || !invoice.shippingCharges
                    ? ""
                    : invoice.shippingCharges
                }
                min={0}
                onChange={(e) => {
                  const val = e.target.value;
                  // Allows input to be completely blank while typing without snapping shut
                  if (val === "") {
                    onUpdateField("shippingCharges", 0);
                  } else {
                    onUpdateField("shippingCharges", parseFloat(val) || 0);
                  }
                }}
                className="w-20 text-right font-semibold text-slate-900 bg-transparent outline-none focus:ring-1 focus:ring-brand-500 rounded px-1"
                placeholder="0.00"
              />
              {!isExporting && (
                <button
                  type="button"
                  // Explicitly sets it to null or undefined to clear it out and bring back the button selector
                  onClick={() => onUpdateField("shippingCharges", null)}
                  className="no-print ml-1 text-slate-300 hover:text-rose-500 text-[10px] font-bold transition-colors cursor-pointer"
                  title="Remove shipping charges panel"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        ) : (
          !isExporting && (
            <div className="no-print flex justify-between items-center py-0.5">
              <button
                type="button"
                // Initializes with exactly 0 so the input stays visible, rather than forcing a value of 1
                onClick={() => onUpdateField("shippingCharges", 0)}
                className="text-[10px] font-extrabold text-brand-600 hover:underline transition-all cursor-pointer"
              >
                + Add Shipping Charges
              </button>
              <span className="text-slate-300 font-medium text-[11px] select-none">—</span>
            </div>
          )
        )}

        {/* 5. Total (Grand Total) */}
        <div className="flex justify-between items-center py-1.5 border-t border-slate-100 font-bold text-slate-900">
          <span className="uppercase text-[10px] tracking-wider text-slate-400">Total</span>
          <span className="text-sm">
            {activeCurrencySymbol} {totals.grandTotal.toFixed(2)}
          </span>
        </div>

        {/* 6. Amount Paid */}
        {(!isExporting || invoice.amountPaid > 0) && (
          <div className="flex justify-between items-center py-0.5">
            <span className="font-bold text-slate-400 uppercase text-[10px]">Amount Paid</span>
            <div className="flex items-center justify-end text-right">
              <span className="text-[10px] text-slate-400 mr-0.5">{activeCurrencySymbol}</span>
              <EditableField
                type="number"
                value={invoice.amountPaid === 0 || !invoice.amountPaid ? "" : invoice.amountPaid}
                min={0}
                onChange={(e) => onUpdateField("amountPaid", parseFloat(e.target.value) || 0)}
                className="w-20 text-right font-semibold text-slate-900 bg-transparent"
                placeholder="0.00"
                isExporting={isExporting}
              />
            </div>
          </div>
        )}

        {/* 7. Balance Due */}
        <div className="flex justify-between items-center border-t-2 border-slate-200 pt-3 text-sm font-black text-slate-900">
          <span>Balance Due</span>
          <span className="text-lg" style={{ color: invoice.brandColor || "inherit" }}>
            {activeCurrencySymbol} {totals.balanceDue.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
