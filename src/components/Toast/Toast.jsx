import { useEffect } from "react";
import { Icons } from "../shared/Icons";

export default function Toast({ message, type, onClose, subtext, action }) {
  // Trigger dismiss cleanup after 5s when action is provided, otherwise 2.5s
  useEffect(() => {
    const displayDuration = action || subtext ? 5000 : 2500;
    const timer = setTimeout(onClose, displayDuration);

    return () => clearTimeout(timer);
  }, [onClose, action, subtext]);

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
      <div className="flex-1 space-y-1">
        <span className="block text-xs font-semibold tracking-wide break-words whitespace-normal">
          {message}
        </span>

        {subtext && (
          <p className="text-[11px] opacity-90 leading-tight font-normal break-words whitespace-normal">
            {subtext}
          </p>
        )}

        {action && (
          <div className="pt-1">
            <a
              href={action.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-bold underline underline-offset-2 hover:opacity-80 transition-opacity cursor-pointer"
            >
              {action.label}
            </a>
          </div>
        )}
      </div>

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
