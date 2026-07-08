import { BRAND_COLORS, COUNTRIES } from "../constants/invoicePresets";

export const Icons = {
  Print: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-3a2 2 0 00-2-2H9a2 2 0 00-2 2v3a2 2 0 002 2zm3-11h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  Download: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
      />
    </svg>
  ),
  Plus: () => (
    <svg
      className="w-3.5 h-3.5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={3}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  ),
  Trash: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  ),
  Upload: () => (
    <svg
      className="w-6 h-6 text-slate-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 16l4.586-4.586a1 1 0 011.414 0L14 15M14 14l2.586-2.586a1 1 0 011.414 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  ),
  Sun: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"
      />
    </svg>
  ),
  Moon: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
      />
    </svg>
  ),
  Undo: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
      />
    </svg>
  ),
  Redo: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6"
      />
    </svg>
  ),
};

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
  return (
    <header className="no-print sticky top-0 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm px-4 md:px-8 py-3 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center justify-between">
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

        {/* Mobile Undo/Redo Controls */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={onUndo}
            disabled={historyIdx === 0}
            className="p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 disabled:opacity-40"
          >
            <Icons.Undo />
          </button>
          <button
            onClick={onRedo}
            disabled={historyIdx >= historyLength - 1}
            className="p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 disabled:opacity-40"
          >
            <Icons.Redo />
          </button>
        </div>
      </div>

      {/* Controls Config Row */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-col">
          <label className="text-[9px] font-extrabold uppercase text-slate-400 dark:text-slate-500 mb-1">
            Country Rules Preset
          </label>
          <select
            value={invoice.countryCode}
            onChange={(e) => onCountryChange(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold focus:ring-1 focus:ring-brand-500 outline-none cursor-pointer text-slate-700 dark:text-slate-300"
          >
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-[9px] font-extrabold uppercase text-slate-400 dark:text-slate-500 mb-1">
            Style Template
          </label>
          <select
            value={invoice.templateId}
            onChange={(e) => onUpdateField("templateId", e.target.value)}
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold focus:ring-1 focus:ring-brand-500 outline-none cursor-pointer text-slate-700 dark:text-slate-300"
          >
            <option value="classic">Classic Corporate</option>
            <option value="modern-minimalist">Modern Minimalist</option>
            <option value="bold-professional">Bold Premium</option>
            <option value="emerald-premium">Emerald Executive</option>
            <option value="retail">Retail Boutique Receipt</option>
          </select>
        </div>

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

        <div className="flex flex-col">
          <label className="text-[9px] font-extrabold uppercase text-slate-400 dark:text-slate-500 mb-1">
            Font Family
          </label>
          <select
            value={invoice.typography}
            onChange={(e) => onUpdateField("typography", e.target.value)}
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold focus:ring-1 focus:ring-brand-500 outline-none cursor-pointer text-slate-700 dark:text-slate-300"
          >
            <option value="font-sans">Sans (Inter)</option>
            <option value="font-serif">Serif (Playfair)</option>
            <option value="font-mono">Monospace (JetBrains)</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-[9px] font-extrabold uppercase text-slate-400 dark:text-slate-500 mb-1">
            Paper Format
          </label>
          <select
            value={invoice.paperSize}
            onChange={(e) => onUpdateField("paperSize", e.target.value)}
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold focus:ring-1 focus:ring-brand-500 outline-none cursor-pointer text-slate-700 dark:text-slate-300"
          >
            <option value="a4">A4 Standard</option>
            <option value="letter">Letter Size</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-[9px] font-extrabold uppercase text-slate-400 dark:text-slate-500 mb-1">
            Draft Watermark
          </label>
          <button
            onClick={() => onUpdateField("showWatermark", !invoice.showWatermark)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${invoice.showWatermark ? "bg-indigo-500/10 border-indigo-500 text-indigo-500" : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500"}`}
          >
            {invoice.showWatermark ? "Enabled" : "Disabled"}
          </button>
        </div>
      </div>

      {/* Action buttons (Download, Print, Theme) */}
      <div className="flex items-center gap-2 flex-wrap">
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
        </div>

        <button
          onClick={onPrint}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 shadow-sm hover:bg-slate-50/50 cursor-pointer"
        >
          <Icons.Print /> Print
        </button>
        <button
          onClick={onExportPNG}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 shadow-sm hover:bg-slate-50/50 cursor-pointer"
        >
          <Icons.Download /> Image PNG
        </button>
        <button
          onClick={onExportPDF}
          className="flex items-center gap-1.5 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-500/10 transition-colors cursor-pointer"
        >
          <Icons.Download /> Download PDF
        </button>

        <button
          onClick={onThemeToggle}
          className="p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white shadow-sm cursor-pointer"
        >
          {theme === "dark" ? <Icons.Sun /> : <Icons.Moon />}
        </button>
      </div>
    </header>
  );
}
