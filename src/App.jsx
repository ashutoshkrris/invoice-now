import { useState, useEffect, useMemo } from "react";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import Header from "./components/Header";
import Toast from "./components/Toast";
import BoldProfessionalTemplate from "./templates/BoldProfessionalTemplate";
import ClassicTemplate from "./templates/ClassicTemplate";
import EmeraldPremiumTemplate from "./templates/EmeraldPremiumTemplate";
import ModernMinimalistTemplate from "./templates/ModernMinimalistTemplate";
import RetailBoutiqueTemplate from "./templates/RetailBoutiqueTemplate";

// Preset Imports
import { INITIAL_INVOICE_STATE, COUNTRIES } from "./constants/invoicePresets";
import { loadCachedState, persistState } from "./utils/storage";

// Generic Layout Nodes

// Bifurcated Template Formats

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
    let itemSubtotal = 0;
    let itemTax = 0;

    invoice.items.forEach((item) => {
      const rowBase = (item.qty || 0) * (item.price || 0);
      const rowDiscount = (rowBase * (item.discount || 0)) / 100;
      const rowSub = rowBase - rowDiscount;
      const rowTax = (rowSub * (item.taxRate || 0)) / 100;

      itemSubtotal += rowSub;
      itemTax += rowTax;
    });

    let overallDiscount = 0;
    if (invoice.discountType === "percentage") {
      overallDiscount = (itemSubtotal * (invoice.discountValue || 0)) / 100;
    } else {
      overallDiscount = invoice.discountValue || 0;
    }

    const shipping = parseFloat(invoice.shippingCharges) || 0;
    const adjustments = parseFloat(invoice.additionalCharges) || 0;
    const totalDue = itemSubtotal - overallDiscount + itemTax + shipping + adjustments;
    const balanceDue = totalDue - (parseFloat(invoice.amountPaid) || 0);

    return {
      subtotal: itemSubtotal,
      overallDiscount,
      tax: itemTax,
      grandTotal: totalDue,
      balanceDue,
    };
  }, [invoice]);

  // --- INLINE ITEM MANAGEMENT ---
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
  const handlePrint = () => {
    setIsExporting(true);
    setTimeout(() => {
      window.print();
      setIsExporting(false);
    }, 300);
  };

  const handleExportPNG = () => {
    setIsExporting(true);
    triggerToast("Rendering high-res PNG image...", "info");

    setTimeout(async () => {
      const target = document.getElementById("printable-invoice-area");
      if (!target) {
        setIsExporting(false);
        return;
      }
      try {
        // html-to-image handles oklch/oklab perfectly out of the box!
        const dataUrl = await toPng(target, {
          quality: 0.95,
          pixelRatio: 3, // Maintains sharp text matching previous scale
          backgroundColor: "#ffffff",
          // Skip external scripts or widgets that block style rule parsing
          filter: (node) => {
            if (node.tagName === "LINK" && node.getAttribute("rel") === "stylesheet") {
              const href = node.getAttribute("href");
              // Allow relative local CSS, catch cross-origin blockers
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
        console.error("PNG render failed", err);
        triggerToast("PNG render failed", "error");
      } finally {
        setIsExporting(false);
      }
    }, 400);
  };

  const handleExportPDF = () => {
    setIsExporting(true);
    triggerToast("Compiling print-quality Vector PDF...", "info");

    setTimeout(async () => {
      const target = document.getElementById("printable-invoice-area");
      if (!target) {
        setIsExporting(false);
        return;
      }
      try {
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

        // We can safely read target element sizes to maintain pixel-perfect height mappings
        const imgWidth = target.offsetWidth;
        const imgHeight = target.offsetHeight;
        const ratio = imgHeight / imgWidth;
        const pdfHeight = pdfWidth * ratio;

        pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight, undefined, "FAST");
        pdf.save(`${invoice.invoiceNumber || "invoice"}.pdf`);
        triggerToast("PDF document download complete!");
      } catch (err) {
        console.error("PDF engine crash", err);
        triggerToast("PDF compilation failed", "error");
      } finally {
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

  // Shared props object passed down via clean structural patterns
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
      <Header
        invoice={invoice}
        theme={theme}
        historyIdx={historyIdx}
        historyLength={history.length}
        onUpdateField={updateField}
        onCountryChange={handleCountryChange}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onPrint={handlePrint}
        onExportPNG={handleExportPNG}
        onExportPDF={handleExportPDF}
        onThemeToggle={() => setTheme(theme === "dark" ? "light" : "dark")}
      />

      {/* --- WORKSPACE EDITOR --- */}
      <main className="flex-1 overflow-y-auto bg-slate-100 dark:bg-slate-900/60 bg-grid py-8 px-4 flex justify-center items-start">
        <div className="w-full max-w-[840px] relative">
          <div className="no-print mb-4 flex items-center justify-between text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-2">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span> Click
              any field below to rewrite details
            </span>
            <span>
              {invoice.paperSize === "letter" ? "8.5in x 11in (Letter)" : "210mm x 297mm (A4)"}
            </span>
          </div>

          {/* Interactive WYSIWYG Paper Layer */}
          <div
            id="printable-invoice-area"
            className={`w-full bg-white text-slate-950 shadow-2xl md:rounded-2xl overflow-hidden relative ${invoice.typography || "font-sans"}`}
            style={{ minHeight: invoice.paperSize === "letter" ? "1050px" : "1120px" }}
          >
            {/* Watermark Overlay */}
            {invoice.showWatermark && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10 select-none overflow-hidden">
                <span className="text-8xl font-black text-slate-400/10 uppercase tracking-widest -rotate-45 leading-none">
                  DRAFT
                </span>
              </div>
            )}

            {/* Template Router Switch */}
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
            {invoice.templateId === "retail" && <RetailBoutiqueTemplate {...templateProps} />}
          </div>
        </div>
      </main>

      {/* --- TOAST MESSENGER LAYOUT --- */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
