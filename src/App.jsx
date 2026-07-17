import { useState, useEffect, useMemo, useRef } from "react";
import { Routes, Route } from "react-router-dom";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";

// Navigation & Layout Structure Components
import Navbar from "./components/Navbar/Navbar";
import InvoiceToolbar from "./components/InvoiceToolbar/InvoiceToolbar";
import Footer from "./components/Footer/Footer";
import Toast from "./components/Toast/Toast";
import ExportMenu from "./components/ExportMenu/ExportMenu";

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
  const [showFloatingButton, setShowFloatingButton] = useState(true);
  const footerCardRef = useRef(null);

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // If the stationary bottom footer card is visible in the viewport, hide the floating button
        setShowFloatingButton(!entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0.1, // Triggers as soon as 10% of the footer card shows up
        rootMargin: "0px 0px 50px 0px", // Slight buffer to hide it just before impact
      }
    );

    const currentRef = footerCardRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

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
    let rawItemSubtotal = 0; // Pure sum of (qty * price)
    let totalTax = 0;
    let totalDiscount = 0;
    let itemSubtotalAfterDiscounts = 0; // Running total to anchor global calculations

    invoice.items.forEach((item) => {
      // 1. Sanitize baseline inputs safely
      const qty = parseInt(item.qty, 10) || 0;
      const price = parseFloat(item.price) || 0;
      const rawSub = qty * price;

      rawItemSubtotal += rawSub;

      // 2. Handle Item-Level Discounts
      let rowDiscount = 0;
      if (invoice.discountScope === "item") {
        const discount = parseFloat(item.discount) || 0;
        rowDiscount = invoice.discountType === "percentage" ? (rawSub * discount) / 100 : discount;
      }
      totalDiscount += rowDiscount;
      const runningSubtotal = rawSub - rowDiscount;
      itemSubtotalAfterDiscounts += runningSubtotal;

      // 3. Handle Item-Level Taxes
      let rowTax = 0;
      if (invoice.taxScope === "item") {
        const taxRate = parseFloat(item.taxRate) || 0;
        rowTax = invoice.taxType === "percentage" ? (runningSubtotal * taxRate) / 100 : taxRate;
        totalTax += rowTax;
      }
    });

    // 4. Handle Global Subtotal-Level Adjustments
    let globalDiscountAmount = 0;
    if (invoice.discountScope === "subtotal") {
      const globalDisc = parseFloat(invoice.globalDiscount) || 0;
      globalDiscountAmount =
        invoice.discountType === "flat"
          ? globalDisc
          : (itemSubtotalAfterDiscounts * globalDisc) / 100;
      totalDiscount += globalDiscountAmount;
    }

    if (invoice.taxScope === "subtotal") {
      const globalTax = parseFloat(invoice.globalTaxRate) || 0;
      const taxBase = itemSubtotalAfterDiscounts - globalDiscountAmount;
      const globalTaxAmount = invoice.taxType === "flat" ? globalTax : (taxBase * globalTax) / 100;
      totalTax += globalTaxAmount;
    }

    // 5. Compute Final Aggregates
    const shipping = parseFloat(invoice.shippingCharges) || 0;

    // Standard accounting flow using raw subtotal minus the exact total absolute discount
    const grandTotal = rawItemSubtotal - totalDiscount + totalTax + shipping;

    const paid = parseFloat(invoice.amountPaid) || 0;
    const balanceDue = grandTotal - paid;

    return {
      subtotal: rawItemSubtotal, // UI summary shows the clean, raw pre-discount subtotal
      discount: totalDiscount, // Absolute total discount cash value
      tax: totalTax, // Absolute total tax cash value
      grandTotal,
      balanceDue,
    };
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

    // 1. Establish the clean baseline layout structure
    target.style.width = "794px";
    const isLetter = invoice.paperSize === "letter";
    const singlePageHeight = isLetter ? 1050 : 1120;
    target.style.minHeight = `${singlePageHeight}px`;

    // 2. Select EVERY structural element, paragraph, list item, and block layout
    const allElements = target.querySelectorAll("p, h1, h2, h3, h4, tr, th, div, blockquote");
    const injectedSpacers = [];

    allElements.forEach((el) => {
      // Skip wrapper containers that hold the entire page to avoid layout inflation
      if (el === target || el.contains(target) || el.offsetHeight > singlePageHeight) return;

      // Get the exact coordinates of this element relative to the invoice top boundary
      const elementTop = el.getBoundingClientRect().top - target.getBoundingClientRect().top;
      const elementBottom = elementTop + el.offsetHeight;

      const pageOfTop = Math.floor(elementTop / singlePageHeight);
      const pageOfBottom = Math.floor(elementBottom / singlePageHeight);

      // CRITICAL GLOBAL FIX: If any element crosses a page boundary line, push it entirely to the next page
      if (pageOfTop !== pageOfBottom) {
        const remainingSpaceOnCurrentPage = singlePageHeight * (pageOfTop + 1) - elementTop;

        const globalSpacer = document.createElement("div");
        globalSpacer.className = "injected-pdf-spacer no-print";
        // Inject the dynamic pixel padding height to cushion the text block safely
        globalSpacer.style.height = `${remainingSpaceOnCurrentPage + 8}px`;

        el.parentNode.insertBefore(globalSpacer, el);
        injectedSpacers.push(globalSpacer);
      }
    });

    // 3. Perfect cleanup loop to strip spacers when the image capture finishes
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

      // --- 1. CAPTURE RENDER ADJUSTMENTS (No PDF spacers injected here!) ---
      const originalWidth = target.style.width;
      const originalMinHeight = target.style.minHeight;

      // Standardize to matching desktop width metrics for consistent high-res scaling
      target.style.width = "794px";
      const isLetter = invoice.paperSize === "letter";
      target.style.minHeight = isLetter ? "1050px" : "1120px";

      try {
        await new Promise((resolve) => setTimeout(resolve, 60)); // Small layout breathing buffer

        const dataUrl = await toPng(target, {
          quality: 0.95,
          pixelRatio: 3, // Kept at your high-definition 3x sharpness parameter
          backgroundColor: "#ffffff",
          filter: (node) => {
            // Mutate child elements dynamically so tables drop standard overflow restrictions
            if (node.style) {
              node.style.overflow = "visible";
              node.style.overflowX = "visible";
              node.style.overflowY = "visible";
              if (node.classList?.contains("overflow-x-auto")) {
                node.style.scrollbarWidth = "none";
              }
            }

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

        // 2. TRIGGER DOWNSTREAM DOWNLOAD PIPELINE
        const link = document.createElement("a");
        link.download = `${invoice.invoiceNumber || "invoice"}.png`;
        link.href = dataUrl;
        link.click();

        triggerToast("PNG Image download complete!");
      } catch (err) {
        console.error("PNG generation failed", err);
        triggerToast("PNG generation failed", "error");
      } finally {
        // --- 3. GUARANTEED STATE CLEANUP ---
        target.style.width = originalWidth;
        target.style.minHeight = originalMinHeight;
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

      // --- 1. GLOBAL PRE-RENDER SCANNED PAGINATION BUFFER WRAPPER ---
      const originalWidth = target.style.width;
      const originalMinHeight = target.style.minHeight;

      // Standardize target sizing metrics
      target.style.width = "794px";
      const isLetter = invoice.paperSize === "letter";
      const singlePageHeight = isLetter ? 1050 : 1120;
      target.style.minHeight = `${singlePageHeight}px`;

      // Select structural DOM targets to inspect for cross-page slicing vulnerabilities
      const allElements = target.querySelectorAll("p, h1, h2, h3, h4, tr, th, div, blockquote");
      const injectedSpacers = [];

      allElements.forEach((el) => {
        // Skip top-level system container frameworks or entries taller than a full canvas block
        if (el === target || el.contains(target) || el.offsetHeight > singlePageHeight) return;

        // Extract accurate pixel offset metrics relative to the current container ceiling boundary
        const elementTop = el.getBoundingClientRect().top - target.getBoundingClientRect().top;
        const elementBottom = elementTop + el.offsetHeight;

        const pageOfTop = Math.floor(elementTop / singlePageHeight);
        const pageOfBottom = Math.floor(elementBottom / singlePageHeight);

        // GLOBAL DEFENSIVE FIX: If any text string or node splits a boundary, cushion it to the next page
        if (pageOfTop !== pageOfBottom) {
          const remainingSpaceOnCurrentPage = singlePageHeight * (pageOfTop + 1) - elementTop;

          const globalSpacer = document.createElement("div");
          globalSpacer.className = "injected-pdf-spacer no-print";
          globalSpacer.style.height = `${remainingSpaceOnCurrentPage + 8}px`; // Fills page break gaps cleanly

          el.parentNode.insertBefore(globalSpacer, el);
          injectedSpacers.push(globalSpacer);
        }
      });

      // --- 2. EXECUTE THE MULTI-PAGE CANVAS PIPELINE ---
      try {
        await new Promise((resolve) => setTimeout(resolve, 60)); // Small buffer for DOM positioning adjustment

        const dataUrl = await toPng(target, {
          quality: 0.95,
          pixelRatio: 2.5,
          backgroundColor: "#ffffff",
          filter: (node) => {
            if (node.style) {
              node.style.overflow = "visible";
              node.style.overflowX = "visible";
              node.style.overflowY = "visible";
              // Strip out custom webkit scrollbar tracks entirely if present
              if (node.classList?.contains("overflow-x-auto")) {
                node.style.scrollbarWidth = "none";
              }
            }

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

        const format = isLetter ? "letter" : "a4";
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: format,
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfPageHeight = pdf.internal.pageSize.getHeight();

        const imgWidth = target.offsetWidth;
        const imgHeight = target.offsetHeight;
        const ratio = imgHeight / imgWidth;

        const totalPdfImgHeight = pdfWidth * ratio;

        let heightLeft = totalPdfImgHeight;
        let position = 0;

        // Render Page 1
        pdf.addImage(dataUrl, "PNG", 0, position, pdfWidth, totalPdfImgHeight, undefined, "FAST");
        heightLeft -= pdfPageHeight;

        // Slice through remaining layout viewport chunks sequentially
        while (heightLeft > 0) {
          position = heightLeft - totalPdfImgHeight;

          pdf.addPage();
          pdf.addImage(dataUrl, "PNG", 0, position, pdfWidth, totalPdfImgHeight, undefined, "FAST");
          heightLeft -= pdfPageHeight;
        }

        pdf.save(`${invoice.invoiceNumber || "invoice"}.pdf`);
        triggerToast("PDF document download complete!");
      } catch (err) {
        console.error("PDF engine crash", err);
        triggerToast("PDF generation failed", "error");
      } finally {
        // --- 3. CLEANUP STEP: REMOVE TEMPORARY PADDING BLOCKS ---
        target.style.width = originalWidth;
        target.style.minHeight = originalMinHeight;
        injectedSpacers.forEach((spacer) => spacer.remove());
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

                  <div
                    ref={footerCardRef}
                    className="no-print mt-6 w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-md select-none"
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
                        onPrint={handlePrint}
                        onExportPNG={handleExportPNG}
                        onExportPDF={handleExportPDF}
                      />
                    </div>
                  </div>
                </div>

                {/* SMART FLOATING ACTION BUTTON CONTAINER */}
                <div
                  className={`fixed bottom-6 right-6 z-40 transition-all duration-300 transform no-print ${
                    showFloatingButton
                      ? "opacity-100 translate-y-0 scale-100"
                      : "opacity-0 translate-y-4 scale-90 pointer-events-none"
                  }`}
                >
                  <div className="shadow-2xl rounded-xl">
                    <ExportMenu
                      onPrint={handlePrint}
                      onExportPNG={handleExportPNG}
                      onExportPDF={handleExportPDF}
                      isFloating={true}
                    />
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
