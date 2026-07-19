import { useState, useEffect, useRef, useMemo } from "react";
import { Icons } from "../shared/Icons";
import ConfirmationModal from "../shared/ConfirmationModal";
import { CONSTANTS } from "../../constants/globalConstants";

export function InvoiceSwitcher({
  activeInvoiceId,
  invoiceRegistry,
  switchInvoiceWorkspace,
  handleCreateNewInvoice,
  handleDeleteInvoice,
  triggerToast,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const sidebarRef = useRef(null);
  const searchInputRef = useRef(null);

  const maxInvoicesThreshold = CONSTANTS.MAX_INVOICE_LIMIT || 25;

  // --- DISMISS ON EXTERNAL CLICK ---
  useEffect(() => {
    function handleClickOutside(event) {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        if (!event.target.closest('[data-testid="workspace-trigger"]')) {
          setIsOpen(false);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // --- KEYBOARD SHORTCUT INITIALIZATION (Ctrl/Cmd + K) ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // --- AUTO-FOCUS ON OPEN ---
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current.focus(), 100);
    }
  }, [isOpen]);

  // --- FILTER & SORT REGISTRY ENGINE ---
  const processedInvoices = useMemo(() => {
    const query = searchQuery.toLowerCase();

    const filtered = invoiceRegistry.filter((inv) => {
      return (
        inv.invoiceNumber?.toLowerCase().includes(query) ||
        inv.clientName?.toLowerCase().includes(query)
      );
    });

    // Sort by timestamp descending (Newest updates first)
    return filtered.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  }, [invoiceRegistry, searchQuery]);

  // --- PURE DATE FORMATTER ---
  const formatLastUpdated = (timestamp) => {
    if (!timestamp) return "Draft";
    return new Date(timestamp).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Intercept event loop safely and staging parameters
  const triggerDeleteConfirmation = (e, id, invoiceNumber) => {
    e.stopPropagation();
    if (invoiceRegistry.length <= 1) {
      triggerToast("You can't delete the last invoice. At least one invoice must remain.", "error");
      return;
    }
    setDeleteTarget({ id, invoiceNumber });
  };

  // Helper handling maximum creation bounds safely
  const onCreateWorkspaceClick = () => {
    if (invoiceRegistry.length >= maxInvoicesThreshold) {
      if (typeof triggerToast === "function") {
        triggerToast(
          `Invoice limit reached. Maximum allowed is ${maxInvoicesThreshold} invoices. Delete old invoices to create new. Make sure to save them locally before deleting.`,
          "warning"
        );
      }
      return; // Stop execution out immediately
    }

    // Otherwise proceed with creation sequence safely
    handleCreateNewInvoice();
    setSearchQuery("");
  };

  const isMac = navigator.platform.toUpperCase().includes("MAC");
  const shortcut = isMac ? "⌘K" : "Ctrl+K";

  return (
    <>
      {/* FLOATING TRIGGER BUTTON */}
      <div className="fixed bottom-6 left-6 z-40 no-print flex items-center gap-3">
        <button
          onClick={() => setIsOpen(!isOpen)}
          data-testid="workspace-trigger"
          className="flex items-center justify-center h-12 w-12 bg-brand-600 hover:bg-brand-700 text-white rounded-full shadow-2xl cursor-pointer transition-all active:scale-95 duration-200"
          title="Switch Invoice Workspace (Ctrl+K)"
          aria-label="Workspace directory floating trigger"
        >
          {isOpen ? (
            <Icons.Close className="h-5 w-5 transition-transform duration-200" />
          ) : (
            <Icons.GridMenu className="h-5 w-5" />
          )}
        </button>

        <span className="hidden md:inline-block px-2 py-1 bg-slate-900/80 backdrop-blur-sm text-[10px] font-bold text-white tracking-wider rounded-lg shadow-md pointer-events-none select-none uppercase">
          Workspaces <kbd className="ml-1 opacity-70 font-mono">{shortcut}</kbd>
        </span>
      </div>

      {/* BACKDROP GLASS OVERLAY */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm transition-opacity" />
      )}

      {/* FLYOUT COMPONENT DRAWER */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 bottom-0 z-50 w-80 max-w-[calc(100vw-3rem)] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* UPPER HEADER CONTROLS */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide">
              Workspaces
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
            >
              <Icons.Close className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onCreateWorkspaceClick}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors cursor-pointer h-[36px]"
            title={
              invoiceRegistry.length >= (CONSTANTS?.MAX_INVOICE_LIMIT || 25)
                ? `Maximum threshold reached (${CONSTANTS.MAX_INVOICE_LIMIT} invoices)`
                : "Create new invoice"
            }
          >
            <Icons.Plus className="w-4 h-4" strokeWidth={2.5} />
            <span>New Invoice</span>
          </button>

          <div className="relative">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search invoices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-white dark:bg-slate-900 focus:bg-white border border-slate-200 dark:border-slate-800 focus:border-slate-300 dark:focus:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none transition-all"
            />
            <Icons.Search className="absolute left-2.5 top-2.5 text-slate-400 w-3.5 h-3.5" />
          </div>
        </div>

        {/* WORKSPACE DIRECTORY VIEWPORT */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {processedInvoices.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-400 font-semibold">
              No matching records found
            </div>
          ) : (
            processedInvoices.map((item) => {
              const isActive = item.id === activeInvoiceId;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    switchInvoiceWorkspace(item.id);
                    if (window.innerWidth < 640) setIsOpen(false);
                  }}
                  className={`group relative w-full flex items-center justify-between p-3 rounded-xl text-left transition-all cursor-pointer border ${
                    isActive
                      ? "bg-slate-50 dark:bg-slate-800/50 border-brand-500/30 dark:border-brand-500/20 shadow-sm"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800/30 border-transparent"
                  }`}
                >
                  <div className="flex flex-col min-w-0 pr-4">
                    <span
                      className={`text-xs font-bold truncate ${isActive ? "text-brand-600 dark:text-brand-400" : "text-slate-700 dark:text-slate-300"}`}
                    >
                      {item.clientName || "Unnamed Client"}
                    </span>
                    <div className="flex flex-col items-start gap-1 mt-1 text-[10px] font-semibold text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-md border border-slate-200/60 dark:border-slate-700/60 text-slate-500 dark:text-slate-400">
                          {item.invoiceNumber || "Draft"}
                        </span>
                      </div>
                      <span className="text-[9px] text-slate-400/80 font-medium">
                        Updated: {formatLastUpdated(item.updatedAt)}
                      </span>
                    </div>
                  </div>

                  {/* DELETION TRIGGER */}
                  <button
                    onClick={(e) => triggerDeleteConfirmation(e, item.id, item.invoiceNumber)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 sm:opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                    title="Delete Invoice"
                  >
                    <Icons.Trash className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-center text-[10px] font-mono tracking-tight text-slate-400 select-none">
          Invoice Now • Built Local & Secure
        </div>
      </div>

      {/* GLOBAL CONFIRMATION PORTAL MODAL */}
      <ConfirmationModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Invoice"
        message={`Are you sure you want to delete ${deleteTarget?.invoiceNumber || "this invoice"}? This operation cannot be undone.`}
        confirmLabel="Delete Invoice"
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            handleDeleteInvoice(deleteTarget.id);
            if (typeof triggerToast === "function") {
              triggerToast(
                `Invoice ${deleteTarget.invoiceNumber || ""} deleted successfully`,
                "success"
              );
            }
          }
        }}
      />
    </>
  );
}
