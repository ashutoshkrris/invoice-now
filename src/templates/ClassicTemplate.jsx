import { Icons } from "../components/Icons";
import EditableField from "../components/EditableField";
import InvoiceItemsTable from "../components/shared/InvoiceItemsTable";
import RemittanceFooter from "../components/shared/RemittanceFooter";
import TotalsSummary from "../components/shared/TotalsSummary";

export default function ClassicTemplate(props) {
  const { invoice, onUpdateField, isExporting } = props;
  return (
    <div className="p-10 border-t-8" style={{ borderColor: invoice.brandColor }}>
      <div
        className={`flex ${
          isExporting ? "flex-row" : "flex-col md:flex-row"
        } justify-between items-start gap-6 mb-10 pb-8 border-b border-slate-200`}
      >
        <div className="space-y-3">
          <div className="relative group/logo w-48 min-h-12.5 border border-dashed border-transparent hover:border-slate-300 rounded-lg flex items-center justify-center bg-slate-50/50 p-2 cursor-pointer">
            <input
              type="file"
              id="logo-uploader"
              accept="image/*"
              onChange={props.onLogoUpload}
              className="hidden"
            />
            {invoice.businessLogo ? (
              <div className="relative">
                <img
                  src={invoice.businessLogo}
                  alt="Corporate Logo"
                  className="max-h-16 max-w-47.5 object-contain"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateField("businessLogo", "");
                  }}
                  className="no-print absolute -top-2 -right-2 h-5 w-5 bg-rose-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-md"
                >
                  ✕
                </button>
              </div>
            ) : !isExporting ? (
              <label
                htmlFor="logo-uploader"
                className="text-[11px] font-bold text-slate-400 hover:text-brand-500 flex flex-col items-center gap-1 cursor-pointer w-full text-center"
              >
                <Icons.Upload />
                Upload Brand Logo
              </label>
            ) : null}
          </div>

          <div className="space-y-1">
            <EditableField
              value={invoice.businessName}
              onChange={(e) => onUpdateField("businessName", e.target.value)}
              className="w-full text-md font-extrabold"
              style={{ color: invoice.brandColor }}
              placeholder="Your / Company Name"
              isExporting={isExporting}
            />
            <EditableField
              type="textarea"
              value={invoice.businessAddress}
              onChange={(e) => onUpdateField("businessAddress", e.target.value)}
              rows="2"
              className="w-full text-xs text-slate-500 leading-relaxed"
              placeholder="Your / Company Address"
              isExporting={isExporting}
            />
            <div className="flex flex-col gap-0.5 text-xs text-slate-500">
              <EditableField
                value={invoice.businessPhone}
                onChange={(e) => onUpdateField("businessPhone", e.target.value)}
                className="w-full"
                placeholder="Phone Number"
                isExporting={isExporting}
              />
              <EditableField
                value={invoice.businessEmail}
                onChange={(e) => onUpdateField("businessEmail", e.target.value)}
                className="w-full"
                placeholder="Email"
                isExporting={isExporting}
              />
            </div>
          </div>
        </div>

        <div
          className={`${
            isExporting
              ? "w-auto shrink-0 text-right"
              : "w-full md:w-auto md:shrink-0 text-left md:text-right"
          }`}
        >
          <EditableField
            value={invoice.invoiceLabel}
            onChange={(e) => onUpdateField("invoiceLabel", e.target.value)}
            className={`${
              isExporting
                ? "w-auto text-3xl text-right"
                : "w-full md:w-auto text-2xl sm:text-3xl text-left md:text-right"
            } font-black tracking-wider uppercase mb-4 block wrap-break-word`}
            style={{ color: invoice.brandColor }}
            placeholder="INVOICE"
            isExporting={isExporting}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8 pb-6 border-b border-slate-100 text-xs">
        <div>
          <h3 className="font-extrabold tracking-widest text-slate-400 uppercase text-[10px] mb-2">
            Billed To:
          </h3>
          <div className="space-y-1">
            <EditableField
              value={invoice.customerName}
              onChange={(e) => onUpdateField("customerName", e.target.value)}
              className="w-full font-bold text-sm"
              placeholder="Client Name"
              isExporting={isExporting}
            />
            <EditableField
              value={invoice.customerCompany}
              onChange={(e) => onUpdateField("customerCompany", e.target.value)}
              className="w-full text-slate-600 font-medium"
              placeholder="Client Company LLC"
              isExporting={isExporting}
            />
            <EditableField
              type="textarea"
              value={invoice.customerAddress}
              onChange={(e) => onUpdateField("customerAddress", e.target.value)}
              rows="2"
              className="w-full text-slate-500 leading-relaxed"
              placeholder="Client's Address"
              isExporting={isExporting}
            />
            <EditableField
              value={invoice.customerTaxId}
              onChange={(e) => onUpdateField("customerTaxId", e.target.value)}
              className="w-full text-[11px] text-slate-500"
              placeholder="Client Tax / VAT ID"
              isExporting={isExporting}
            />
          </div>
        </div>

        <div className="flex flex-col justify-between items-end text-right space-y-3">
          <div className="space-y-2 w-48">
            <div>
              <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                Invoice #
              </p>
              <EditableField
                value={invoice.invoiceNumber}
                onChange={(e) => onUpdateField("invoiceNumber", e.target.value)}
                className="w-full text-right font-extrabold text-sm"
                placeholder="INV-2026-001"
                isExporting={isExporting}
              />
            </div>
            <div>
              <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                Invoice Date
              </p>
              <EditableField
                type="date"
                value={invoice.issueDate}
                onChange={(e) => onUpdateField("issueDate", e.target.value)}
                className="text-right text-xs font-semibold text-slate-900 bg-transparent"
                isExporting={isExporting}
              />
            </div>
            <div>
              <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                Due Date
              </p>
              <EditableField
                type="date"
                value={invoice.dueDate}
                onChange={(e) => onUpdateField("dueDate", e.target.value)}
                className="text-right text-xs font-semibold text-slate-900 bg-transparent"
                isExporting={isExporting}
              />
            </div>
            <div>
              <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                {invoice.taxName} ID
              </p>
              <EditableField
                value={invoice.businessTaxId}
                onChange={(e) => onUpdateField("businessTaxId", e.target.value)}
                className="w-full text-right text-xs font-semibold text-slate-900"
                placeholder="US-111222333"
                isExporting={isExporting}
              />
            </div>
          </div>
        </div>
      </div>

      <InvoiceItemsTable {...props} />
      <TotalsSummary {...props} />
      <RemittanceFooter {...props} />
    </div>
  );
}
