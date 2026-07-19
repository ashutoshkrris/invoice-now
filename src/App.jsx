import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

// Layout & Custom Extensions Modules
import Navbar from "./components/Navbar/Navbar";
import InvoiceToolbar from "./components/InvoiceToolbar/InvoiceToolbar";
import InvoiceWorkspace from "./components/InvoiceWorkspace/InvoiceWorkspace";
import Footer from "./components/Footer/Footer";
import Toast from "./components/Toast/Toast";
import { ExportLoader } from "./components/shared/ExportLoader";
import AnnouncementModal from "./components/shared/AnnouncementModal";
import { InvoiceSwitcher } from "./components/InvoiceSwitcher/InvoiceSwitcher";

// Pages Layer Modules
import AboutPage from "./pages/AboutPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsOfUsePage from "./pages/TermsOfUsePage";

// Modular Engine Hook & File Export System Calls
import { useInvoiceEditor } from "./hooks/useInvoiceEditor";
import { runSystemPrint, exportToPNG, exportToPDF } from "./utils/pdfExportEngine";

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const [toast, setToast] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  const triggerToast = (message, type = "success") => setToast({ message, type });
  const editor = useInvoiceEditor(triggerToast);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const activeCurrencySymbol = editor.invoice.currencySymbol || "$";

  const actionHandlers = {
    onUpdateField: editor.updateField,
    onUpdateNestedItem: editor.updateNestedItem,
    onRemoveLineItem: editor.removeLineItem,
    onAddLineItem: editor.addLineItem,
    onLogoUpload: editor.handleLogoUpload,
    onLogoDelete: editor.handleLogoDelete,
    onPrint: () => runSystemPrint(editor.invoice, setIsExporting),
    onExportPNG: () => exportToPNG(editor.invoice, setIsExporting, triggerToast),
    onExportPDF: () => exportToPDF(editor.invoice, setIsExporting, triggerToast),
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-900 transition-colors duration-200">
      <Navbar theme={theme} onThemeToggle={() => setTheme(theme === "dark" ? "light" : "dark")} />

      {/* Multi-Document Workspace Switcher Overlay Control Drawer */}
      {editor.isHydrated && (
        <InvoiceSwitcher
          activeInvoiceId={editor.activeInvoiceId}
          invoiceRegistry={editor.invoiceRegistry}
          switchInvoiceWorkspace={editor.switchInvoiceWorkspace}
          handleCreateNewInvoice={editor.handleCreateNewInvoice}
          handleDeleteInvoice={editor.handleDeleteInvoice}
          handleDuplicateInvoice={editor.handleDuplicateInvoice}
          handleRenameInvoice={editor.handleRenameInvoice}
          handleExportBackup={editor.handleExportBackup}
          handleImportBackup={editor.handleImportBackup}
          triggerToast={triggerToast}
        />
      )}

      <Routes>
        <Route
          path="/"
          element={
            // Prevent component layout injection crashes before database properties map completes resolution
            !editor.isHydrated ? (
              <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-900">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <>
                <InvoiceToolbar
                  invoice={editor.invoice}
                  historyIdx={editor.historyIdx}
                  historyLength={editor.historyLength}
                  onUpdateField={editor.updateField}
                  onCountryChange={editor.handleCountryChange}
                  onUndo={editor.handleUndo}
                  onRedo={editor.handleRedo}
                />
                <InvoiceWorkspace
                  invoice={editor.invoice}
                  totals={editor.calculatedTotals}
                  activeCurrencySymbol={activeCurrencySymbol}
                  isExporting={isExporting}
                  onActions={actionHandlers}
                />
              </>
            )
          }
        />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms-of-use" element={<TermsOfUsePage />} />
      </Routes>

      <Footer />

      {toast && !isExporting && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      <ExportLoader isExporting={isExporting} />

      {/* Dynamic, single-trigger announcement gateway */}
      <AnnouncementModal />
    </div>
  );
}
