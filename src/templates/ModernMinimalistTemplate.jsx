import { Icons } from "../components/Icons";
import EditableField from "../components/EditableField";
import InvoiceItemsTable from "../components/shared/InvoiceItemsTable";
import RemittanceFooter from "../components/shared/RemittanceFooter";
import TotalsSummary from "../components/shared/TotalsSummary";

export default function ModernMinimalistTemplate(props) {
  const { invoice, onUpdateField, isExporting } = props;
  return (
    <div className="p-10 text-slate-800">
      <div className="flex justify-between items-start mb-12 pb-6 border-b border-slate-100">
        <div className="space-y-2">
          <div className="relative group/logo w-48 min-h-10 border border-dashed border-transparent hover:border-slate-300 rounded-lg flex items-center bg-slate-50/50 p-2 cursor-pointer">
            <input
              type="file"
              id="logo-uploader-min"
              accept="image/*"
              onChange={props.onLogoUpload}
              className="hidden"
            />
            {invoice.businessLogo ? (
              <div className="relative">
                <img
                  src={invoice.businessLogo}
                  alt="Logo"
                  className="max-h-12 max-w-45 object-contain"
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
            ) : !isExporting ? (
              <label
                htmlFor="logo-uploader-min"
                className="text-[10px] font-bold text-slate-400 hover:text-brand-500 flex items-center gap-1 cursor-pointer"
              >
                <Icons.Upload /> Upload Logo
              </label>
            ) : null}
          </div>
          <EditableField
            value={invoice.businessName}
            onChange={(e) => onUpdateField("businessName", e.target.value)}
            className="w-full text-lg font-black tracking-tight text-slate-900"
            placeholder="Your / Company Name"
            isExporting={isExporting}
          />
          <EditableField
            type="textarea"
            value={invoice.businessAddress}
            onChange={(e) => onUpdateField("businessAddress", e.target.value)}
            rows="2"
            className="w-full text-[11px] text-slate-500 leading-relaxed"
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
        <div className="text-right">
          <EditableField
            value={invoice.invoiceLabel}
            onChange={(e) => onUpdateField("invoiceLabel", e.target.value)}
            className="text-2xl font-black text-right uppercase block"
            style={{ color: invoice.brandColor }}
            placeholder="INVOICE"
            isExporting={isExporting}
          />
          <div className="text-xs space-y-2 text-slate-500 mt-4 text-right">
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
                Invoice #
              </span>
              <EditableField
                value={invoice.invoiceNumber}
                onChange={(e) => onUpdateField("invoiceNumber", e.target.value)}
                className="text-right font-black text-slate-900"
                placeholder="INV-001"
                isExporting={isExporting}
              />
            </div>
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
                Invoice Date
              </span>
              <EditableField
                type="date"
                value={invoice.issueDate}
                onChange={(e) => onUpdateField("issueDate", e.target.value)}
                className="text-right text-xs font-semibold text-slate-900 bg-transparent"
                isExporting={isExporting}
              />
            </div>
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
                Due Date
              </span>
              <EditableField
                type="date"
                value={invoice.dueDate}
                onChange={(e) => onUpdateField("dueDate", e.target.value)}
                className="text-right text-xs font-semibold text-slate-900 bg-transparent"
                isExporting={isExporting}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mb-10 text-xs bg-slate-50 p-5 rounded-2xl border border-slate-100/60 grid grid-cols-2 gap-6">
        <div>
          <h3 className="font-extrabold text-slate-400 tracking-wider text-[10px] uppercase mb-1.5">
            Billed To:
          </h3>
          <EditableField
            value={invoice.customerName}
            onChange={(e) => onUpdateField("customerName", e.target.value)}
            className="w-full font-bold text-slate-900"
            placeholder="Client Name"
            isExporting={isExporting}
          />
          <EditableField
            value={invoice.customerCompany}
            onChange={(e) => onUpdateField("customerCompany", e.target.value)}
            className="w-full text-slate-600"
            placeholder="Client Company"
            isExporting={isExporting}
          />
          <EditableField
            type="textarea"
            value={invoice.customerAddress}
            onChange={(e) => onUpdateField("customerAddress", e.target.value)}
            rows="2"
            className="w-full text-slate-500 mt-1"
            placeholder="Client's Address"
            isExporting={isExporting}
          />
        </div>
        <div className="flex flex-col justify-end items-end text-right">
          <div>
            <p className="text-slate-400 text-[10px]">Client Tax ID</p>
            <EditableField
              value={invoice.customerTaxId}
              onChange={(e) => onUpdateField("customerTaxId", e.target.value)}
              className="text-right font-semibold text-slate-900"
              placeholder="US-999888"
              isExporting={isExporting}
            />
          </div>
        </div>
      </div>

      <InvoiceItemsTable {...props} />
      <TotalsSummary {...props} />
      <RemittanceFooter {...props} />
    </div>
  );
}
