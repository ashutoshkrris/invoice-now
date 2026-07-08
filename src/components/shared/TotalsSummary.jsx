import EditableField from "../EditableField";

export default function TotalsSummary({
  invoice,
  onUpdateField,
  totals,
  activeCurrencySymbol,
  isExporting,
}) {
  return (
    <div className="grid grid-cols-12 gap-6 mt-8 border-t border-slate-100 pt-6">
      <div className="col-span-12 sm:col-span-7 space-y-4 text-xs">
        <div>
          <p className="font-extrabold text-[9px] uppercase tracking-wider text-slate-400 mb-1">
            Additional Terms / Instructions
          </p>
          <EditableField
            type="textarea"
            value={invoice.terms}
            onChange={(e) => onUpdateField("terms", e.target.value)}
            rows="3"
            className="w-full text-slate-500 leading-relaxed"
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
            rows="2"
            className="w-full text-slate-500 leading-relaxed"
            placeholder="It was great doing business with you."
            isExporting={isExporting}
          />
        </div>
      </div>

      <div className="col-span-12 sm:col-span-5 text-xs text-slate-600 space-y-2 max-w-sm ml-auto w-full">
        <div className="flex justify-between items-center py-0.5">
          <span className="font-bold text-slate-400 uppercase text-[10px]">Gross Subtotal</span>
          <span className="font-bold text-slate-900">
            {activeCurrencySymbol}
            {totals.subtotal.toFixed(2)}
          </span>
        </div>

        {(!isExporting || invoice.discountValue > 0) && (
          <div className="flex justify-between items-center gap-2 py-0.5">
            <div className="flex items-center gap-1">
              <span className="font-bold text-slate-400 uppercase text-[10px]">Discount</span>
              {!isExporting && (
                <select
                  value={invoice.discountType}
                  onChange={(e) => onUpdateField("discountType", e.target.value)}
                  className="no-print bg-transparent outline-none text-[10px] font-bold border border-slate-200 rounded px-1 cursor-pointer"
                >
                  <option value="percentage">%</option>
                  <option value="flat">Amt</option>
                </select>
              )}
            </div>
            <div className="flex items-center justify-end text-right">
              <EditableField
                type="number"
                value={invoice.discountValue}
                onChange={(e) => onUpdateField("discountValue", parseFloat(e.target.value) || 0)}
                className="w-16 text-right text-rose-600 font-bold"
                isExporting={isExporting}
              />
            </div>
          </div>
        )}

        {(!isExporting || totals.tax > 0) && (
          <div className="flex justify-between items-center py-0.5">
            <span className="font-bold text-slate-400 uppercase text-[10px]">
              {invoice.taxName} Sum
            </span>
            <span className="font-bold text-slate-900">
              {activeCurrencySymbol}
              {totals.tax.toFixed(2)}
            </span>
          </div>
        )}

        {(!isExporting || invoice.shippingCharges > 0) && (
          <div className="flex justify-between items-center py-0.5">
            <span className="font-bold text-slate-400 uppercase text-[10px]">
              Logistics / Shipping
            </span>
            <EditableField
              type="number"
              value={invoice.shippingCharges}
              onChange={(e) => onUpdateField("shippingCharges", parseFloat(e.target.value) || 0)}
              className="w-24 text-right font-semibold text-slate-900"
              isExporting={isExporting}
            />
          </div>
        )}

        {(!isExporting || invoice.additionalCharges !== 0) && (
          <div className="flex justify-between items-center py-0.5">
            <span className="font-bold text-slate-400 uppercase text-[10px]">Adjustments</span>
            <EditableField
              type="number"
              value={invoice.additionalCharges}
              onChange={(e) => onUpdateField("additionalCharges", parseFloat(e.target.value) || 0)}
              className="w-24 text-right font-semibold text-slate-900"
              isExporting={isExporting}
            />
          </div>
        )}

        {(!isExporting || invoice.amountPaid > 0) && (
          <div className="flex justify-between items-center py-0.5">
            <span className="font-bold text-slate-400 uppercase text-[10px]">Amount Paid Off</span>
            <EditableField
              type="number"
              value={invoice.amountPaid}
              onChange={(e) => onUpdateField("amountPaid", parseFloat(e.target.value) || 0)}
              className="w-24 text-right font-semibold text-slate-900"
              isExporting={isExporting}
            />
          </div>
        )}

        <div className="flex justify-between items-center border-t-2 border-slate-200 pt-3 text-sm font-black text-slate-900">
          <span>Balance Due</span>
          <span className="text-lg" style={{ color: invoice.brandColor }}>
            {activeCurrencySymbol}
            {totals.balanceDue.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
