import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { BRAND_COLORS } from "../constants/invoicePresets";
import { COUNTRIES } from "../constants/countries";
import { Icons } from "./Icons";

export default function InvoiceToolbar({
  invoice,
  historyIdx,
  historyLength,
  onUpdateField,
  onCountryChange,
  onUndo,
  onRedo,
  onPrint,
  onExportPNG,
  onExportPDF,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Searchable Country Dropdown States
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [countrySearchQuery, setCountrySearchQuery] = useState("");
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

  // Custom Watermark Modal States
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [customInput, setCustomInput] = useState("");

  const dropdownRef = useRef(null);
  const countryDropdownRef = useRef(null);

  const updateDropdownCoords = () => {
    if (countryDropdownRef.current) {
      const rect = countryDropdownRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  };

  useEffect(() => {
    if (isCountryDropdownOpen) {
      updateDropdownCoords();
      window.addEventListener("resize", updateDropdownCoords);
      window.addEventListener("scroll", updateDropdownCoords);
    }
    return () => {
      window.removeEventListener("resize", updateDropdownCoords);
      window.removeEventListener("scroll", updateDropdownCoords);
    };
  }, [isCountryDropdownOpen]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsExportOpen(false);
      }
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target)) {
        const portalNode = document.getElementById("portal-country-dropdown");
        if (portalNode && portalNode.contains(event.target)) return;

        setIsCountryDropdownOpen(false);
        setCountrySearchQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCustomModalSubmit = (e) => {
    e.preventDefault();
    onUpdateField("watermarkText", customInput.trim().toUpperCase());
    setIsCustomModalOpen(false);
  };

  const isPresetWatermark = ["DRAFT", "PAID", "OVERDUE", ""].includes(invoice.watermarkText);

  return (
    <div className="no-print w-full bg-white/95 dark:bg-slate-950/95 border-b border-slate-200 dark:border-slate-800 shadow-xs px-4 md:px-6 py-2 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-2 xl:gap-0 transition-all box-border">
      {/* Undo/Redo & Quick Control Panels Row */}
      <div className="flex items-center justify-between w-full xl:w-auto">
        <div className="flex items-center gap-1.5">
          <button
            onClick={onUndo}
            disabled={historyIdx === 0}
            className="p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 disabled:opacity-40 hover:text-slate-950 dark:hover:text-white transition-transform active:scale-95 cursor-pointer"
            title="Undo"
          >
            <Icons.Undo className="h-4 w-4" />
          </button>
          <button
            onClick={onRedo}
            disabled={historyIdx >= historyLength - 1}
            className="p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 disabled:opacity-40 hover:text-slate-950 dark:hover:text-white transition-transform active:scale-95 cursor-pointer"
            title="Redo"
          >
            <Icons.Redo className="h-4 w-4" />
          </button>
        </div>

        {/* Dynamic configuration menu triggers */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`p-2 border rounded-lg active:scale-95 transition-all flex items-center gap-1 text-xs font-bold cursor-pointer xl:hidden ${
            isOpen
              ? "bg-brand-600 border-brand-600 text-white"
              : "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
          }`}
        >
          <Icons.Settings />
          <span>{isOpen ? "Hide" : "Config"}</span>
        </button>
      </div>

      {/* Configuration Grid Panel wrapper element */}
      <div
        className={`grid transition-all duration-300 ease-in-out w-full xl:w-auto ${
          isOpen
            ? "grid-rows-[1fr] opacity-100 mt-2 xl:mt-0"
            : "grid-rows-[0fr] opacity-0 xl:opacity-100 xl:grid-rows-1"
        }`}
      >
        <div className="overflow-hidden xl:overflow-visible flex flex-col xl:flex-row items-stretch xl:items-end gap-4 w-full xl:w-auto">
          <div className="flex flex-wrap xl:flex-nowrap items-center gap-3 w-full xl:w-auto">
            {/* Country Dropdown selection */}
            <div
              ref={countryDropdownRef}
              className="flex flex-col flex-1 min-w-[140px] xl:flex-none xl:w-38 relative text-left"
            >
              <label className="text-[9px] font-extrabold uppercase text-slate-400 dark:text-slate-500 mb-1">
                Country Rules Preset
              </label>
              <button
                type="button"
                onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                className="w-full flex justify-between items-center px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 h-[30px] cursor-pointer text-left"
              >
                <span className="truncate">
                  {COUNTRIES.find((c) => c.code === (invoice.countryCode || "IN"))?.name ||
                    "India (₹)"}
                </span>
                <span
                  className={`text-[9px] text-slate-400 transition-transform ${isCountryDropdownOpen ? "rotate-180" : ""}`}
                >
                  ▼
                </span>
              </button>

              {isCountryDropdownOpen &&
                createPortal(
                  <div
                    id="portal-country-dropdown"
                    style={{
                      position: "absolute",
                      top: `${coords.top}px`,
                      left: `${coords.left}px`,
                      width: `${Math.max(coords.width, 210)}px`,
                    }}
                    className="mt-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl z-9999 overflow-hidden flex flex-col max-h-60"
                  >
                    <div className="p-1.5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30">
                      <input
                        type="text"
                        autoFocus
                        placeholder="Search country..."
                        value={countrySearchQuery}
                        onChange={(e) => setCountrySearchQuery(e.target.value)}
                        className="w-full px-2 py-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-xs font-medium outline-none text-slate-700 dark:text-slate-300"
                      />
                    </div>
                    <div className="overflow-y-auto flex-1 divide-y divide-slate-50 dark:divide-slate-900/40">
                      {COUNTRIES.filter((c) =>
                        c.name.toLowerCase().includes(countrySearchQuery.toLowerCase())
                      ).length > 0 ? (
                        COUNTRIES.filter((c) =>
                          c.name.toLowerCase().includes(countrySearchQuery.toLowerCase())
                        ).map((c) => (
                          <button
                            key={c.code}
                            type="button"
                            onClick={() => {
                              onCountryChange(c.code);
                              setIsCountryDropdownOpen(false);
                              setCountrySearchQuery("");
                            }}
                            className={`w-full text-left px-3 py-2 text-xs cursor-pointer block truncate ${
                              invoice.countryCode === c.code
                                ? "bg-brand-50/40 dark:bg-brand-950/20 text-brand-600 dark:text-brand-400 font-bold"
                                : "text-slate-700 dark:text-slate-300"
                            }`}
                          >
                            {c.name}
                          </button>
                        ))
                      ) : (
                        <div className="px-2 py-3 text-xs text-slate-400 text-center select-none">
                          No matches
                        </div>
                      )}
                    </div>
                  </div>,
                  document.body
                )}
            </div>

            {/* Template Selector */}
            <div className="flex flex-col flex-1 min-w-[150px] xl:flex-none xl:w-38.75">
              <label className="text-[9px] font-extrabold uppercase text-slate-400 dark:text-slate-500 mb-1">
                Style Template
              </label>
              <select
                value={invoice.templateId}
                onChange={(e) => onUpdateField("templateId", e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold focus:ring-1 focus:ring-brand-500 outline-none text-slate-700 dark:text-slate-300 cursor-pointer h-[30px]"
              >
                <option value="classic">Classic Corporate</option>
                <option value="modern-minimalist">Modern Minimalist</option>
                <option value="bold-professional">Bold Premium</option>
                <option value="emerald-premium">Emerald Executive</option>
                <option value="retail">Retail Receipt</option>
              </select>
            </div>

            {/* Brand Colors configuration slider */}
            <div className="flex flex-col flex-1 min-w-[150px] xl:flex-none shrink-0">
              <label className="text-[9px] font-extrabold uppercase text-slate-400 dark:text-slate-500 mb-1">
                Brand Color
              </label>
              <div className="flex items-center justify-between gap-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-1.5 h-[30px] box-border">
                <div className="flex items-center gap-1">
                  {BRAND_COLORS.map((color) => (
                    <button
                      key={color.hex}
                      type="button"
                      onClick={() => onUpdateField("brandColor", color.hex)}
                      className="h-4 w-4 rounded-full border border-black/10 active:scale-95 cursor-pointer shrink-0"
                      style={{ backgroundColor: color.hex }}
                      title={color.label}
                    />
                  ))}
                </div>
                <input
                  type="color"
                  value={invoice.brandColor}
                  onChange={(e) => onUpdateField("brandColor", e.target.value)}
                  className="h-4 w-4 p-0 border-0 cursor-pointer bg-transparent shrink-0"
                />
              </div>
            </div>

            {/* Typography fonts mapping option group */}
            <div className="flex flex-col flex-1 min-w-[130px] xl:flex-none xl:w-31.25">
              <label className="text-[9px] font-extrabold uppercase text-slate-400 dark:text-slate-500 mb-1">
                Font Family
              </label>
              <select
                value={invoice.typography}
                onChange={(e) => onUpdateField("typography", e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold focus:ring-1 focus:ring-brand-500 text-slate-700 dark:text-slate-300 h-[30px] cursor-pointer"
              >
                <option value="font-sans">Sans (Inter)</option>
                <option value="font-serif">Serif (Playfair)</option>
                <option value="font-mono">Monospace (JetBrains)</option>
              </select>
            </div>

            {/* Canvas structural paper sizing parameter logic */}
            <div className="flex flex-col flex-1 min-w-[110px] xl:flex-none xl:w-27.5">
              <label className="text-[9px] font-extrabold uppercase text-slate-400 dark:text-slate-500 mb-1">
                Paper Format
              </label>
              <select
                value={invoice.paperSize}
                onChange={(e) => onUpdateField("paperSize", e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold focus:ring-1 focus:ring-brand-500 text-slate-700 dark:text-slate-300 h-[30px] cursor-pointer"
              >
                <option value="a4">A4 Standard</option>
                <option value="letter">Letter Size</option>
              </select>
            </div>

            {/* Watermark Selector element */}
            <div className="flex flex-col flex-1 min-w-32.5 xl:flex-none xl:w-35">
              <label className="text-[9px] font-extrabold uppercase text-slate-400 dark:text-slate-500 mb-1">
                Watermark
              </label>
              <div className="flex items-center gap-1.5 relative w-full h-[30px]">
                <select
                  value={
                    !invoice.watermarkText
                      ? ""
                      : isPresetWatermark
                        ? invoice.watermarkText
                        : "custom"
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "custom") {
                      setCustomInput(!isPresetWatermark ? invoice.watermarkText : "");
                      setIsCustomModalOpen(true);
                    } else {
                      onUpdateField("watermarkText", val);
                    }
                  }}
                  className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold focus:ring-1 focus:ring-brand-500 text-slate-700 dark:text-slate-300 h-full cursor-pointer"
                >
                  <option value="">None</option>
                  <option value="DRAFT">Draft</option>
                  <option value="PAID">Paid</option>
                  <option value="OVERDUE">Overdue</option>
                  <option value="custom">Custom</option>
                </select>

                {!isPresetWatermark && invoice.watermarkText && (
                  <button
                    type="button"
                    onClick={() => {
                      setCustomInput(invoice.watermarkText);
                      setIsCustomModalOpen(true);
                    }}
                    className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 shrink-0 cursor-pointer"
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Core App Export triggers row layout */}
          <div className="flex items-center gap-2 relative mt-2 xl:mt-0">
            <button
              onClick={onPrint}
              className="flex-1 xl:flex-none px-4 py-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 cursor-pointer h-[34px] flex items-center justify-center gap-1 hidden"
            >
              <Icons.Print className="h-3.5 w-3.5" /> Print
            </button>

            <div className="relative flex-1 xl:flex-none" ref={dropdownRef}>
              <button
                onClick={() => setIsExportOpen(!isExportOpen)}
                className="w-full xl:w-auto flex items-center justify-center gap-1.5 px-4 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer h-[34px]"
              >
                <Icons.Download className="h-3.5 w-3.5" /> Export As <Icons.ChevronDown />
              </button>

              {isExportOpen && (
                <div className="absolute right-0 bottom-full mb-2 xl:bottom-auto xl:top-full xl:mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 p-1 flex flex-col gap-0.5">
                  <button
                    onClick={() => {
                      onExportPDF();
                      setIsExportOpen(false);
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg cursor-pointer w-full"
                  >
                    <Icons.FileText /> Download PDF Document
                  </button>
                  <button
                    onClick={() => {
                      onExportPNG();
                      setIsExportOpen(false);
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg cursor-pointer w-full"
                  >
                    <Icons.Image /> Download PNG Image
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Watermark Modal Render portal anchor node */}
      {isCustomModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 isolate">
            <div
              onClick={() => setIsCustomModalOpen(false)}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs"
            />
            <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 w-full max-w-sm shadow-2xl z-10">
              <h3 className="text-sm font-black text-slate-900 dark:text-white mb-1">
                Custom Watermark
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                Enter the label stamp across background layout sheets.
              </p>
              <form onSubmit={handleCustomModalSubmit} className="flex flex-col gap-4">
                <input
                  type="text"
                  autoFocus
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="e.g. INTERNAL USE ONLY"
                  maxLength={25}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold outline-none text-slate-800 dark:text-slate-200"
                />
                <div className="flex items-center justify-end gap-2 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setIsCustomModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!customInput.trim()}
                    className="px-4 py-2 bg-brand-600 text-white rounded-xl disabled:opacity-50 cursor-pointer"
                  >
                    Apply Watermark
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
