import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { BRAND_COLORS, COUNTRIES } from "../constants/invoicePresets";
import { Icons } from "./Icons";

export default function Header({
  invoice,
  theme,
  historyIdx,
  historyLength,
  onUpdateField,
  onCountryChange,
  onUndo,
  onRedo,
  onPrint,
  onExportPNG,
  onExportPDF,
  onThemeToggle,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Custom Modal States
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [customInput, setCustomInput] = useState("");

  const dropdownRef = useRef(null);

  // Close export dropdown if user clicks outside of it
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsExportOpen(false);
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
    <header className="no-print sticky top-0 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm px-4 md:px-8 py-3 flex flex-col lg:flex-row lg:items-center lg:justify-between transition-all duration-300">
      {/* Top Main Row */}
      <div className="flex items-center justify-between w-full lg:w-auto z-10">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 bg-gradient-to-tr from-brand-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-sm font-black tracking-tight text-slate-950 dark:text-white leading-none">
              Invoice Now
            </h1>
          </div>
        </div>

        {/* Mobile quick actions bar */}
        <div className="flex items-center gap-1.5 lg:hidden">
          <button
            onClick={onUndo}
            disabled={historyIdx === 0}
            className="p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 disabled:opacity-40 active:scale-95 transition-transform"
          >
            <Icons.Undo />
          </button>
          <button
            onClick={onRedo}
            disabled={historyIdx >= historyLength - 1}
            className="p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 disabled:opacity-40 active:scale-95 transition-transform"
          >
            <Icons.Redo />
          </button>
          <button
            onClick={onThemeToggle}
            className="p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 active:scale-95 transition-transform"
          >
            {theme === "dark" ? <Icons.Sun /> : <Icons.Moon />}
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`p-2 border rounded-lg active:scale-95 transition-all duration-200 flex items-center gap-1 text-xs font-bold ${
              isOpen
                ? "bg-brand-600 border-brand-600 text-white shadow-sm"
                : "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
            }`}
          >
            <Icons.Settings />
            <span>{isOpen ? "Close" : "Config"}</span>
          </button>
        </div>
      </div>

      {/* Smooth Expanding Grid Wrapper */}
      <div
        className={`grid transition-all duration-300 ease-in-out w-full lg:w-auto ${
          isOpen
            ? "grid-rows-[1fr] opacity-100 mt-3"
            : "grid-rows-[0fr] opacity-0 lg:opacity-100 lg:grid-rows-[1fr]"
        }`}
      >
        <div className="overflow-hidden lg:overflow-visible flex flex-col lg:flex-row items-stretch lg:items-center gap-4 w-full lg:w-auto">
          <hr className="border-slate-100 dark:border-slate-900 lg:hidden" />

          {/* Controls Config Row */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Country Rules */}
            <div className="flex flex-col flex-1 min-w-[130px] lg:flex-none">
              <label className="text-[9px] font-extrabold uppercase text-slate-400 dark:text-slate-500 mb-1">
                Country Rules Preset
              </label>
              <select
                value={invoice.countryCode}
                onChange={(e) => onCountryChange(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold focus:ring-1 focus:ring-brand-500 outline-none text-slate-700 dark:text-slate-300"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Style Template */}
            <div className="flex flex-col flex-1 min-w-[140px] lg:flex-none">
              <label className="text-[9px] font-extrabold uppercase text-slate-400 dark:text-slate-500 mb-1">
                Style Template
              </label>
              <select
                value={invoice.templateId}
                onChange={(e) => onUpdateField("templateId", e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold focus:ring-1 focus:ring-brand-500 outline-none text-slate-700 dark:text-slate-300"
              >
                <option value="classic">Classic Corporate</option>
                <option value="modern-minimalist">Modern Minimalist</option>
                <option value="bold-professional">Bold Premium</option>
                <option value="emerald-premium">Emerald Executive</option>
                <option value="retail">Retail Boutique Receipt</option>
              </select>
            </div>

            {/* Brand Colors */}
            <div className="flex flex-col">
              <label className="text-[9px] font-extrabold uppercase text-slate-400 dark:text-slate-500 mb-1">
                Brand Color
              </label>
              <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-1">
                {BRAND_COLORS.map((color) => (
                  <button
                    key={color.hex}
                    onClick={() => onUpdateField("brandColor", color.hex)}
                    className="h-4.5 w-4.5 rounded-full border border-black/10 transition-transform active:scale-95 cursor-pointer"
                    style={{ backgroundColor: color.hex }}
                    title={color.label}
                  />
                ))}
                <input
                  type="color"
                  value={invoice.brandColor}
                  onChange={(e) => onUpdateField("brandColor", e.target.value)}
                  className="h-5 w-5 p-0 border-0 cursor-pointer bg-transparent"
                />
              </div>
            </div>

            {/* Typography */}
            <div className="flex flex-col flex-1 min-w-[120px] lg:flex-none">
              <label className="text-[9px] font-extrabold uppercase text-slate-400 dark:text-slate-500 mb-1">
                Font Family
              </label>
              <select
                value={invoice.typography}
                onChange={(e) => onUpdateField("typography", e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold focus:ring-1 focus:ring-brand-500 outline-none text-slate-700 dark:text-slate-300"
              >
                <option value="font-sans">Sans (Inter)</option>
                <option value="font-serif">Serif (Playfair)</option>
                <option value="font-mono">Monospace (JetBrains)</option>
              </select>
            </div>

            {/* Paper Sizes */}
            <div className="flex flex-col flex-1 min-w-[100px] lg:flex-none">
              <label className="text-[9px] font-extrabold uppercase text-slate-400 dark:text-slate-500 mb-1">
                Paper Format
              </label>
              <select
                value={invoice.paperSize}
                onChange={(e) => onUpdateField("paperSize", e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold focus:ring-1 focus:ring-brand-500 outline-none text-slate-700 dark:text-slate-300"
              >
                <option value="a4">A4 Standard</option>
                <option value="letter">Letter Size</option>
              </select>
            </div>

            {/* Upgraded Watermark Dropdown Section */}
            <div className="flex flex-col flex-1 min-w-[120px] lg:flex-none">
              <label className="text-[9px] font-extrabold uppercase text-slate-400 dark:text-slate-500 mb-1">
                Watermark
              </label>

              <div className="flex items-center gap-1.5 relative">
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
                  className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold focus:ring-1 focus:ring-brand-500 outline-none text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  <option value="">None</option>
                  <option value="DRAFT">Draft</option>
                  <option value="PAID">Paid</option>
                  <option value="OVERDUE">Overdue</option>
                  <option value="custom">
                    {!isPresetWatermark ? `Custom: ${invoice.watermarkText}` : "Custom"}
                  </option>
                </select>

                {/* Elegant edit pen button: Only renders when a custom watermark text is active */}
                {!isPresetWatermark && invoice.watermarkText && (
                  <button
                    type="button"
                    onClick={() => {
                      setCustomInput(invoice.watermarkText);
                      setIsCustomModalOpen(true);
                    }}
                    title="Edit custom watermark text"
                    className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 rounded-lg transition-colors cursor-pointer shrink-0"
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

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-wrap pb-2 lg:pb-0 relative">
            {/* Desktop Only Undo/Redo/Theme controls */}
            <div className="hidden lg:flex items-center gap-1.5 mr-2">
              <button
                onClick={onUndo}
                disabled={historyIdx === 0}
                className="p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white disabled:opacity-45 shadow-sm transition-all cursor-pointer"
                title="Undo"
              >
                <Icons.Undo />
              </button>
              <button
                onClick={onRedo}
                disabled={historyIdx >= historyLength - 1}
                className="p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white disabled:opacity-45 shadow-sm transition-all cursor-pointer"
                title="Redo"
              >
                <Icons.Redo />
              </button>
              <button
                onClick={onThemeToggle}
                className="p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white shadow-sm cursor-pointer transition-all"
                title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {theme === "dark" ? <Icons.Sun /> : <Icons.Moon />}
              </button>
            </div>

            {/* Print Button */}
            <button
              onClick={onPrint}
              className="flex-1 lg:flex-none justify-center flex items-center gap-1.5 px-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 shadow-sm hover:bg-slate-50/50 cursor-pointer"
            >
              <Icons.Print /> Print
            </button>

            {/* Unified Export Dropdown Button */}
            <div className="relative flex-1 lg:flex-none" ref={dropdownRef}>
              <button
                onClick={() => setIsExportOpen(!isExportOpen)}
                className="w-full lg:w-auto justify-center flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-500/10 transition-colors cursor-pointer"
              >
                <Icons.Download />
                <span>Export As</span>
                <Icons.ChevronDown />
              </button>

              {/* Dropdown Menu Overlay Card */}
              {isExportOpen && (
                <div className="absolute right-0 bottom-full mb-2 lg:bottom-auto lg:top-full lg:mt-2 w-full lg:w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 p-1 flex flex-col gap-0.5 animate-in fade-in slide-in-from-top-1 duration-100">
                  <button
                    onClick={() => {
                      onExportPDF();
                      setIsExportOpen(false);
                    }}
                    className="group flex items-center gap-2 px-3 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-lg transition-colors cursor-pointer"
                  >
                    <Icons.FileText />
                    <span>Download PDF Document</span>
                  </button>

                  <button
                    onClick={() => {
                      onExportPNG();
                      setIsExportOpen(false);
                    }}
                    className="group flex items-center gap-2 px-3 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-lg transition-colors cursor-pointer"
                  >
                    <Icons.Image />
                    <span>Download PNG Image</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Custom Watermark Modal Dialog Overlay */}
      {isCustomModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 isolate">
            {/* 1. Backdrop Blur Overlay */}
            <div
              onClick={() => setIsCustomModalOpen(false)}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-200"
            />

            {/* 2. Dead-Centered Modal Card */}
            <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 w-full max-w-sm shadow-2xl animate-in scale-in duration-200 z-10">
              <h3 className="text-sm font-black text-slate-900 dark:text-white mb-1">
                Custom Watermark
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                Enter the label you want stamped across the background.
              </p>

              <form onSubmit={handleCustomModalSubmit} className="flex flex-col gap-4">
                <input
                  type="text"
                  autoFocus
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="e.g. INTERNAL USE ONLY"
                  maxLength={25}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none text-slate-800 dark:text-slate-200"
                />

                <div className="flex items-center justify-end gap-2 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setIsCustomModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/70 dark:hover:bg-slate-700/70 text-slate-600 dark:text-slate-300 rounded-xl cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!customInput.trim()}
                    className="px-4 py-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:pointer-events-none text-white rounded-xl shadow-md shadow-brand-500/10 cursor-pointer transition-colors"
                  >
                    Apply Watermark
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body // Injects the entire block straight into the <body> tag
        )}
    </header>
  );
}
