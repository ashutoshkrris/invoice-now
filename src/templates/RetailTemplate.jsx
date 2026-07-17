import { Icons } from "../components/shared/Icons";
import EditableField from "../components/EditableField/EditableField";
import { FIELD_LIMITS } from "../constants/fieldLimits";

export default function RetailTemplate({
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
    <div className="p-8 max-w-170 mx-auto text-slate-900 font-mono text-xs text-left spec-pdf-container">
      {/* SECTION wrapper to cleanly enforce unified header breaks */}
      <div className="avoid-page-slice">
        {/* --- BUSINESS BRANDING HEADER --- */}
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
                {!isExporting && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdateField("businessLogo", "");
                    }}
                    className="no-print absolute -top-2 -right-2 h-4 w-4 bg-rose-500 text-white rounded-full flex items-center justify-center text-[8px] font-bold cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>
            ) : !isExporting ? (
              <label
                htmlFor="logo-uploader-retail"
                className="text-[10px] text-slate-400 hover:text-brand-500 flex items-center gap-1 cursor-pointer select-none"
              >
                <Icons.Upload /> Upload Logo
              </label>
            ) : null}
          </div>
          <EditableField
            value={invoice.businessName}
            onChange={(e) => onUpdateField("businessName", e.target.value)}
            maxLength={FIELD_LIMITS.businessName}
            className="w-full text-center text-base font-black uppercase tracking-wider block bg-transparent"
            placeholder="Your / Company Name"
            isExporting={isExporting}
          />
          <EditableField
            type="textarea"
            value={invoice.businessAddress}
            onChange={(e) => onUpdateField("businessAddress", e.target.value)}
            maxLength={FIELD_LIMITS.businessAddress}
            rows="2"
            className="w-full text-center text-[10px] text-slate-600 leading-tight bg-transparent"
            placeholder="Your / Company Address"
            isExporting={isExporting}
          />
          <div className="flex flex-col items-center justify-center text-[10px] text-slate-500 mt-1">
            <EditableField
              value={invoice.businessPhone}
              onChange={(e) => onUpdateField("businessPhone", e.target.value)}
              maxLength={FIELD_LIMITS.businessPhone}
              className="text-center w-48 bg-transparent"
              placeholder="Phone Number"
              isExporting={isExporting}
            />
            <EditableField
              value={invoice.businessEmail}
              onChange={(e) => onUpdateField("businessEmail", e.target.value)}
              maxLength={FIELD_LIMITS.businessEmail}
              className="text-center w-48 bg-transparent"
              placeholder="Email"
              isExporting={isExporting}
            />
          </div>
        </div>

        <div className="border-t border-dashed border-slate-300 my-4"></div>

        {/* --- INVOICE & CLIENT META RECORD DATA --- */}
        <div className="grid grid-cols-2 gap-4 text-[11px] text-slate-700 leading-relaxed mb-4">
          <div className="space-y-1">
            <div>
              <span className="font-bold">INVOICE#: </span>
              <EditableField
                value={invoice.invoiceNumber}
                onChange={(e) => onUpdateField("invoiceNumber", e.target.value)}
                maxLength={FIELD_LIMITS.invoiceNumber}
                className="font-bold text-slate-900 inline-block w-24 bg-transparent"
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
                className="inline-block w-24 text-slate-900 bg-transparent"
                isExporting={isExporting}
              />
            </div>
            <div>
              <span>DUE: </span>
              <EditableField
                type="date"
                value={invoice.dueDate}
                onChange={(e) => onUpdateField("dueDate", e.target.value)}
                className="inline-block w-24 text-slate-900 bg-transparent"
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
                maxLength={FIELD_LIMITS.customerName}
                className="font-bold text-slate-900 text-right inline-block w-24 bg-transparent"
                placeholder="Client Name"
                isExporting={isExporting}
              />
            </div>
            <div>
              <span>TAXID: </span>
              <EditableField
                value={invoice.businessTaxId}
                onChange={(e) => onUpdateField("businessTaxId", e.target.value)}
                maxLength={FIELD_LIMITS.businessTaxId}
                className="text-right inline-block w-24 bg-transparent"
                placeholder="Tax ID"
                isExporting={isExporting}
              />
            </div>
          </div>
        </div>

        <div className="border-t border-dashed border-slate-300 my-4"></div>
      </div>
      {/* --- SEGMENTED SCOPE CONTROLS PANEL (HIDDEN IN EXPORTS) --- */}
      {!isExporting && (
        <div className="no-print flex flex-col sm:flex-row gap-4 mb-6 pb-4 border-b border-dashed border-slate-300 text-[10px] font-bold text-slate-500 font-sans">
          <div className="space-y-1.5 flex-1">
            <span className="text-slate-400 uppercase tracking-wider text-[9px]">
              Tax Configuration
            </span>
            <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              {["none", "item", "subtotal"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => onUpdateField("taxScope", type)}
                  className={`flex-1 py-1 px-2 rounded font-mono capitalize transition-all cursor-pointer text-center text-[10px] ${
                    invoice.taxScope === type
                      ? "bg-white text-slate-950 shadow-xs font-black"
                      : "hover:text-slate-900 text-slate-400"
                  }`}
                >
                  {type === "none" ? "Off" : type === "item" ? "Per Item" : "Subtotal"}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5 flex-1">
            <span className="text-slate-400 uppercase tracking-wider text-[9px]">
              Discount Configuration
            </span>
            <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              {["none", "item", "subtotal"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => onUpdateField("discountScope", type)}
                  className={`flex-1 py-1 px-2 rounded font-mono capitalize transition-all cursor-pointer text-center text-[10px] ${
                    invoice.discountScope === type
                      ? "bg-white text-slate-950 shadow-xs font-black"
                      : "hover:text-slate-900 text-slate-400"
                  }`}
                >
                  {type === "none" ? "Off" : type === "item" ? "Per Item" : "Subtotal"}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* --- RETAIL RECEIPT TABLE INTERFACE --- */}
      <div className="mb-4 spec-items-table-wrapper">
        <table className="w-full text-left border-collapse text-[11px]">
          <thead>
            <tr className="border-b border-dashed border-slate-300 text-slate-500 font-bold">
              <th className="py-2">ITEM DESCRIPTION</th>
              <th className="py-2 text-center w-12">QTY</th>
              <th className="py-2 text-right w-20">RATE</th>

              {invoice.taxScope === "item" && (
                <th className="py-2 text-center w-20">
                  <div className="flex items-center justify-center gap-0.5">
                    <EditableField
                      value={invoice.taxName || "Tax"}
                      onChange={(e) => onUpdateField("taxName", e.target.value)}
                      maxLength={FIELD_LIMITS.taxName}
                      className="text-center font-bold text-slate-500 uppercase max-w-[40px] bg-transparent"
                      isExporting={isExporting}
                    />
                    {!isExporting && (
                      <select
                        value={invoice.taxType || "percentage"}
                        onChange={(e) => onUpdateField("taxType", e.target.value)}
                        className="no-print bg-transparent outline-none text-[8px] font-bold border border-slate-200 rounded cursor-pointer text-slate-400"
                      >
                        <option value="percentage">%</option>
                        <option value="flat">Amt</option>
                      </select>
                    )}
                  </div>
                </th>
              )}

              {invoice.discountScope === "item" && (
                <th className="py-2 text-center w-20">
                  <div className="flex items-center justify-center gap-0.5">
                    <span>DISC</span>
                    {!isExporting && (
                      <select
                        value={invoice.discountType || "percentage"}
                        onChange={(e) => onUpdateField("discountType", e.target.value)}
                        className="no-print bg-transparent outline-none text-[8px] font-bold border border-slate-200 rounded cursor-pointer text-slate-400"
                      >
                        <option value="percentage">%</option>
                        <option value="flat">Amt</option>
                      </select>
                    )}
                  </div>
                </th>
              )}

              <th className="py-2 text-right w-24">TOTAL</th>
              <th className="no-print w-6"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dashed divide-slate-200">
            {invoice.items.map((item, idx) => {
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
                /* break-inside-avoid prevents rows from slicing cleanly across pages */
                <tr key={idx} className="group/item align-top break-inside-avoid spec-item-row">
                  <td className="py-2 pr-2">
                    <EditableField
                      value={item.name}
                      onChange={(e) => onUpdateNestedItem(idx, "name", e.target.value)}
                      maxLength={FIELD_LIMITS.itemName}
                      className="w-full font-bold text-slate-900 text-[11px] bg-transparent"
                      placeholder="Item Title"
                      isExporting={isExporting}
                    />
                    <EditableField
                      value={item.description}
                      onChange={(e) => onUpdateNestedItem(idx, "description", e.target.value)}
                      maxLength={FIELD_LIMITS.itemDescription}
                      className="w-full text-slate-500 text-[9px] bg-transparent block mt-0.5"
                      placeholder="Description"
                      isExporting={isExporting}
                    />
                  </td>
                  <td className="py-2 text-center">
                    <EditableField
                      type="number"
                      value={item.qty}
                      onChange={(e) =>
                        onUpdateNestedItem(idx, "qty", parseInt(e.target.value) || 0)
                      }
                      className="w-full text-center font-bold text-slate-800 bg-transparent"
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
                      className="w-full text-right font-bold text-slate-800 bg-transparent"
                      placeholder="0.00"
                      isExporting={isExporting}
                    />
                  </td>

                  {invoice.taxScope === "item" && (
                    <td className="py-2 text-center font-bold text-slate-800">
                      <div className="flex items-center justify-center">
                        {invoice.taxType === "flat" && (
                          <span className="text-[9px] text-slate-400 mr-0.5">
                            {activeCurrencySymbol}
                          </span>
                        )}
                        <EditableField
                          type="number"
                          value={item.taxRate}
                          onChange={(e) =>
                            onUpdateNestedItem(idx, "taxRate", parseFloat(e.target.value) || 0)
                          }
                          className="w-10 text-center bg-transparent font-bold"
                          placeholder="0"
                          isExporting={isExporting}
                        />
                        {invoice.taxType === "percentage" && (
                          <span className="text-[9px] text-slate-400 ml-0.5">%</span>
                        )}
                      </div>
                    </td>
                  )}

                  {invoice.discountScope === "item" && (
                    <td className="py-2 text-center font-bold text-rose-600">
                      <div className="flex items-center justify-center">
                        {invoice.discountType === "flat" && (
                          <span className="text-[9px] text-rose-400 mr-0.5">
                            {activeCurrencySymbol}
                          </span>
                        )}
                        <EditableField
                          type="number"
                          value={item.discount}
                          onChange={(e) =>
                            onUpdateNestedItem(idx, "discount", parseFloat(e.target.value) || 0)
                          }
                          className="w-10 text-center bg-transparent font-bold text-rose-600"
                          placeholder="0"
                          isExporting={isExporting}
                        />
                        {invoice.discountType === "percentage" && (
                          <span className="text-[9px] text-rose-400 ml-0.5">%</span>
                        )}
                      </div>
                    </td>
                  )}

                  <td className="py-2 text-right font-bold text-slate-900">
                    {activeCurrencySymbol}
                    {lineTotal.toFixed(2)}
                  </td>
                  <td className="no-print py-2 text-center w-6">
                    <button
                      type="button"
                      onClick={() => onRemoveLineItem(idx)}
                      className="opacity-0 group-hover/item:opacity-100 p-1 text-rose-500 hover:bg-rose-50 rounded cursor-pointer transition-opacity"
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
            type="button"
            onClick={onAddLineItem}
            className="no-print mt-3 inline-flex items-center gap-1 px-2 py-1 bg-slate-50 border border-slate-200 rounded text-[10px] font-bold text-slate-600 cursor-pointer"
          >
            <Icons.Plus /> ADD RECEIPT LINE
          </button>
        )}
      </div>
      <div className="avoid-page-slice break-inside-avoid pb-16 space-y-4">
        <div className="border-t border-dashed border-slate-300 my-4 no-print-margin"></div>

        {/* --- RE-ARCHITECTED SUMMARY STACK MATRIX --- */}
        <div className="spec-totals-summary-block w-full text-[11px] text-slate-800 space-y-1.5 max-w-[280px] ml-auto select-none">
          <div className="flex justify-between items-center font-bold">
            <span>GROSS TOTAL:</span>
            <span>
              {activeCurrencySymbol}
              {(
                totals.subtotal + (invoice.discountScope === "subtotal" ? totals.discount : 0)
              ).toFixed(2)}
            </span>
          </div>

          {invoice.discountScope === "subtotal" && (
            <div className="flex justify-between items-center min-h-[22px]">
              <div className="flex items-center gap-1">
                <span className="text-slate-500">DISCOUNT:</span>
                {!isExporting && (
                  <select
                    value={invoice.discountType || "percentage"}
                    onChange={(e) => onUpdateField("discountType", e.target.value)}
                    className="no-print bg-transparent outline-none text-[9px] font-bold border border-slate-200 rounded px-0.5 cursor-pointer text-slate-500"
                  >
                    <option value="percentage">%</option>
                    <option value="flat">Amt</option>
                  </select>
                )}
              </div>
              <div className="flex items-center justify-end text-right font-bold text-rose-600">
                <div className="flex items-center justify-end">
                  {invoice.discountType === "flat" && (
                    <span className="text-[10px] mr-0.5">{activeCurrencySymbol}</span>
                  )}
                  <EditableField
                    type="number"
                    value={invoice.globalDiscount || 0}
                    onChange={(e) =>
                      onUpdateField("globalDiscount", parseFloat(e.target.value) || 0)
                    }
                    className="w-12 text-right text-rose-600 font-bold bg-transparent"
                    placeholder="0"
                    isExporting={isExporting}
                  />
                  {invoice.discountType === "percentage" && (
                    <span className="text-[10px] ml-0.5">%</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {invoice.discountScope === "item" && (totals.discount > 0 || isExporting) && (
            <div className="flex justify-between items-center min-h-[22px]">
              <span className="text-slate-500">ITEM DISCOUNTS:</span>
              <span className="font-bold text-rose-600">
                -{activeCurrencySymbol}
                {totals.discount.toFixed(2)}
              </span>
            </div>
          )}

          {invoice.taxScope === "subtotal" && (
            <div className="flex justify-between items-center min-h-[22px]">
              <div className="flex items-center gap-1">
                <span className="text-slate-500 uppercase">
                  {!isExporting ? (
                    <EditableField
                      value={invoice.taxName || "Tax"}
                      onChange={(e) => onUpdateField("taxName", e.target.value)}
                      maxLength={FIELD_LIMITS.taxName}
                      className="font-bold text-slate-500 uppercase bg-transparent inline max-w-[55px]"
                      placeholder="Tax"
                      isExporting={isExporting}
                    />
                  ) : (
                    invoice.taxName || "TAX"
                  )}
                </span>
                {!isExporting && (
                  <select
                    value={invoice.taxType || "percentage"}
                    onChange={(e) => onUpdateField("taxType", e.target.value)}
                    className="no-print bg-transparent outline-none text-[9px] font-bold border border-slate-200 rounded px-0.5 cursor-pointer text-slate-500"
                  >
                    <option value="percentage">%</option>
                    <option value="flat">Amt</option>
                  </select>
                )}
                <span className="text-slate-500">:</span>
              </div>
              <div className="flex items-center justify-end text-right font-bold">
                <div className="flex items-center justify-end">
                  {invoice.taxType === "flat" && (
                    <span className="text-[10px] text-slate-400 mr-0.5">
                      {activeCurrencySymbol}
                    </span>
                  )}
                  <EditableField
                    type="number"
                    value={invoice.globalTaxRate || 0}
                    onChange={(e) =>
                      onUpdateField("globalTaxRate", parseFloat(e.target.value) || 0)
                    }
                    className="w-12 text-right font-bold bg-transparent"
                    placeholder="0"
                    isExporting={isExporting}
                  />
                  {invoice.taxType === "percentage" && (
                    <span className="text-[10px] text-slate-400 ml-0.5">%</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {invoice.taxScope === "item" && (totals.tax > 0 || isExporting) && (
            <div className="flex justify-between items-center min-h-[22px]">
              <span className="text-slate-500 uppercase">{invoice.taxName || "TAX"} TOTAL:</span>
              <span className="font-bold">
                {activeCurrencySymbol}
                {totals.tax.toFixed(2)}
              </span>
            </div>
          )}

          {invoice.shippingCharges > 0 || isExporting ? (
            <div className="flex justify-between items-center">
              <span className="text-slate-500">SHIPPING/HANDLING:</span>
              <div className="flex items-center justify-end text-right">
                <span className="text-[10px] text-slate-400 mr-0.5">{activeCurrencySymbol}</span>
                <EditableField
                  type="number"
                  value={invoice.shippingCharges || 0}
                  onChange={(e) =>
                    onUpdateField("shippingCharges", parseFloat(e.target.value) || 0)
                  }
                  className="w-16 text-right text-slate-800 bg-transparent font-semibold"
                  placeholder="0.00"
                  isExporting={isExporting}
                />
                {!isExporting && invoice.shippingCharges > 0 && (
                  <button
                    type="button"
                    onClick={() => onUpdateField("shippingCharges", 0)}
                    className="no-print ml-1 text-slate-300 hover:text-rose-500 text-[9px] font-bold cursor-pointer"
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
                  onClick={() => onUpdateField("shippingCharges", 0.01)}
                  className="text-[10px] font-extrabold text-brand-600 dark:text-brand-400 hover:underline cursor-pointer"
                >
                  + Add Shipping
                </button>
                <span className="text-slate-300 font-medium select-none">—</span>
              </div>
            )
          )}

          {(!isExporting || invoice.amountPaid > 0) && (
            <div className="flex justify-between items-center">
              <span className="text-slate-500">AMOUNT TENDERED:</span>
              <div className="flex items-center justify-end text-right">
                <span className="text-[10px] text-slate-400 mr-0.5">{activeCurrencySymbol}</span>
                <EditableField
                  type="number"
                  value={invoice.amountPaid || 0}
                  onChange={(e) => onUpdateField("amountPaid", parseFloat(e.target.value) || 0)}
                  className="w-16 text-right text-slate-800 bg-transparent font-semibold"
                  placeholder="0.00"
                  isExporting={isExporting}
                />
              </div>
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

        <div className="border-t border-dashed border-slate-300 my-4 no-print-margin"></div>

        {/* --- FOOTER DIRECTIONS & BRANDING --- */}
        <div className="text-center space-y-4 class-spec-remittance-footer">
          <div>
            <span className="font-bold block uppercase tracking-wider text-[9px] text-slate-500 mb-1">
              Payment Options
            </span>
            <EditableField
              type="textarea"
              value={invoice.paymentInstructions}
              onChange={(e) => onUpdateField("paymentInstructions", e.target.value)}
              maxLength={FIELD_LIMITS.paymentInstructions}
              rows="3"
              className="w-full text-center text-[10px] text-slate-500 bg-transparent"
              placeholder="Add bank accounts, wire transfer instructions, check details or digital payment links here..."
              isExporting={isExporting}
            />
          </div>
          <div>
            <EditableField
              type="textarea"
              value={invoice.notes}
              onChange={(e) => onUpdateField("notes", e.target.value)}
              maxLength={FIELD_LIMITS.notes}
              rows="2"
              className="w-full text-center text-slate-600 leading-tight font-semibold bg-transparent"
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
      </div>{" "}
      {/* END OF UNBREAKABLE WRAPPER BLOCK */}
    </div>
  );
}
