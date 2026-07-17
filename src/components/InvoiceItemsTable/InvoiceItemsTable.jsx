import DesktopItemsView from "./DesktopItemsView";
import MobileItemsView from "./MobileItemsView";
import { Icons } from "../shared/Icons";

export default function InvoiceItemsTable({
  invoice,
  onUpdateField,
  onUpdateNestedItem,
  onRemoveLineItem,
  onAddLineItem,
  activeCurrencySymbol,
  isExporting,
}) {
  const childProps = {
    invoice,
    onUpdateField,
    onUpdateNestedItem,
    onRemoveLineItem,
    activeCurrencySymbol,
    isExporting,
  };

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
                  className={`flex-1 py-1 px-2.5 rounded-lg capitalize transition-all cursor-pointer text-center ${
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
                  className={`flex-1 py-1 px-2.5 rounded-lg capitalize transition-all cursor-pointer text-center ${
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

      {/* 1. Mobile card render loop layer */}
      <MobileItemsView {...childProps} />

      {/* 2. Traditional table desktop print layer */}
      <div className="hidden md:block print:block w-full overflow-x-auto">
        <DesktopItemsView {...childProps} />
      </div>

      {/* --- ADD NEW ROW BUTTON TRIGGER --- */}
      {!isExporting && (
        <button
          type="button"
          onClick={onAddLineItem}
          className="no-print mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 transition-colors cursor-pointer shadow-xs select-none"
        >
          <Icons.Plus /> Add New Item Row
        </button>
      )}
    </div>
  );
}
