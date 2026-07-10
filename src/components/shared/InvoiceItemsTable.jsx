import EditableField from "../EditableField";
import { Icons } from "../Icons";

export default function InvoiceItemsTable({
  invoice,
  onUpdateField,
  onUpdateNestedItem,
  onRemoveLineItem,
  onAddLineItem,
  activeCurrencySymbol,
  isExporting,
}) {
  return (
    <div className="mb-8 text-left">
      {/* --- SEGMENTED SCOPE CONTROLS PANEL (HIDDEN IN EXPORTS) --- */}
      {!isExporting && (
        <div className="no-print flex flex-col md:flex-row gap-4 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800/60 text-[11px] font-bold text-slate-500">
          {/* Tax Scope Segments */}
          <div className="space-y-1.5 flex-1">
            <span className="text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[10px]">
              Tax Allocation Scope
            </span>
            <div className="flex bg-slate-100 dark:bg-slate-900 p-0.5 rounded-xl border border-slate-200 dark:border-slate-800">
              {["none", "item", "subtotal"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => onUpdateField("taxScope", type)}
                  className={`flex-1 py-1 px-2.5 rounded-lg capitalize transition-all cursor-pointer ${
                    invoice.taxScope === type
                      ? "bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-xs font-extrabold"
                      : "hover:text-slate-900 dark:hover:text-slate-300 text-slate-400"
                  }`}
                >
                  {type === "none" ? "Off" : type === "item" ? "Per Item" : "On Subtotal"}
                </button>
              ))}
            </div>
          </div>

          {/* Discount Scope Segments */}
          <div className="space-y-1.5 flex-1">
            <span className="text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[10px]">
              Discount Allocation Scope
            </span>
            <div className="flex bg-slate-100 dark:bg-slate-900 p-0.5 rounded-xl border border-slate-200 dark:border-slate-800">
              {["none", "item", "subtotal"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => onUpdateField("discountScope", type)}
                  className={`flex-1 py-1 px-2.5 rounded-lg capitalize transition-all cursor-pointer ${
                    invoice.discountScope === type
                      ? "bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-xs font-extrabold"
                      : "hover:text-slate-900 dark:hover:text-slate-300 text-slate-400"
                  }`}
                >
                  {type === "none" ? "Off" : type === "item" ? "Per Item" : "On Subtotal"}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- TABLE LAYOUT STRUCTURAL WRAPPER --- */}
      <div className="w-full overflow-x-auto select-none">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="text-[10px] font-extrabold uppercase text-slate-400 border-b-2 border-slate-200 dark:border-slate-800 pb-2">
              <th className="py-2.5 pr-4">Item & Description</th>
              <th className="py-2.5 text-right w-24">Rate ({activeCurrencySymbol})</th>
              <th className="py-2.5 text-center w-16">Qty</th>

              {/* Conditional Column Headers with inline math type controls */}
              {invoice.taxScope === "item" && (
                <th className="py-2.5 text-center w-24">
                  <div className="flex items-center justify-center gap-1">
                    <EditableField
                      value={invoice.taxName || "Tax"}
                      onChange={(e) => onUpdateField("taxName", e.target.value)}
                      className="text-center font-extrabold text-slate-400 uppercase max-w-[50px] bg-transparent"
                      isExporting={isExporting}
                      placeholder="Tax"
                    />
                    {!isExporting && (
                      <select
                        value={invoice.taxType || "percentage"}
                        onChange={(e) => onUpdateField("taxType", e.target.value)}
                        className="no-print bg-transparent outline-none text-[9px] font-extrabold border border-slate-200 dark:border-slate-700 rounded px-0.5 cursor-pointer text-slate-500"
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
                        className="no-print bg-transparent outline-none text-[9px] font-extrabold border border-slate-200 dark:border-slate-700 rounded px-0.5 cursor-pointer text-slate-500"
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

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
            {invoice.items.map((item, idx) => {
              // --- ARCHITECTURAL RUNTIME CALCULATION ---
              const rawSub = (item.qty || 0) * (item.price || 0);
              const itemDiscVal = invoice.discountScope === "item" ? item.discount || 0 : 0;
              const rowDiscount =
                invoice.discountType === "flat" ? itemDiscVal : (rawSub * itemDiscVal) / 100;
              const rowSubtotal = rawSub - rowDiscount;

              const itemTaxVal = invoice.taxScope === "item" ? item.taxRate || 0 : 0;
              const rowTax =
                invoice.taxType === "flat" ? itemTaxVal : (rowSubtotal * itemTaxVal) / 100;
              const lineTotal = rowSubtotal + rowTax;

              return (
                <tr
                  key={idx}
                  className="group/item text-xs hover:bg-slate-50/40 dark:hover:bg-slate-900/20 transition-colors"
                >
                  <td className="py-3 pr-4 space-y-1">
                    <EditableField
                      value={item.name}
                      onChange={(e) => onUpdateNestedItem(idx, "name", e.target.value)}
                      className="w-full font-bold text-slate-800 dark:text-white text-[13px]"
                      placeholder="Item Title / Name"
                      isExporting={isExporting}
                    />
                    <EditableField
                      value={item.description}
                      onChange={(e) => onUpdateNestedItem(idx, "description", e.target.value)}
                      className="w-full text-slate-500 dark:text-slate-400 text-[11px]"
                      placeholder="Add specific description details..."
                      isExporting={isExporting}
                    />
                  </td>
                  <td className="py-3 text-right">
                    <EditableField
                      type="number"
                      step="0.01"
                      value={item.price}
                      onChange={(e) =>
                        onUpdateNestedItem(idx, "price", parseFloat(e.target.value) || 0)
                      }
                      className="w-full text-right font-bold text-slate-800 dark:text-white"
                      placeholder="0.00"
                      isExporting={isExporting}
                    />
                  </td>
                  <td className="py-3 text-center">
                    <EditableField
                      type="number"
                      value={item.qty}
                      onChange={(e) =>
                        onUpdateNestedItem(idx, "qty", parseInt(e.target.value) || 0)
                      }
                      className="w-full text-center font-bold text-slate-800 dark:text-white"
                      placeholder="1"
                      isExporting={isExporting}
                    />
                  </td>

                  {/* Item-level Custom Tax Cell */}
                  {invoice.taxScope === "item" && (
                    <td className="py-3 text-center font-semibold text-slate-700 dark:text-slate-300">
                      <div className="flex items-center justify-center">
                        {invoice.taxType === "flat" && (
                          <span className="text-[10px] text-slate-400 mr-0.5">
                            {activeCurrencySymbol}
                          </span>
                        )}
                        <EditableField
                          type="number"
                          value={item.taxRate}
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

                  {/* Item-level Custom Discount Cell */}
                  {invoice.discountScope === "item" && (
                    <td className="py-3 text-center font-semibold text-slate-700 dark:text-slate-300">
                      <div className="flex items-center justify-center">
                        {invoice.discountType === "flat" && (
                          <span className="text-[10px] text-slate-400 mr-0.5">
                            {activeCurrencySymbol}
                          </span>
                        )}
                        <EditableField
                          type="number"
                          value={item.discount}
                          onChange={(e) =>
                            onUpdateNestedItem(idx, "discount", parseFloat(e.target.value) || 0)
                          }
                          className="w-14 text-center text-rose-600 dark:text-rose-400"
                          placeholder="0"
                          isExporting={isExporting}
                        />
                        {invoice.discountType === "percentage" && (
                          <span className="text-[10px] text-slate-400 ml-0.5">%</span>
                        )}
                      </div>
                    </td>
                  )}

                  {/* Total Line Calculations Return */}
                  <td className="py-3 text-right font-bold text-slate-900 dark:text-white">
                    {activeCurrencySymbol}
                    {lineTotal.toFixed(2)}
                  </td>

                  {/* Row Delete Button Overlay */}
                  <td className="no-print py-3 text-center">
                    <button
                      type="button"
                      onClick={() => onRemoveLineItem(idx)}
                      className="opacity-0 group-hover/item:opacity-100 p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-all cursor-pointer"
                      title="Delete Row Item"
                    >
                      <Icons.Trash />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* --- ADD NEW ROW BUTTON TRIGGER --- */}
      {!isExporting && (
        <button
          type="button"
          onClick={onAddLineItem}
          className="no-print mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-400 transition-colors cursor-pointer shadow-xs select-none"
        >
          <Icons.Plus /> Add New Item Row
        </button>
      )}
    </div>
  );
}
