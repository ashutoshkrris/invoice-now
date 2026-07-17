import { useState } from "react";
import { BRAND_COLORS } from "../../constants/invoicePresets";
import { Icons } from "../shared/Icons";
import SearchableCountryDropdown from "./SearchableCountryDropdown";
import CustomWatermarkModal from "./CustomWatermarkModal";
import CustomDropdown from "../shared/CustomDropdown/CustomDropdown";

export default function InvoiceToolbar({
  invoice,
  historyIdx,
  historyLength,
  onUpdateField,
  onCountryChange,
  onUndo,
  onRedo,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

  const isPresetWatermark = ["DRAFT", "PAID", "OVERDUE", ""].includes(invoice.watermarkText);

  // Configuration Mapping Options Arrays
  const templateOptions = [
    { value: "classic", label: "Classic Corporate" },
    { value: "modern-minimalist", label: "Modern Minimalist" },
    { value: "bold-professional", label: "Bold Premium" },
    { value: "emerald-premium", label: "Emerald Executive" },
    { value: "retail", label: "Retail Receipt" },
  ];

  const typographyOptions = [
    { value: "font-sans", label: "Sans (Inter)" },
    { value: "font-serif", label: "Serif (Playfair)" },
    { value: "font-mono", label: "Monospace (JetBrains)" },
  ];

  const paperSizeOptions = [
    { value: "a4", label: "A4 Standard" },
    { value: "letter", label: "Letter Size" },
  ];

  // Upgraded programmatic watermark option configurations
  const watermarkOptions = [
    { value: "", label: "None" },
    { value: "DRAFT", label: "Draft" },
    { value: "PAID", label: "Paid" },
    { value: "OVERDUE", label: "Overdue" },
    { value: "custom", label: "Custom Stamp" },
  ];

  // Intercept selection updates to catch custom modal modal routing rules
  const handleWatermarkDropdownChange = (selectedValue) => {
    if (selectedValue === "custom") {
      setIsCustomModalOpen(true);
    } else {
      onUpdateField("watermarkText", selectedValue);
    }
  };

  return (
    <div className="no-print w-full bg-white/95 dark:bg-slate-950/95 border-b border-slate-200 dark:border-slate-800 px-4 md:px-6 py-2 flex flex-col xl:flex-row xl:items-center xl:justify-center gap-4 transition-all box-border">
      <div className="flex items-center justify-between xl:justify-center gap-3 w-full xl:w-auto">
        <div className="flex items-center gap-1.5">
          <button
            onClick={onUndo}
            disabled={historyIdx === 0}
            className="p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 disabled:opacity-40 hover:text-slate-950 dark:hover:text-white transition-all active:scale-95 cursor-pointer"
            title="Undo"
          >
            <Icons.Undo className="h-4 w-4" />
          </button>
          <button
            onClick={onRedo}
            disabled={historyIdx >= historyLength - 1}
            className="p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 disabled:opacity-40 hover:text-slate-950 dark:hover:text-white transition-all active:scale-95 cursor-pointer"
            title="Redo"
          >
            <Icons.Redo className="h-4 w-4" />
          </button>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`p-2 border rounded-lg active:scale-95 transition-all flex items-center gap-1 text-xs font-bold cursor-pointer xl:hidden ${
            isOpen
              ? "bg-brand-600 border-brand-600 text-white"
              : "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
          }`}
          aria-label="Toggle configurations panel panel visibility"
        >
          <Icons.Settings />
          <span>{isOpen ? "Hide" : "Config"}</span>
        </button>
      </div>

      <div
        className={`grid transition-all duration-300 ease-in-out w-full xl:w-auto ${
          isOpen
            ? "grid-rows-[1fr] opacity-100 mt-2 xl:mt-0"
            : "grid-rows-[0fr] opacity-0 xl:opacity-100 xl:grid-rows-1"
        }`}
      >
        <div className="overflow-hidden xl:overflow-visible flex flex-col xl:flex-row items-stretch xl:items-end gap-4 w-full xl:w-auto">
          <div className="flex flex-wrap xl:flex-nowrap items-center gap-3 w-full xl:w-auto">
            <SearchableCountryDropdown
              currentCode={invoice.countryCode}
              onCountryChange={onCountryChange}
            />

            <CustomDropdown
              label="Style Template"
              options={templateOptions}
              value={invoice.templateId}
              onChange={(val) => onUpdateField("templateId", val)}
              className="min-w-[150px] xl:w-38.75"
            />

            {/* Brand Colors Config Block */}
            <div className="flex flex-col flex-1 min-w-[150px] xl:flex-none shrink-0">
              <label className="text-[9px] font-extrabold uppercase text-slate-400 dark:text-slate-500 mb-1 select-none">
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

            <CustomDropdown
              label="Font Family"
              options={typographyOptions}
              value={invoice.typography}
              onChange={(val) => onUpdateField("typography", val)}
              className="min-w-[130px] xl:w-31.25"
            />

            <CustomDropdown
              label="Paper Format"
              options={paperSizeOptions}
              value={invoice.paperSize}
              onChange={(val) => onUpdateField("paperSize", val)}
              className="min-w-[110px] xl:w-27.5"
            />

            {/* Upgraded Watermark Dropdown Section Container Layout */}
            <div className="flex flex-col flex-1 min-w-32.5 xl:flex-none xl:w-35 relative">
              <div className="flex items-end gap-1.5 w-full h-full">
                <CustomDropdown
                  label="Watermark"
                  options={watermarkOptions}
                  value={
                    !invoice.watermarkText
                      ? ""
                      : isPresetWatermark
                        ? invoice.watermarkText
                        : "custom"
                  }
                  onChange={handleWatermarkDropdownChange}
                />

                {/* Edit inline parameter utility flag triggers if a non-preset text string is detected */}
                {!isPresetWatermark && invoice.watermarkText && (
                  <button
                    type="button"
                    onClick={() => setIsCustomModalOpen(true)}
                    className="p-1.5 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 shrink-0 cursor-pointer h-[30px] flex items-center justify-center mb-0"
                    aria-label="Edit custom watermark parameters"
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
        </div>
      </div>

      <CustomWatermarkModal
        isOpen={isCustomModalOpen}
        initialValue={!isPresetWatermark ? invoice.watermarkText : ""}
        onClose={() => setIsCustomModalOpen(false)}
        onSubmit={(text) => {
          onUpdateField("watermarkText", text);
          setIsCustomModalOpen(false);
        }}
      />
    </div>
  );
}
