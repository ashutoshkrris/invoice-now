import { useState, useRef, useEffect } from "react";
import { Icons } from "./Icons";

export default function ExportMenu({ onPrint, onExportPNG, onExportPDF }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative no-print" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-colors h-[36px]"
      >
        <Icons.Download className="h-4 w-4" />
        <span>Export As</span>
        <Icons.ChevronDown
          className={`h-3 w-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 sm:left-auto sm:right-0 mb-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 p-1 flex flex-col gap-0.5 animate-in fade-in slide-in-from-bottom-1 duration-100">
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
