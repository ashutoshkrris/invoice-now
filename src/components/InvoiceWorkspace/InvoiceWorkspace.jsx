import { useEffect, useState, useRef } from "react";
import ExportMenu from "../ExportMenu/ExportMenu";

// Templates Layer Mapping Loops
import ClassicTemplate from "../../templates/ClassicTemplate";
import ModernMinimalistTemplate from "../../templates/ModernMinimalistTemplate";
import BoldProfessionalTemplate from "../../templates/BoldProfessionalTemplate";
import EmeraldPremiumTemplate from "../../templates/EmeraldPremiumTemplate";
import RetailTemplate from "../../templates/RetailTemplate";

export default function InvoiceWorkspace({
  invoice,
  totals,
  activeCurrencySymbol,
  isExporting,
  onActions,
}) {
  const [showFloatingButton, setShowFloatingButton] = useState(true);
  const footerCardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowFloatingButton(!entry.isIntersecting);
      },
      { root: null, threshold: 0.1, rootMargin: "0px 0px 50px 0px" }
    );

    const currentRef = footerCardRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  const templateProps = {
    invoice,
    totals,
    activeCurrencySymbol,
    isExporting,
    onUpdateField: onActions.onUpdateField,
    onUpdateNestedItem: onActions.onUpdateNestedItem,
    onRemoveLineItem: onActions.onRemoveLineItem,
    onAddLineItem: onActions.onAddLineItem,
    onLogoUpload: onActions.onLogoUpload,
  };

  return (
    <main className="flex-1 overflow-y-auto bg-slate-100 dark:bg-slate-900/60 bg-grid py-8 px-4 flex justify-center items-start">
      <div className="w-full max-w-210 relative">
        <div className="no-print mb-4 flex items-center justify-between text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-2">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Click any field below to rewrite details
          </span>
          <span>
            {invoice.paperSize === "letter" ? "8.5in x 11in (Letter)" : "210mm x 297mm (A4)"}
          </span>
        </div>

        {/* WYSIWYG Sheet Canvas */}
        <div
          id="printable-invoice-area"
          className={`w-full bg-white text-slate-950 shadow-2xl md:rounded-2xl overflow-hidden relative ${invoice.typography || "font-sans"}`}
          style={{ minHeight: invoice.paperSize === "letter" ? "1050px" : "1120px" }}
        >
          {invoice.watermarkText && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10 select-none overflow-hidden">
              <span className="text-7xl md:text-8xl font-black text-slate-700/20 dark:text-slate-500/15 uppercase tracking-widest -rotate-45 leading-none text-center">
                {invoice.watermarkText}
              </span>
            </div>
          )}

          {invoice.templateId === "classic" && <ClassicTemplate {...templateProps} />}
          {invoice.templateId === "modern-minimalist" && (
            <ModernMinimalistTemplate {...templateProps} />
          )}
          {invoice.templateId === "bold-professional" && (
            <BoldProfessionalTemplate {...templateProps} />
          )}
          {invoice.templateId === "emerald-premium" && (
            <EmeraldPremiumTemplate {...templateProps} />
          )}
          {invoice.templateId === "retail" && <RetailTemplate {...templateProps} />}
        </div>

        {/* Static Bottom Actions Card */}
        <div
          ref={footerCardRef}
          className="no-print mt-6 w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-md"
        >
          <div className="text-left">
            <h4 className="text-sm font-black text-slate-900 dark:text-white mb-0.5">
              Finished reviewing your invoice?
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Download your copy immediately or generate a print system request.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <ExportMenu
              onPrint={onActions.onPrint}
              onExportPNG={onActions.onExportPNG}
              onExportPDF={onActions.onExportPDF}
            />
          </div>
        </div>
      </div>

      {/* Floating Action Menu Button Trigger */}
      <div
        className={`fixed bottom-6 right-6 z-40 transition-all duration-300 transform no-print ${
          showFloatingButton
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-4 scale-90 pointer-events-none"
        }`}
      >
        <div className="shadow-2xl rounded-xl">
          <ExportMenu
            onPrint={onActions.onPrint}
            onExportPNG={onActions.onExportPNG}
            onExportPDF={onActions.onExportPDF}
            isFloating={true}
          />
        </div>
      </div>
    </main>
  );
}
