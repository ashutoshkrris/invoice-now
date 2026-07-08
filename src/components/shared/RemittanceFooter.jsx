import EditableField from "../EditableField";

export default function RemittanceFooter({ invoice, onUpdateField, isExporting }) {
  return (
    <div className="mt-12 pt-8 border-t border-slate-150 flex flex-col gap-6 text-[11px] text-slate-400 leading-relaxed font-sans">
      <div>
        <h4 className="font-extrabold text-[9px] uppercase tracking-wider text-slate-500 mb-1.5">
          Payment Methods & Details
        </h4>
        <EditableField
          type="textarea"
          value={invoice.paymentInstructions}
          onChange={(e) => onUpdateField("paymentInstructions", e.target.value)}
          rows="3"
          className="w-full text-slate-500 leading-relaxed"
          placeholder="Add bank accounts, wire transfer instructions, check details or digital payment links here..."
          isExporting={isExporting}
        />
      </div>

      <div className="text-center pt-4 border-t border-slate-100/40">
        <span className="text-[10px] font-medium tracking-wide text-slate-300 dark:text-slate-600 block">
          Generated for free using <span className="font-bold text-slate-400/80">Invoice Now</span>
        </span>
      </div>
    </div>
  );
}
