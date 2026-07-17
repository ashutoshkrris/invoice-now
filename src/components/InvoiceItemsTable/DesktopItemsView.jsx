import EditableField from "../EditableField/EditableField";
import { FIELD_LIMITS } from "../../constants/fieldLimits";
import { Icons } from "../shared/Icons";

export default function DesktopItemsView({
  invoice,
  onUpdateField,
  onUpdateNestedItem,
  onRemoveLineItem,
  activeCurrencySymbol,
  isExporting,
}) {
  return (
    <table className="w-full text-left border-collapse min-w-[600px]">
      <thead>
        <tr className="text-[10px] font-extrabold uppercase text-slate-400 border-b-2 border-slate-200 pb-2">
          <th className="py-2.5 pr-4">Item & Description</th>
          <th className="py-2.5 text-right w-24">Rate ({activeCurrencySymbol})</th>
          <th className="py-2.5 text-center w-16">Qty</th>

          {invoice.taxScope === "item" && (
            <th className="py-2.5 text-center w-24">
              <div className="flex items-center justify-center gap-1">
                <EditableField
                  value={invoice.taxName || "Tax"}
                  onChange={(e) => onUpdateField("taxName", e.target.value)}
                  maxLength={FIELD_LIMITS.taxName}
                  className="text-center font-extrabold text-slate-400 uppercase max-w-[50px] bg-transparent"
                  isExporting={isExporting}
                  placeholder="Tax"
                />
                {!isExporting && (
                  <select
                    value={invoice.taxType || "percentage"}
                    onChange={(e) => onUpdateField("taxType", e.target.value)}
                    className="no-print bg-transparent outline-none text-[9px] font-extrabold border border-slate-200 rounded px-0.5 cursor-pointer text-slate-500"
                    aria-label="Table Tax Type"
                  >
                    <option value="percentage">%</option>
                    <option value="flat">Amt</option>
                  </select>
                )}
              </div>
            </th>
          )}

          {invoice.discountScope === "item" && (
            <th className="py-2.5 text-center w-24">
              <div className="flex items-center justify-center gap-1">
                <span>Disc</span>
                {!isExporting && (
                  <select
                    value={invoice.discountType || "percentage"}
                    onChange={(e) => onUpdateField("discountType", e.target.value)}
                    className="no-print bg-transparent outline-none text-[9px] font-extrabold border border-slate-200 rounded px-0.5 cursor-pointer text-slate-500"
                    aria-label="Table Discount Type"
                  >
                    <option value="percentage">%</option>
                    <option value="flat">Amt</option>
                  </select>
                )}
              </div>
            </th>
          )}

          <th className="py-2.5 text-right w-24">Amount</th>
          <th className="no-print py-2.5 text-center w-10"></th>
        </tr>
      </thead>

      <tbody className="divide-y divide-slate-100">
        {invoice.items.map((item, idx) => {
          const rawSub = (item.qty || 0) * (item.price || 0);
          const itemDiscVal = invoice.discountScope === "item" ? item.discount || 0 : 0;
          const rowDiscount =
            invoice.discountType === "flat" ? itemDiscVal : (rawSub * itemDiscVal) / 100;
          const rowSubtotal = rawSub - rowDiscount;

          const itemTaxVal = invoice.taxScope === "item" ? item.taxRate || 0 : 0;
          const rowTax = invoice.taxType === "flat" ? itemTaxVal : (rowSubtotal * itemTaxVal) / 100;
          const lineTotal = rowSubtotal + rowTax;

          return (
            <tr key={idx} className="group/item text-xs hover:bg-slate-50/40 transition-colors">
              <td className="py-3 pr-4 space-y-1">
                <EditableField
                  value={item.name}
                  onChange={(e) => onUpdateNestedItem(idx, "name", e.target.value)}
                  maxLength={FIELD_LIMITS.itemName}
                  className="w-full font-bold text-slate-800 text-[13px]"
                  placeholder="Item Title / Name"
                  isExporting={isExporting}
                />
                <EditableField
                  value={item.description}
                  onChange={(e) => onUpdateNestedItem(idx, "description", e.target.value)}
                  maxLength={FIELD_LIMITS.itemDescription}
                  className="w-full text-slate-500 text-[11px]"
                  placeholder="Add specific description details..."
                  isExporting={isExporting}
                />
              </td>
              <td className="py-3 text-right">
                <EditableField
                  type="number"
                  step="0.01"
                  value={item.price === 0 ? "" : item.price}
                  min={0}
                  onChange={(e) =>
                    onUpdateNestedItem(idx, "price", parseFloat(e.target.value) || 0)
                  }
                  className="w-full text-right font-bold text-slate-800"
                  placeholder="0.00"
                  isExporting={isExporting}
                />
              </td>
              <td className="py-3 text-center">
                <EditableField
                  type="number"
                  value={item.qty === 0 ? "" : item.qty}
                  onChange={(e) => onUpdateNestedItem(idx, "qty", parseInt(e.target.value) || 0)}
                  min={1}
                  className="w-full text-center font-bold text-slate-800"
                  placeholder="1"
                  isExporting={isExporting}
                />
              </td>

              {invoice.taxScope === "item" && (
                <td className="py-3 text-center font-semibold text-slate-700">
                  <div className="flex items-center justify-center">
                    {invoice.taxType === "flat" && (
                      <span className="text-[10px] text-slate-400 mr-0.5">
                        {activeCurrencySymbol}
                      </span>
                    )}
                    <EditableField
                      type="number"
                      value={item.taxRate === 0 ? "" : item.taxRate}
                      onChange={(e) =>
                        onUpdateNestedItem(idx, "taxRate", parseFloat(e.target.value) || 0)
                      }
                      className="w-14 text-center"
                      placeholder="0"
                      isExporting={isExporting}
                    />
                    {invoice.taxType === "percentage" && (
                      <span className="text-[10px] text-slate-400 ml-0.5">%</span>
                    )}
                  </div>
                </td>
              )}

              {invoice.discountScope === "item" && (
                <td className="py-3 text-center font-semibold text-slate-700">
                  <div className="flex items-center justify-center">
                    {invoice.discountType === "flat" && (
                      <span className="text-[10px] text-slate-400 mr-0.5">
                        {activeCurrencySymbol}
                      </span>
                    )}
                    <EditableField
                      type="number"
                      value={item.discount === 0 ? "" : item.discount}
                      onChange={(e) =>
                        onUpdateNestedItem(idx, "discount", parseFloat(e.target.value) || 0)
                      }
                      className="w-14 text-center text-rose-600"
                      placeholder="0"
                      isExporting={isExporting}
                    />
                    {invoice.discountType === "percentage" && (
                      <span className="text-[10px] text-slate-400 ml-0.5">%</span>
                    )}
                  </div>
                </td>
              )}

              <td className="py-3 text-right font-bold text-slate-900">
                {activeCurrencySymbol}
                {lineTotal.toFixed(2)}
              </td>

              <td className="no-print py-3 text-center">
                <button
                  type="button"
                  onClick={() => onRemoveLineItem(idx)}
                  className="opacity-0 group-hover/item:opacity-100 p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                  title={`Delete Desktop Item ${idx + 1}`}
                >
                  <Icons.Trash />
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
