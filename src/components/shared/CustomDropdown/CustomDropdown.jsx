import { useState, useLayoutEffect, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export default function CustomDropdown({ label, options, value, onChange, className = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState(null);
  const dropdownRef = useRef(null);

  // Synchronously compute layout coordinates before browser paint threads execute
  const updateCoords = () => {
    if (dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  };

  useLayoutEffect(() => {
    if (isOpen) {
      updateCoords();
      window.addEventListener("resize", updateCoords);
      window.addEventListener("scroll", updateCoords);
    }
    return () => {
      window.removeEventListener("resize", updateCoords);
      window.removeEventListener("scroll", updateCoords);
    };
  }, [isOpen]);

  // Clean exit capture fields when user clicks onto exterior background components
  useEffect(() => {
    function handleClickOutside(event) {
      // If the user clicked inside our dropdown container, do nothing
      if (dropdownRef.current && dropdownRef.current.contains(event.target)) return;

      // Check if the user clicked inside the portal overlay panel itself
      const portalNode = document.getElementById(
        `portal-dropdown-${label.replace(/\s+/g, "-").toLowerCase()}`
      );
      if (portalNode && portalNode.contains(event.target)) return;

      setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [label]);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div ref={dropdownRef} className={`flex flex-col flex-1 relative text-left ${className}`}>
      <span className="text-[9px] font-extrabold uppercase text-slate-400 dark:text-slate-500 mb-1 select-none">
        {label}
      </span>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 h-[30px] cursor-pointer text-left focus:ring-1 focus:ring-brand-500 outline-none"
        aria-label={`Toggle ${label} selector`}
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : "Select option..."}
        </span>
        <span
          className={`text-[9px] text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        >
          ▼
        </span>
      </button>

      {/* Render options via standard DOM tree layers so screen recording software captures it perfectly */}
      {isOpen &&
        coords &&
        createPortal(
          <div
            id={`portal-dropdown-${label.replace(/\s+/g, "-").toLowerCase()}`}
            style={{
              position: "absolute",
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              width: `${Math.max(coords.width, 160)}px`,
            }}
            className="mt-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl z-9999 overflow-hidden flex flex-col py-1 max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-100"
            data-testid="custom-dropdown-portal"
          >
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={(e) => {
                  // Prevent event bubbling so outside-click listeners don't prematurely cancel state changes
                  e.stopPropagation();
                  e.preventDefault();
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs cursor-pointer block truncate hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors ${
                  value === opt.value
                    ? "bg-brand-50/40 dark:bg-brand-950/20 text-brand-600 dark:text-brand-400 font-bold"
                    : "text-slate-700 dark:text-slate-300"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>,
          document.body
        )}
    </div>
  );
}
