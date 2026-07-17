import { Icons } from "../components/Icons";
import EditableField from "../components/EditableField/EditableField";
import { FIELD_LIMITS } from "../constants/fieldLimits";
import InvoiceItemsTable from "../components/shared/InvoiceItemsTable";
import RemittanceFooter from "../components/shared/RemittanceFooter";
import TotalsSummary from "../components/shared/TotalsSummary";

export default function BoldProfessionalTemplate(props) {
  const { invoice, onUpdateField, isExporting } = props;
  return (
    <div className="p-10 text-slate-800">
      <div
        className="flex justify-between items-stretch mb-10 text-white rounded-2xl overflow-hidden shadow-md"
        style={{ backgroundColor: invoice.brandColor }}
      >
        <div className="p-8 flex flex-col justify-between">
          <div>
            <div className="relative group/logo w-48 min-h-10 rounded-lg flex items-center mb-3">
              <input
                type="file"
                id="logo-uploader-bold"
                accept="image/*"
                onChange={props.onLogoUpload}
                className="hidden"
              />
              {invoice.businessLogo ? (
                <div className="relative bg-white p-1.5 border rounded-lg">
                  <img
                    src={invoice.businessLogo}
                    alt="Logo"
                    className="max-h-10 max-w-40 object-contain"
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
                  htmlFor="logo-uploader-bold"
                  className="text-[10px] font-bold text-white/80 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <Icons.Upload /> Upload Logo
                </label>
              ) : null}
            </div>
            <EditableField
              value={invoice.businessName}
              onChange={(e) => onUpdateField("businessName", e.target.value)}
              maxLength={FIELD_LIMITS.businessName}

              className="w-full text-lg font-black text-white"
              placeholder="Your / Company Name"
              isExporting={isExporting}
            />
            <EditableField
              type="textarea"
              value={invoice.businessAddress}
              onChange={(e) => onUpdateField("businessAddress", e.target.value)}
              maxLength={FIELD_LIMITS.businessAddress}

              rows="2"
              className="w-full text-[11px] text-white/80 leading-relaxed"
              placeholder="Your / Company Address"
              isExporting={isExporting}
            />
            <div className="flex flex-col gap-0.5 text-xs text-white/80">
              <EditableField
                value={invoice.businessPhone}
                onChange={(e) => onUpdateField("businessPhone", e.target.value)}
                maxLength={FIELD_LIMITS.businessPhone}
                className="w-full text-white"
                placeholder="Phone Number"
                isExporting={isExporting}
              />
              <EditableField
                value={invoice.businessEmail}
                onChange={(e) => onUpdateField("businessEmail", e.target.value)}
                maxLength={FIELD_LIMITS.businessEmail}
                className="w-full text-white"
                placeholder="Email"
                isExporting={isExporting}
              />
            </div>
          </div>
        </div>
        <div className="p-8 bg-black/15 text-right flex flex-col justify-between min-w-[200px]">
          <div>
            <EditableField
              value={invoice.invoiceLabel}
              onChange={(e) => onUpdateField("invoiceLabel", e.target.value)}
              maxLength={FIELD_LIMITS.invoiceLabel}
              className="text-xl font-black text-white text-right uppercase block"
              placeholder="INVOICE"
              isExporting={isExporting}
            />
            <div className="mt-4">
              <p className="text-[9px] font-extrabold tracking-widest text-white/70 uppercase">
                Invoice #
              </p>
              <EditableField
                value={invoice.invoiceNumber}
                onChange={(e) => onUpdateField("invoiceNumber", e.target.value)}
                maxLength={FIELD_LIMITS.invoiceNumber}
                className="text-right font-black text-lg text-white"
                placeholder="INV-2026-10"
                isExporting={isExporting}
              />
            </div>
          </div>
          <div className="text-xs text-white/90 space-y-1">
            <div>
              Date:{" "}
              <EditableField
                type="date"
                value={invoice.issueDate}
                onChange={(e) => onUpdateField("issueDate", e.target.value)}
                className="w-24 text-right text-white inline-block"
                isExporting={isExporting}
              />
            </div>
            <div>
              Due:{" "}
              <EditableField
                type="date"
                value={invoice.dueDate}
                onChange={(e) => onUpdateField("dueDate", e.target.value)}
                className="w-24 text-right text-white inline-block"
                isExporting={isExporting}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-10 text-xs">
        <div>
          <h3 className="font-extrabold text-slate-400 tracking-wider text-[10px] uppercase mb-2">
            INVOICED TO:
          </h3>
          <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
            <EditableField
              value={invoice.customerName}
              onChange={(e) => onUpdateField("customerName", e.target.value)}
              maxLength={FIELD_LIMITS.customerName}
              className="w-full font-bold text-slate-900"
              placeholder="Client Name"
              isExporting={isExporting}
            />
            <EditableField
              value={invoice.customerCompany}
              onChange={(e) => onUpdateField("customerCompany", e.target.value)}
              maxLength={FIELD_LIMITS.customerName}
              className="w-full text-slate-600"
              placeholder="Client Company"
              isExporting={isExporting}
            />
            <EditableField
              type="textarea"
              value={invoice.customerAddress}
              onChange={(e) => onUpdateField("customerAddress", e.target.value)}
              maxLength={FIELD_LIMITS.customerAddress}
              rows="2"
              className="w-full text-slate-500 mt-1"
              placeholder="Client's Address"
              isExporting={isExporting}
            />
            <EditableField
              value={invoice.customerPhone}
              onChange={(e) => onUpdateField("customerPhone", e.target.value)}
              maxLength={FIELD_LIMITS.customerPhone}
              className="w-full text-slate-500 leading-relaxed"
              placeholder="Client Phone Number"
              isExporting={isExporting}
            />
            <EditableField
              value={invoice.customerEmail}
              onChange={(e) => onUpdateField("customerEmail", e.target.value)}
              maxLength={FIELD_LIMITS.customerEmail}
              className="w-full text-slate-500 leading-relaxed"
              placeholder="Client Email"
              isExporting={isExporting}
            />
          </div>
        </div>
        <div className="flex flex-col justify-end items-end">
          <div className="text-right text-slate-500 text-[11px] space-y-1">
            <div>
              Tax Registration ID:{" "}
              <EditableField
                value={invoice.businessTaxId}
                onChange={(e) => onUpdateField("businessTaxId", e.target.value)}
                maxLength={FIELD_LIMITS.businessTaxId}
                className="text-right font-bold text-slate-900 w-32 inline-block"
                placeholder="Tax ID"
                isExporting={isExporting}
              />
            </div>
            <div>
              Company Registry #:{" "}
              <EditableField
                value={invoice.businessRegId}
                onChange={(e) => onUpdateField("businessRegId", e.target.value)}
                maxLength={FIELD_LIMITS.businessRegId}
                className="text-right font-bold text-slate-900 w-32 inline-block"
                placeholder="REG ID"
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
