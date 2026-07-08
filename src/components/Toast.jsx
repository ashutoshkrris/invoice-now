import { useEffect } from "react";

export default function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = {
    success: "bg-emerald-600 dark:bg-emerald-500 text-white",
    error: "bg-rose-600 dark:bg-rose-500 text-white",
    info: "bg-brand-600 dark:bg-brand-500 text-white",
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl transition-all duration-300 transform translate-y-0 animate-bounce ${colors[type] || colors.info}`}
    >
      <span className="font-semibold text-xs tracking-wide">{message}</span>
      <button onClick={onClose} className="p-1 hover:bg-white/25 rounded-md transition-colors">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}
