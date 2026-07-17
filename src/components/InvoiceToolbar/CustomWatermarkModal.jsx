import { useState } from "react";
import { createPortal } from "react-dom";

export default function CustomWatermarkModal({ isOpen, initialValue, onClose, onSubmit }) {
  const [input, setInput] = useState(initialValue || "");

  if (!isOpen) return null;

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(input.trim().toUpperCase());
  };

  return createPortal(
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center p-4 technique-isolate"
      data-testid="watermark-modal"
    >
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs"
        aria-label="Overlay background layer"
      />
      <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 w-full max-w-sm shadow-2xl z-10">
        <h3 className="text-sm font-black text-slate-900 dark:text-white mb-1">Custom Watermark</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Enter the label stamp across background layout sheets.
        </p>
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. INTERNAL USE ONLY"
            maxLength={25}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold outline-none text-slate-800 dark:text-slate-200"
          />
          <div className="flex items-center justify-end gap-2 text-xs font-bold">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!input.trim()}
              className="px-4 py-2 bg-brand-600 text-white rounded-xl disabled:opacity-50 cursor-pointer"
            >
              Apply Watermark
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
