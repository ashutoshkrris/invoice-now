import { useState, useEffect, useMemo } from "react";
import { Routes, Route } from "react-router-dom";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";

// Navigation & Layout Structure Components
import Navbar from "./components/Navbar";
import InvoiceToolbar from "./components/InvoiceToolbar";
import Footer from "./components/Footer";
import Toast from "./components/Toast";
import ExportMenu from "./components/ExportMenu";

// Pages Layer Imports
import AboutPage from "./pages/AboutPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsOfUsePage from "./pages/TermsOfUsePage";

// Template Layout Forms Imports
import BoldProfessionalTemplate from "./templates/BoldProfessionalTemplate";
import ClassicTemplate from "./templates/ClassicTemplate";
import EmeraldPremiumTemplate from "./templates/EmeraldPremiumTemplate";
import ModernMinimalistTemplate from "./templates/ModernMinimalistTemplate";
import RetailTemplate from "./templates/RetailTemplate";

// Core Business Presets Imports
import { INITIAL_INVOICE_STATE } from "./constants/invoicePresets";
import { COUNTRIES } from "./constants/countries";
import { loadCachedState, persistState } from "./utils/storage";

export default function App() {
  const [invoice, setInvoice] = useState(loadCachedState);
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const [toast, setToast] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  // --- HISTORICAL UNDO / REDO ENGINE ---
  const [history, setHistory] = useState([JSON.stringify(INITIAL_INVOICE_STATE)]);
  const [historyIdx, setHistoryIdx] = useState(0);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const triggerToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const saveWithHistory = (newState) => {
    setInvoice(newState);
    persistState(newState);

    const stringified = JSON.stringify(newState);
    const currentHistory = history.slice(0, historyIdx + 1);
    setHistory([...currentHistory, stringified]);
    setHistoryIdx(currentHistory.length);
  };

  const updateField = (key, value) => {
    const updated = { ...invoice, [key]: value };
    saveWithHistory(updated);
  };

  const updateNestedItem = (idx, key, value) => {
    const updatedItems = [...invoice.items];
    updatedItems[idx] = { ...updatedItems[idx], [key]: value };
    const updated = { ...invoice, items: updatedItems };
    saveWithHistory(updated);
  };

  const handleUndo = () => {
    if (historyIdx > 0) {
      const prevIdx = historyIdx - 1;
      setHistoryIdx(prevIdx);
      const restored = JSON.parse(history[prevIdx]);
      setInvoice(restored);
      persistState(restored);
      triggerToast("Changes Undone", "info");
    }
  };

  const handleRedo = () => {
    if (historyIdx < history.length - 1) {
      const nextIdx = historyIdx + 1;
      setHistoryIdx(nextIdx);
      const restored = JSON.parse(history[nextIdx]);
      setInvoice(restored);
      persistState(restored);
      triggerToast("Changes Redone", "info");
    }
  };

  // --- LIVE INVOICE CALCULATORS ---
  const calculatedTotals = useMemo(() => {
    let subtotal = 0;
    let totalTax = 0;
    let totalDiscount = 0;

    invoice.items.forEach((item) => {
      const qty = parseInt(item.qty, 10) || 0;
      const price = parseFloat(item.price) || 0;
      const rawSub = qty * price;
      let rowDiscount = 0;
      if (invoice.discountScope === "item") {
        const discount = parseFloat(item.discount) || 0;
        rowDiscount = invoice.discountType === "percentage" ? (rawSub * discount) / 100 : discount;
      }
      const runningSubtotal = rawSub - rowDiscount;

      let rowTax = 0;
      if (invoice.taxScope === "item") {
        const taxRate = parseFloat(item.taxRate) || 0;
        rowTax = invoice.taxType === "percentage" ? (runningSubtotal * taxRate) / 100 : taxRate;
      }

      subtotal += runningSubtotal;
      totalTax += rowTax;
    });

    if (invoice.discountScope === "subtotal") {
      totalDiscount =
        invoice.discountType === "percentage"
          ? (subtotal * (invoice.globalDiscount || 0)) / 100
          : invoice.globalDiscount || 0;
      subtotal -= totalDiscount;
    }

    if (invoice.taxScope === "subtotal") {
      totalTax =
        invoice.taxType === "percentage"
          ? (subtotal * (invoice.globalTaxRate || 0)) / 100
          : invoice.globalTaxRate || 0;
    }

    const grandTotal = subtotal + totalTax + (parseFloat(invoice.shippingCharges) || 0);
    const balanceDue = grandTotal - (invoice.amountPaid || 0);

    return { subtotal, tax: totalTax, discount: totalDiscount, grandTotal, balanceDue };
  }, [invoice]);

  const addLineItem = () => {
    const newItem = { name: "", description: "", qty: 1, price: 0, taxRate: 0, discount: 0 };
    const updated = { ...invoice, items: [...invoice.items, newItem] };
    saveWithHistory(updated);
    triggerToast("New item added to invoice layout");
  };

  const removeLineItem = (idx) => {
    if (invoice.items.length <= 1) {
      triggerToast("Invoice must have at least one line item.", "error");
      return;
    }
    const updatedItems = invoice.items.filter((_, i) => i !== idx);
    const updated = { ...invoice, items: updatedItems };
    saveWithHistory(updated);
    triggerToast("Line item deleted", "error");
  };

  const handleCountryChange = (countryCode) => {
    const preset = COUNTRIES.find((c) => c.code === countryCode);
    if (!preset) return;

    const updatedItems = invoice.items.map((item) => ({
      ...item,
      taxRate: preset.defaultTaxRate,
    }));

    const updated = {
      ...invoice,
      countryCode,
      currencyCode: preset.currency,
      currencySymbol: preset.symbol,
      taxName: preset.taxName,
      items: updatedItems,
    };

    saveWithHistory(updated);
    triggerToast(`Updated layout settings to ${preset.name} format!`);
  };

  // --- EXPORT ENGINES ---
  const prepareInvoiceForExport = (target) => {
    const original = {
      width: target.style.width,
      minHeight: target.style.minHeight,
    };

    target.style.width = "794px";
    target.style.minHeight = invoice.paperSize === "letter" ? "1050px" : "1120px";

    return () => {
      target.style.width = original.width;
      target.style.minHeight = original.minHeight;
    };
  };

  const handlePrint = () => {
    setIsExporting(true);
    const target = document.getElementById("printable-invoice-area");
    if (!target) {
      setIsExporting(false);
      return;
    }
    const restore = prepareInvoiceForExport(target);
    setTimeout(() => {
      window.print();
      restore();
      setIsExporting(false);
    }, 300);
  };

  const handleExportPNG = () => {
    setIsExporting(true);
    triggerToast("Generating high-res PNG image...", "info");

    setTimeout(async () => {
      const target = document.getElementById("printable-invoice-area");
      if (!target) {
        setIsExporting(false);
        return;
      }
      const restore = prepareInvoiceForExport(target);

      try {
        await new Promise((resolve) => setTimeout(resolve, 50));
        const dataUrl = await toPng(target, {
          quality: 0.95,
          pixelRatio: 3,
          backgroundColor: "#ffffff",
          filter: (node) => {
            if (node.tagName === "LINK" && node.getAttribute("rel") === "stylesheet") {
              const href = node.getAttribute("href");
              return (
                href &&
                (href.startsWith("/") ||
                  href.includes(window.location.host) ||
                  href.includes("fonts.googleapis.com"))
              );
            }
            return true;
          },
        });

        const link = document.createElement("a");
        link.download = `${invoice.invoiceNumber || "invoice"}.png`;
        link.href = dataUrl;
        link.click();
        triggerToast("PNG Image download complete!");
      } catch (err) {
        console.error("PNG generation failed", err);
        triggerToast("PNG generation failed", "error");
      }
      {
        restore();
        setIsExporting(false);
      }
    }, 400);
  };

  const handleExportPDF = () => {
    setIsExporting(true);
    triggerToast("Generating print-quality PDF...", "info");

    setTimeout(async () => {
      const target = document.getElementById("printable-invoice-area");
      if (!target) {
        setIsExporting(false);
        return;
      }
      const restore = prepareInvoiceForExport(target);

      try {
        await new Promise((resolve) => setTimeout(resolve, 50));
        const dataUrl = await toPng(target, {
          quality: 0.95,
          pixelRatio: 2.5,
          backgroundColor: "#ffffff",
          filter: (node) => {
            if (node.tagName === "LINK" && node.getAttribute("rel") === "stylesheet") {
              const href = node.getAttribute("href");
              return (
                href &&
                (href.startsWith("/") ||
                  href.includes(window.location.host) ||
                  href.includes("fonts.googleapis.com"))
              );
            }
            return true;
          },
        });

        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: invoice.paperSize === "letter" ? "letter" : "a4",
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const imgWidth = target.offsetWidth;
        const imgHeight = target.offsetHeight;
        const ratio = imgHeight / imgWidth;
        const pdfHeight = pdfWidth * ratio;

        pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight, undefined, "FAST");
        pdf.save(`${invoice.invoiceNumber || "invoice"}.pdf`);
        triggerToast("PDF document download complete!");
      } catch (err) {
        console.error("PDF engine crash", err);
        triggerToast("PDF generation failed", "error");
      } finally {
        restore();
        setIsExporting(false);
      }
    }, 400);
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateField("businessLogo", reader.result);
        triggerToast("Corporate identity logo saved.");
      };
      reader.readAsDataURL(file);
    }
  };

  const activeCurrencySymbol = invoice.currencySymbol || "$";

  const templateProps = {
    invoice,
    totals: calculatedTotals,
    activeCurrencySymbol,
    isExporting,
    onUpdateField: updateField,
    onUpdateNestedItem: updateNestedItem,
    onRemoveLineItem: removeLineItem,
    onAddLineItem: addLineItem,
    onLogoUpload: handleLogoUpload,
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-900 transition-colors duration-200">
      {/* 1. Global Navigation Bar handles routing actions and dark theme values */}
      <Navbar theme={theme} onThemeToggle={() => setTheme(theme === "dark" ? "light" : "dark")} />

      <Routes>
        {/* --- WORKSPACE EDITOR --- */}
        <Route
          path="/"
          element={
            <>
              {/* 2. Focused Toolbar managing local preset parameters strictly inside workspace contexts */}
              <InvoiceToolbar
                invoice={invoice}
                historyIdx={historyIdx}
                historyLength={history.length}
                onUpdateField={updateField}
                onCountryChange={handleCountryChange}
                onUndo={handleUndo}
                onRedo={handleRedo}
              />

              <main className="flex-1 overflow-y-auto bg-slate-100 dark:bg-slate-900/60 bg-grid py-8 px-4 flex justify-center items-start">
                <div className="w-full max-w-210 relative">
                  <div className="no-print mb-4 flex items-center justify-between text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-2">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>{" "}
                      Click any field below to rewrite details
                    </span>
                    <span>
                      {invoice.paperSize === "letter"
                        ? "8.5in x 11in (Letter)"
                        : "210mm x 297mm (A4)"}
                    </span>
                  </div>

                  {/* Interactive WYSIWYG Paper Layer */}
                  <div
                    id="printable-invoice-area"
                    className={`w-full bg-white text-slate-950 shadow-2xl md:rounded-2xl overflow-hidden relative ${invoice.typography || "font-sans"}`}
                    style={{ minHeight: invoice.paperSize === "letter" ? "1050px" : "1120px" }}
                  >
                    {/* Watermark Overlay */}
                    {invoice.watermarkText && (
                      <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10 select-none overflow-hidden">
                        <span className="text-7xl md:text-8xl font-black text-slate-700/20 dark:text-slate-500/15 uppercase tracking-widest -rotate-45 leading-none text-center whitespace-normal break-normal px-4">
                          {invoice.watermarkText}
                        </span>
                      </div>
                    )}

                    {/* Template Switcher */}
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

                  <div className="no-print mt-6 w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-md select-none">
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
                        onPrint={handlePrint}
                        onExportPNG={handleExportPNG}
                        onExportPDF={handleExportPDF}
                      />
                    </div>
                  </div>
                </div>
              </main>
            </>
          }
        />

        {/* --- INFORMATION SUB-PAGES ROUTER NODES --- */}
        <Route path="/about" element={<AboutPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms-of-use" element={<TermsOfUsePage />} />
      </Routes>

      <Footer />

      {/* --- TOAST MESSENGER LAYOUT --- */}
      {toast && !isExporting && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
