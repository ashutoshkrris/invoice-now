export const ExportLoader = ({ isExporting }) => {
  if (!isExporting) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/40 backdrop-blur-md select-none">
      <div className="flex flex-col items-center rounded-xl bg-white p-8 shadow-2xl space-y-4 max-w-sm w-full text-center mx-4">
        {/* Spinner */}
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

        <div className="space-y-1">
          <h3 className="font-semibold text-slate-800 text-lg">Generating Document</h3>
          <p className="text-sm text-slate-500">Please wait while we prepare your download...</p>
        </div>
      </div>
    </div>
  );
};
