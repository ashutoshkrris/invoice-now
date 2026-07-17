import { useState, useLayoutEffect, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { COUNTRIES } from "../../constants/countries";

export default function SearchableCountryDropdown({ currentCode, onCountryChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  // Initialize coords as null to indicate we haven't measured anything yet
  const [coords, setCoords] = useState(null);
  const dropdownRef = useRef(null);

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

  // useLayoutEffect runs synchronously BEFORE the browser paints the screen.
  // This completely eliminates the visual "flash" or jump on the first render.
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

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        const portalNode = document.getElementById("portal-country-dropdown");
        if (portalNode && portalNode.contains(event.target)) return;

        setIsOpen(false);
        setSearchQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedCountry =
    COUNTRIES.find((c) => c.code === (currentCode || "IN"))?.name || "India (₹)";
  const filteredCountries = COUNTRIES.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      ref={dropdownRef}
      className="flex flex-col flex-1 min-w-[140px] xl:flex-none xl:w-38 relative text-left"
    >
      <label className="text-[9px] font-extrabold uppercase text-slate-400 dark:text-slate-500 mb-1">
        Country Rules Preset
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 h-[30px] cursor-pointer text-left"
        aria-label="Toggle country selector"
      >
        <span className="truncate">{selectedCountry}</span>
        <span
          className={`text-[9px] text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        >
          ▼
        </span>
      </button>

      {/* Entry Guard: ONLY mount the portal once isOpen is true AND we have captured valid coordinates */}
      {isOpen &&
        coords &&
        createPortal(
          <div
            id="portal-country-dropdown"
            style={{
              position: "absolute",
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              width: `${Math.max(coords.width, 210)}px`,
            }}
            className="mt-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl z-9999 overflow-hidden flex flex-col max-h-60"
            data-testid="country-portal"
          >
            <div className="p-1.5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30">
              <input
                type="text"
                autoFocus
                placeholder="Search country..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-2 py-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-xs font-medium outline-none text-slate-700 dark:text-slate-300"
              />
            </div>
            <div className="overflow-y-auto flex-1 divide-y divide-slate-50 dark:divide-slate-900/40">
              {filteredCountries.length > 0 ? (
                filteredCountries.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => {
                      onCountryChange(c.code);
                      setIsOpen(false);
                      setSearchQuery("");
                    }}
                    className={`w-full text-left px-3 py-2 text-xs cursor-pointer block truncate ${
                      currentCode === c.code
                        ? "bg-brand-50/40 dark:bg-brand-950/20 text-brand-600 dark:text-brand-400 font-bold"
                        : "text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {c.name}
                  </button>
                ))
              ) : (
                <div className="px-2 py-3 text-xs text-slate-400 text-center select-none">
                  No matches
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
