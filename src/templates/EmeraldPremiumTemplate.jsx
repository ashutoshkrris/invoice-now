import { Icons } from "../components/Icons";
import EditableField from "../components/EditableField";
import { FIELD_LIMITS } from "../constants/fieldLimits";
import InvoiceItemsTable from "../components/shared/InvoiceItemsTable";
import RemittanceFooter from "../components/shared/RemittanceFooter";
import TotalsSummary from "../components/shared/TotalsSummary";

export default function EmeraldPremiumTemplate(props) {
  const { invoice, onUpdateField, isExporting } = props;
  return (
    <div className="p-10 text-slate-800 font-serif">
      <div
        className="text-center mb-10 pb-8 border-b-2"
        style={{ borderBottomColor: invoice.brandColor }}
      >
        <div className="relative group/logo w-48 min-h-12.5 mx-auto border border-dashed border-transparent hover:border-slate-300 rounded-lg flex items-center justify-center bg-slate-50/50 p-2 cursor-pointer mb-3">
          <input
            type="file"
            id="logo-uploader-prem"
            accept="image/*"
            onChange={props.onLogoUpload}
            className="hidden"
          />
          {invoice.businessLogo ? (
            <div className="relative">
              <img
                src={invoice.businessLogo}
                alt="Logo"
                className="max-h-16 max-w-47.5 object-contain"
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
              htmlFor="logo-uploader-prem"
              className="text-[10px] font-bold font-sans text-slate-400 hover:text-brand-500 flex items-center gap-1 cursor-pointer"
            >
              <Icons.Upload /> Premium Header Logo
            </label>
          ) : null}
        </div>
        <EditableField
          value={invoice.businessName}
          onChange={(e) => onUpdateField("businessName", e.target.value)}
          className="w-full text-center text-2xl font-black uppercase tracking-wide"
          style={{ color: invoice.brandColor }}
          placeholder="Your / Company Name"
          isExporting={isExporting}
        />
        <EditableField
          type="textarea"
          value={invoice.businessAddress}
          onChange={(e) => onUpdateField("businessAddress", e.target.value)}
          rows="2"
          className="w-full text-center text-xs text-slate-500 mt-2"
          placeholder="Your / Company Address"
          isExporting={isExporting}
        />
        <div className="flex flex-col items-center justify-center gap-1 text-xs text-slate-500 mt-2 font-sans">
          <EditableField
            value={invoice.businessPhone}
            onChange={(e) => onUpdateField("businessPhone", e.target.value)}
            className="text-center w-48"
            placeholder="Phone Number"
            isExporting={isExporting}
            maxLength={FIELD_LIMITS.businessPhone}
          />
          <EditableField
            value={invoice.businessEmail}
            onChange={(e) => onUpdateField("businessEmail", e.target.value)}
            className="text-center w-64"
            placeholder="Email"
            isExporting={isExporting}
            maxLength={FIELD_LIMITS.businessEmail}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 text-xs mb-10 text-slate-600 font-sans">
        <div className="border-r border-slate-200/60 pr-4 space-y-1">
          <p
            className="font-extrabold tracking-widest text-[9px] uppercase"
            style={{ color: invoice.brandColor }}
          >
            Recipient details
          </p>
          <EditableField
            value={invoice.customerName}
            onChange={(e) => onUpdateField("customerName", e.target.value)}
            className="w-full font-bold text-slate-900"
            placeholder="Client Name"
            isExporting={isExporting}
            maxLength={FIELD_LIMITS.customerName}
          />
          <EditableField
            value={invoice.customerCompany}
            onChange={(e) => onUpdateField("customerCompany", e.target.value)}
            className="w-full text-slate-600"
            placeholder="Client Company"
            isExporting={isExporting}
            maxLength={FIELD_LIMITS.customerCompany}
          />
          <EditableField
            type="textarea"
            value={invoice.customerAddress}
            onChange={(e) => onUpdateField("customerAddress", e.target.value)}
            rows="2"
            className="w-full text-slate-500 mt-1"
            placeholder="Client's Address"
            isExporting={isExporting}
            maxLength={FIELD_LIMITS.customerAddress}
          />
        </div>
        <div className="border-r border-slate-200/60 px-4 space-y-2">
          <p
            className="font-extrabold tracking-widest text-[9px] uppercase"
            style={{ color: invoice.brandColor }}
          >
            Invoice info
          </p>
          <div>
            <span className="text-[8px] font-bold text-slate-400 block uppercase">Invoice #</span>
            <EditableField
              value={invoice.invoiceNumber}
              onChange={(e) => onUpdateField("invoiceNumber", e.target.value)}
              className="w-full text-sm font-bold text-slate-900"
              placeholder="Invoice Number"
              isExporting={isExporting}
            maxLength={FIELD_LIMITS.invoiceNumber}
            />
          </div>
          <div>
            <span className="text-[8px] font-bold text-slate-400 block uppercase">
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
            <span className="text-[8px] font-bold text-slate-400 block uppercase">Due Date</span>
            <EditableField
              type="date"
              value={invoice.dueDate}
              onChange={(e) => onUpdateField("dueDate", e.target.value)}
              className="text-right text-xs font-semibold text-slate-900 bg-transparent"
              isExporting={isExporting}
            />
          </div>
        </div>
        <div className="pl-4 space-y-3">
          <p
            className="font-extrabold tracking-widest text-[9px] uppercase"
            style={{ color: invoice.brandColor }}
          >
            Tax Registry
          </p>
          <div>
            <p className="text-slate-400 text-[10px]">Client Tax ID</p>
            <EditableField
              value={invoice.customerTaxId}
              onChange={(e) => onUpdateField("customerTaxId", e.target.value)}
              className="font-semibold text-slate-900 w-full"
              placeholder="Tax ID"
              isExporting={isExporting}
            maxLength={FIELD_LIMITS.customerTaxId}
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
