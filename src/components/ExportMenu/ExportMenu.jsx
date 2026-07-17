import { useState, useRef, useEffect } from "react";
import { Icons } from "../Icons"; // Corrected folder step resolution matching original layout tree

export default function ExportMenu({ onPrint, onExportPNG, onExportPDF, isFloating }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Monitor document clicks globally to dismiss drop options if focus shifts away
  useEffect(() => {
    function handleClickOutside(event) {
      // Close dropdown if target isn't contained within the wrapper ref anchor
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    // Remove listeners when unmounting to eliminate potential event leaks
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative no-print" ref={menuRef} data-testid="export-menu-container">
      {isFloating ? (
        /* Variant Option A: Sleek Circular Floating Trigger Icon Button */
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center h-12 w-12 bg-brand-600 hover:bg-brand-700 text-white rounded-full shadow-2xl cursor-pointer transition-all active:scale-95 duration-200"
          title="Export Options"
          aria-label="Export options floating trigger"
        >
          {isOpen ? (
            <Icons.ChevronDown
              className="h-5 w-5 rotate-180 transition-transform duration-200"
              data-testid="icon-chevron"
            />
          ) : (
            <Icons.Download className="h-5 w-5" data-testid="icon-download" />
          )}
        </button>
      ) : (
        /* Variant Option B: Standard Wide Button (Used in the baseline footer card) */
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-colors h-[36px]"
          aria-label="Export invoice trigger"
        >
          <Icons.Download className="h-4 w-4" />
          <span>Export As</span>
          <span
            className="inline-flex items-center justify-center transition-transform duration-200"
            style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
          >
            <Icons.ChevronDown className="h-3 w-3" />
          </span>
        </button>
      )}

      {/* Conditional Action Overlay Panel Layer */}
      {isOpen && (
        <div
          className={`absolute bottom-full mb-2 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 p-1 flex flex-col gap-0.5 animate-in fade-in slide-in-from-bottom-2 duration-150 ${
            isFloating ? "-right-2 sm:right-0" : "left-0 sm:left-auto sm:right-0"
          }`}
          data-testid="export-dropdown-panel"
        >
          {/* Print trigger capability hidden by design parameters */}
          <button
            onClick={() => {
              onPrint();
              setIsOpen(false);
            }}
            className="flex items-center gap-2 px-3 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg cursor-pointer w-full hidden"
          >
            <Icons.Print className="h-3.5 w-3.5" /> Print / Save System
          </button>

          <button
            onClick={() => {
              onExportPDF();
              setIsOpen(false);
            }}
            className="flex items-center gap-2 px-3 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg cursor-pointer w-full"
          >
            <Icons.FileText className="h-3.5 w-3.5" /> Download PDF Document
          </button>

          <button
            onClick={() => {
              onExportPNG();
              setIsOpen(false);
            }}
            className="flex items-center gap-2 px-3 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg cursor-pointer w-full"
          >
            <Icons.Image className="h-3.5 w-3.5" /> Download PNG Image
          </button>
        </div>
      )}
    </div>
  );
}
