import EditableField from "../EditableField/EditableField";
import { FIELD_LIMITS } from "../../constants/fieldLimits";
import { Icons } from "../shared/Icons";

export default function MobileItemsView({
  invoice,
  onUpdateField,
  onUpdateNestedItem,
  onRemoveLineItem,
  activeCurrencySymbol,
  isExporting,
}) {
  return (
    <div className="block md:hidden space-y-4 no-print">
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
          <div
            key={idx}
            className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3 relative group"
            data-testid="mobile-item-card"
          >
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Line Item #{idx + 1}
              </span>
              <button
                type="button"
                onClick={() => onRemoveLineItem(idx)}
                className="p-1 text-rose-500 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                title={`Delete Mobile Item ${idx + 1}`}
              >
                <Icons.Trash className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-1">
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
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                  Rate ({activeCurrencySymbol})
                </label>
                <EditableField
                  type="number"
                  step="0.01"
                  value={item.price === 0 ? "" : item.price}
                  min={0}
                  onChange={(e) =>
                    onUpdateNestedItem(idx, "price", parseFloat(e.target.value) || 0)
                  }
                  className="w-full font-bold text-slate-800 border border-slate-200/60 rounded-md px-2 py-1 bg-white"
                  placeholder="0.00"
                  isExporting={isExporting}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                  Qty
                </label>
                <EditableField
                  type="number"
                  value={item.qty === 0 ? "" : item.qty}
                  min={1}
                  onChange={(e) => onUpdateNestedItem(idx, "qty", parseInt(e.target.value) || 0)}
                  className="w-full font-bold text-slate-800 border border-slate-200/60 rounded-md px-2 py-1 bg-white text-center"
                  placeholder="1"
                  isExporting={isExporting}
                />
              </div>

              {invoice.taxScope === "item" && (
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <EditableField
                      value={invoice.taxName || "Tax"}
                      onChange={(e) => onUpdateField("taxName", e.target.value)}
                      maxLength={FIELD_LIMITS.taxName}
                      className="font-bold text-slate-400 uppercase text-[10px] max-w-[50px] bg-transparent"
                      placeholder="Tax"
                      isExporting={isExporting}
                    />
                    {!isExporting && (
                      <select
                        value={invoice.taxType || "percentage"}
                        onChange={(e) => onUpdateField("taxType", e.target.value)}
                        className="bg-slate-100 outline-none text-[8px] font-bold border border-slate-200 rounded px-1 py-0.5 cursor-pointer text-slate-500"
                      >
                        <option value="percentage">%</option>
                        <option value="flat">Amt</option>
                      </select>
                    )}
                  </div>
                  <div className="flex items-center border border-slate-200/60 rounded-md px-2 py-1 bg-white">
                    {invoice.taxType === "flat" && (
                      <span className="text-[11px] text-slate-400 mr-1">
                        {activeCurrencySymbol}
                      </span>
                    )}
                    <EditableField
                      type="number"
                      value={item.taxRate === 0 ? "" : item.taxRate}
                      onChange={(e) =>
                        onUpdateNestedItem(idx, "taxRate", parseFloat(e.target.value) || 0)
                      }
                      className="w-full font-semibold text-slate-700 text-center"
                      placeholder="0"
                      isExporting={isExporting}
                    />
                  </div>
                </div>
              )}

              {invoice.discountScope === "item" && (
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Disc</span>
                    {!isExporting && (
                      <select
                        value={invoice.discountType || "percentage"}
                        onChange={(e) => onUpdateField("discountType", e.target.value)}
                        className="bg-slate-100 outline-none text-[8px] font-bold border border-slate-200 rounded px-1 py-0.5 cursor-pointer text-slate-500"
                      >
                        <option value="percentage">%</option>
                        <option value="flat">Amt</option>
                      </select>
                    )}
                  </div>
                  <div className="flex items-center border border-slate-200/60 rounded-md px-2 py-1 bg-white">
                    {invoice.discountType === "flat" && (
                      <span className="text-[11px] text-rose-400 mr-1">{activeCurrencySymbol}</span>
                    )}
                    <EditableField
                      type="number"
                      value={item.discount === 0 ? "" : item.discount}
                      onChange={(e) =>
                        onUpdateNestedItem(idx, "discount", parseFloat(e.target.value) || 0)
                      }
                      className="w-full font-semibold text-rose-600 text-center"
                      placeholder="0"
                      isExporting={isExporting}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center bg-slate-100/50 p-2 rounded-lg text-xs border border-slate-200/20">
              <span className="font-bold text-slate-400 uppercase text-[10px]">Line Total:</span>
              <span className="font-black text-slate-900">
                {activeCurrencySymbol}
                {lineTotal.toFixed(2)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
