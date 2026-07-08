import EditableField from "../EditableField";
import { Icons } from "../Icons";

export default function InvoiceItemsTable({
  invoice,
  onUpdateNestedItem,
  onRemoveLineItem,
  onAddLineItem,
  activeCurrencySymbol,
  isExporting,
}) {
  return (
    <div className="mb-8">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-[10px] font-extrabold uppercase text-slate-400 border-b-2 border-slate-200 pb-2">
            <th className="py-2.5">Item & Description</th>
            <th className="py-2.5 text-right w-24">Rate ({activeCurrencySymbol})</th>
            <th className="py-2.5 text-center w-16">Qty</th>
            <th className="py-2.5 text-center w-16">{invoice.taxName} %</th>
            <th className="py-2.5 text-center w-16">Disc %</th>
            <th className="py-2.5 text-right w-24">Amount</th>
            <th className="no-print py-2.5 text-center w-10"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {invoice.items.map((item, idx) => {
            const rawSub = (item.qty || 0) * (item.price || 0);
            const rowDisc = (rawSub * (item.discount || 0)) / 100;
            const rowSubtotal = rawSub - rowDisc;
            const rowTax = (rowSubtotal * (item.taxRate || 0)) / 100;
            const lineTotal = rowSubtotal + rowTax;

            return (
              <tr key={idx} className="group/item text-xs">
                <td className="py-3 pr-4 space-y-1">
                  <EditableField
                    value={item.name}
                    onChange={(e) => onUpdateNestedItem(idx, "name", e.target.value)}
                    className="w-full font-bold text-slate-800 text-[13px]"
                    placeholder="Item Title"
                    isExporting={isExporting}
                  />
                  <EditableField
                    value={item.description}
                    onChange={(e) => onUpdateNestedItem(idx, "description", e.target.value)}
                    className="w-full text-slate-500 text-[11px]"
                    placeholder="Add specific description..."
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
                    className="w-full text-right font-bold text-slate-800"
                    placeholder="0.00"
                    isExporting={isExporting}
                  />
                </td>
                <td className="py-3 text-center">
                  <EditableField
                    type="number"
                    value={item.qty}
                    onChange={(e) => onUpdateNestedItem(idx, "qty", parseInt(e.target.value) || 0)}
                    className="w-full text-center font-bold text-slate-800"
                    placeholder="1"
                    isExporting={isExporting}
                  />
                </td>
                <td className="py-3 text-center">
                  <EditableField
                    type="number"
                    value={item.taxRate}
                    onChange={(e) =>
                      onUpdateNestedItem(idx, "taxRate", parseInt(e.target.value) || 0)
                    }
                    className="w-full text-center text-slate-600"
                    placeholder="0"
                    isExporting={isExporting}
                  />
                </td>
                <td className="py-3 text-center">
                  <EditableField
                    type="number"
                    value={item.discount}
                    onChange={(e) =>
                      onUpdateNestedItem(idx, "discount", parseInt(e.target.value) || 0)
                    }
                    className="w-full text-center text-slate-600"
                    placeholder="0"
                    isExporting={isExporting}
                  />
                </td>
                <td className="py-3 text-right font-bold text-slate-900">
                  {activeCurrencySymbol}
                  {lineTotal.toFixed(2)}
                </td>
                <td className="no-print py-3 text-center">
                  <button
                    onClick={() => onRemoveLineItem(idx)}
                    className="opacity-0 group-hover/item:opacity-100 p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                    title="Delete Line"
                  >
                    <Icons.Trash />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {!isExporting && (
        <button
          onClick={onAddLineItem}
          className="no-print mt-4 flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-400 transition-colors cursor-pointer"
        >
          <Icons.Plus /> Add New Item Row
        </button>
      )}
    </div>
  );
}
