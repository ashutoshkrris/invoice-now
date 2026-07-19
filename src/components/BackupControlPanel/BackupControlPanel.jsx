import { useRef } from "react";
import { Icons } from "../shared/Icons";

export function BackupControlPanel({ onExport, onImport, isProcessing }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/json" && !file.name.endsWith(".json")) {
      alert("Please upload a valid .json backup file.");
      e.target.value = "";
      return;
    }

    onImport(file);
    e.target.value = "";
  };

  return (
    <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg dark:bg-slate-900 dark:border-slate-800">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">
        Backup Management
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
        Export all multi-document workspaces and branding assets into a single portable backup file,
        or restore an existing one.
      </p>

      <div className="flex flex-col sm:flex-row gap-2.5">
        {/* Export Button */}
        <button
          type="button"
          onClick={onExport}
          disabled={isProcessing}
          className="inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 active:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 transition-colors shadow-sm cursor-pointer"
        >
          <Icons.Download className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          <span>Export Backup (.json)</span>
        </button>

        {/* Import Trigger Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
          className="inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm cursor-pointer"
        >
          <Icons.GenericUpload className="w-3.5 h-3.5 text-white" />
          <span>Restore From Backup</span>
        </button>

        {/* Hidden Native File Input Bridge */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".json,application/json"
          className="hidden"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
