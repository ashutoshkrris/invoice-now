import { useEffect } from "react";

export default function Toast({ message, type, onClose }) {
  // Automatically trigger dismiss cleanup after 3.5 seconds
  useEffect(() => {
    const timer = setTimeout(onClose, 2000);

    // Clear the timer context if the component unmounts prematurely
    // to prevent memory leaks or calling callbacks on dead states
    return () => clearTimeout(timer);
  }, [onClose]);

  // Map dynamic alert notification classifications to theme definitions
  const colors = {
    success: "bg-emerald-600 dark:bg-emerald-500 text-white",
    error: "bg-rose-600 dark:bg-rose-500 text-white",
    info: "bg-brand-600 dark:bg-brand-500 text-white",
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl transition-all duration-300 transform translate-y-0 animate-bounce ${colors[type] || colors.info}`}
      data-testid="toast-container"
    >
      <span className="font-semibold text-xs tracking-wide">{message}</span>

      {/* Explicit close handler override control */}
      <button
        onClick={onClose}
        className="p-1 hover:bg-white/25 rounded-md transition-colors"
        aria-label="Close notification"
      >
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
