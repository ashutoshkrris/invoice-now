import { useEffect } from "react";
import { Icons } from "../shared/Icons";

export default function Toast({ message, type, onClose }) {
  // Automatically trigger dismiss cleanup after 2 seconds
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
    warning: "bg-amber-600 dark:bg-amber-500 text-white",
  };

  return (
    <div
      className={`
        fixed
        bottom-4 left-4 right-4
        sm:bottom-6 sm:right-6 sm:left-auto sm:max-w-md
        z-50
        flex items-start gap-3
        rounded-xl
        px-5 py-3.5
        shadow-2xl
        transition-all duration-300
        animate-bounce
        ${colors[type] || colors.info}
      `}
      data-testid="toast-container"
      role="alert"
      aria-live="polite"
    >
      <span className="flex-1 text-xs font-semibold tracking-wide break-words whitespace-normal">
        {message}
      </span>

      {/* Close button */}
      <button
        onClick={onClose}
        className="flex-shrink-0 rounded-md p-1 transition-colors hover:bg-white/25"
        aria-label="Close notification"
      >
        <Icons.Close />
      </button>
    </div>
  );
}
