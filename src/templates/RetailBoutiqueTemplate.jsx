import { Icons } from "../components/Header";
import EditableField from "../components/EditableField";

export default function RetailBoutiqueTemplate({
  invoice,
  onUpdateField,
  onUpdateNestedItem,
  onRemoveLineItem,
  onAddLineItem,
  onLogoUpload,
  totals,
  activeCurrencySymbol,
  isExporting,
}) {
  return (
    <div className="p-8 max-w-170 mx-auto text-slate-900 font-mono text-xs">
      <div className="text-center space-y-2 mb-6">
        <div className="relative group/logo w-48 min-h-10 mx-auto flex items-center justify-center">
          <input
            type="file"
            id="logo-uploader-retail"
            accept="image/*"
            onChange={onLogoUpload}
            className="hidden"
          />
          {invoice.businessLogo ? (
            <div className="relative">
              <img
                src={invoice.businessLogo}
                alt="Logo"
                className="max-h-12 max-w-35 object-contain"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdateField("businessLogo", "");
                }}
                className="no-print absolute -top-2 -right-2 h-4 w-4 bg-rose-500 text-white rounded-full flex items-center justify-center text-[8px] font-bold"
              >
                ✕
              </button>
            </div>
          ) : (
            <label
              htmlFor="logo-uploader-retail"
              className="text-[10px] text-slate-400 hover:text-brand-500 flex items-center gap-1 cursor-pointer"
            >
              <Icons.Upload /> Upload Logo
            </label>
          )}
        </div>
        <EditableField
          value={invoice.businessName}
          onChange={(e) => onUpdateField("businessName", e.target.value)}
          className="w-full text-center text-base font-black uppercase tracking-wider block"
          placeholder="Boutique Name"
          isExporting={isExporting}
        />
        <EditableField
          type="textarea"
          value={invoice.businessAddress}
          onChange={(e) => onUpdateField("businessAddress", e.target.value)}
          rows="2"
          className="w-full text-center text-[10px] text-slate-600 leading-tight"
          placeholder="Address"
          isExporting={isExporting}
        />
        <div className="flex flex-col items-center justify-center text-[10px] text-slate-500 mt-1">
          <EditableField
            value={invoice.businessPhone}
            onChange={(e) => onUpdateField("businessPhone", e.target.value)}
            className="text-center w-48"
            placeholder="Phone"
            isExporting={isExporting}
          />
          <EditableField
            value={invoice.businessEmail}
            onChange={(e) => onUpdateField("businessEmail", e.target.value)}
            className="text-center w-48"
            placeholder="Email"
            isExporting={isExporting}
          />
        </div>
      </div>

      <div className="border-t border-dashed border-slate-300 my-4"></div>

      <div className="grid grid-cols-2 gap-4 text-[11px] text-slate-700 leading-relaxed mb-4">
        <div className="space-y-1">
          <div>
            <span className="font-bold">TRANSID: </span>
            <EditableField
              value={invoice.invoiceNumber}
              onChange={(e) => onUpdateField("invoiceNumber", e.target.value)}
              className="font-bold text-slate-900 inline-block w-24"
              placeholder="TRANS-001"
              isExporting={isExporting}
            />
          </div>
          <div>
            <span>DATE: </span>
            <EditableField
              type="date"
              value={invoice.issueDate}
              onChange={(e) => onUpdateField("issueDate", e.target.value)}
              className="inline-block w-24 text-slate-900"
              isExporting={isExporting}
            />
          </div>
          <div>
            <span>DUE: </span>
            <EditableField
              type="date"
              value={invoice.dueDate}
              onChange={(e) => onUpdateField("dueDate", e.target.value)}
              className="inline-block w-24 text-slate-900"
              isExporting={isExporting}
            />
          </div>
        </div>
        <div className="space-y-1 text-right">
          <div>
            <span>CLIENT: </span>
            <EditableField
              value={invoice.customerName}
              onChange={(e) => onUpdateField("customerName", e.target.value)}
              className="font-bold text-slate-900 text-right inline-block w-24"
              placeholder="Walk-in Guest"
              isExporting={isExporting}
            />
          </div>
          <div>
            <span>TAXID: </span>
            <EditableField
              value={invoice.businessTaxId}
              onChange={(e) => onUpdateField("businessTaxId", e.target.value)}
              className="text-right inline-block w-24"
              placeholder="Tax ID"
              isExporting={isExporting}
            />
          </div>
          <div>
            <span>TILL: </span>
            <span className="text-slate-900 font-bold">#01-FRONT</span>
          </div>
        </div>
      </div>

      <div className="border-t border-dashed border-slate-300 my-4"></div>

      <div className="mb-4">
        <table className="w-full text-left border-collapse text-[11px]">
          <thead>
            <tr className="border-b border-dashed border-slate-300">
              <th className="py-2">ITEM DESCRIPTION</th>
              <th className="py-2 text-center w-12">QTY</th>
              <th className="py-2 text-right w-20">RATE</th>
              <th className="py-2 text-right w-20">TOTAL</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dashed divide-slate-200">
            {invoice.items.map((item, idx) => {
              const rawSub = (item.qty || 0) * (item.price || 0);
              const rowDisc = (rawSub * (item.discount || 0)) / 100;
              const rowSubtotal = rawSub - rowDisc;
              const rowTax = (rowSubtotal * (item.taxRate || 0)) / 100;
              const lineTotal = rowSubtotal + rowTax;

              return (
                <tr key={idx} className="group/item">
                  <td className="py-2 pr-2">
                    <EditableField
                      value={item.name}
                      onChange={(e) => onUpdateNestedItem(idx, "name", e.target.value)}
                      className="w-full font-bold text-slate-900 text-[11px]"
                      placeholder="Item Service Title"
                      isExporting={isExporting}
                    />
                    {item.description && (
                      <EditableField
                        value={item.description}
                        onChange={(e) => onUpdateNestedItem(idx, "description", e.target.value)}
                        className="w-full text-slate-500 text-[9px]"
                        placeholder="Description"
                        isExporting={isExporting}
                      />
                    )}
                  </td>
                  <td className="py-2 text-center">
                    <EditableField
                      type="number"
                      value={item.qty}
                      onChange={(e) =>
                        onUpdateNestedItem(idx, "qty", parseInt(e.target.value) || 0)
                      }
                      className="w-full text-center font-bold text-slate-800"
                      placeholder="1"
                      isExporting={isExporting}
                    />
                  </td>
                  <td className="py-2 text-right">
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
                  <td className="py-2 text-right font-bold text-slate-900">
                    {activeCurrencySymbol}
                    {lineTotal.toFixed(2)}
                  </td>
                  <td className="no-print py-2 text-center w-6">
                    <button
                      onClick={() => onRemoveLineItem(idx)}
                      className="opacity-0 group-hover/item:opacity-100 p-1 text-rose-500 hover:bg-rose-50 rounded cursor-pointer"
                      title="Delete"
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
            className="no-print mt-3 flex items-center gap-1 px-2 py-1 bg-slate-50 border border-slate-200 rounded text-[10px] font-bold text-slate-600 cursor-pointer"
          >
            <Icons.Plus /> ADD RECEIPT LINE
          </button>
        )}
      </div>

      <div className="border-t border-dashed border-slate-300 my-4"></div>

      <div className="w-full text-[11px] text-slate-800 space-y-1 max-w-[280px] ml-auto">
        <div className="flex justify-between items-center">
          <span className="font-bold">GROSS TOTAL:</span>
          <span className="font-bold">
            {activeCurrencySymbol}
            {totals.subtotal.toFixed(2)}
          </span>
        </div>
        {(!isExporting || invoice.discountValue > 0) && (
          <div className="flex justify-between items-center">
            <span className="text-slate-500">DISCOUNT:</span>
            <div className="flex items-center gap-1">
              <EditableField
                type="number"
                value={invoice.discountValue}
                onChange={(e) => onUpdateField("discountValue", parseFloat(e.target.value) || 0)}
                className="w-12 text-right text-rose-600"
                isExporting={isExporting}
              />
              {!isExporting && <span className="text-[10px] text-slate-400">%</span>}
            </div>
          </div>
        )}
        {(!isExporting || totals.tax > 0) && (
          <div className="flex justify-between items-center">
            <span className="text-slate-500">{invoice.taxName.toUpperCase()} CHARGES:</span>
            <span className="font-semibold">
              {activeCurrencySymbol}
              {totals.tax.toFixed(2)}
            </span>
          </div>
        )}
        {(!isExporting || invoice.shippingCharges > 0) && (
          <div className="flex justify-between items-center">
            <span className="text-slate-500">SHIPPING/HANDLING:</span>
            <EditableField
              type="number"
              value={invoice.shippingCharges}
              onChange={(e) => onUpdateField("shippingCharges", parseFloat(e.target.value) || 0)}
              className="w-16 text-right text-slate-800"
              isExporting={isExporting}
            />
          </div>
        )}
        {(!isExporting || invoice.additionalCharges !== 0) && (
          <div className="flex justify-between items-center">
            <span className="text-slate-500">ROUNDING/ADJUST:</span>
            <EditableField
              type="number"
              value={invoice.additionalCharges}
              onChange={(e) => onUpdateField("additionalCharges", parseFloat(e.target.value) || 0)}
              className="w-16 text-right text-slate-800"
              isExporting={isExporting}
            />
          </div>
        )}
        {(!isExporting || invoice.amountPaid > 0) && (
          <div className="flex justify-between items-center">
            <span className="text-slate-500">AMOUNT TENDERED:</span>
            <EditableField
              type="number"
              value={invoice.amountPaid}
              onChange={(e) => onUpdateField("amountPaid", parseFloat(e.target.value) || 0)}
              className="w-16 text-right text-slate-800"
              isExporting={isExporting}
            />
          </div>
        )}
        <div className="border-t border-dashed border-slate-300 pt-2 flex justify-between items-center font-black text-xs text-slate-900">
          <span>BALANCE DUE:</span>
          <span className="text-sm" style={{ color: invoice.brandColor }}>
            {activeCurrencySymbol}
            {totals.balanceDue.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="border-t border-dashed border-slate-300 my-4"></div>

      <div className="text-center space-y-4">
        <div>
          <span className="font-bold block uppercase tracking-wider text-[9px] text-slate-500 mb-1">
            Payment Options
          </span>
          <EditableField
            type="textarea"
            value={invoice.paymentInstructions}
            onChange={(e) => onUpdateField("paymentInstructions", e.target.value)}
            rows="3"
            className="w-full text-center text-[10px] text-slate-500"
            placeholder="Payment methods info"
            isExporting={isExporting}
          />
        </div>
        <div>
          <EditableField
            type="textarea"
            value={invoice.notes}
            onChange={(e) => onUpdateField("notes", e.target.value)}
            rows="2"
            className="w-full text-center text-slate-600 leading-tight font-semibold"
            placeholder="Thank you notes"
            isExporting={isExporting}
          />
        </div>
        <div className="border-t border-dashed border-slate-200/60 pt-3">
          <span className="text-[9px] text-slate-400 block tracking-wider">
            Generated for free using Invoice Now
          </span>
        </div>
      </div>
    </div>
  );
}
