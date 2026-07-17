import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Icons } from "../Icons"; // Correct relative tracking resolution

export default function Navbar({ theme, onThemeToggle }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const routesList = [
    { path: "/", label: "Invoice Editor" },
    { path: "/about", label: "About" },
    { path: "/privacy-policy", label: "Privacy Policy" },
    { path: "/terms-of-use", label: "Terms of Use" },
  ];

  return (
    <nav className="no-print w-full sticky top-0 z-50 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-4 md:px-6 py-3 flex items-center justify-between shadow-xs select-none">
      {/* Brand Logo Header Anchor */}
      <Link to="/" className="flex items-center gap-2.5 group cursor-pointer z-50">
        <div className="h-8 w-8 bg-linear-to-tr from-brand-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md shrink-0">
          <Icons.AppLogo className="h-4 w-4 text-white" />
        </div>
        <span className="text-sm font-black tracking-tight text-slate-950 dark:text-white leading-none">
          Invoice Now
        </span>
      </Link>

      {/* Desktop Layout Navigation Stack */}
      <div className="hidden md:flex items-center gap-6">
        <div className="flex items-center gap-5 text-xs font-semibold">
          {routesList.map((route) => {
            const isActive = location.pathname === route.path;
            return (
              <Link
                key={route.path}
                to={route.path}
                className={`transition-colors duration-150 ${
                  isActive
                    ? "text-brand-600 dark:text-brand-400 font-bold"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white"
                }`}
              >
                {route.label}
              </Link>
            );
          })}
        </div>

        {/* Global theme controls switch utility */}
        <button
          onClick={onThemeToggle}
          type="button"
          className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {theme === "dark" ? <Icons.Sun /> : <Icons.Moon />}
        </button>
      </div>

      {/* Mobile Actions Control Panel */}
      <div className="flex items-center gap-2 md:hidden z-50">
        {/* Secondary Theme Button for Mobile Layout Viewports */}
        <button
          onClick={onThemeToggle}
          type="button"
          className="p-2 text-slate-500 dark:text-slate-400 active:scale-95 transition-transform"
        >
          {theme === "dark" ? (
            <Icons.Sun className="h-4 w-4" />
          ) : (
            <Icons.Moon className="h-4 w-4" />
          )}
        </button>

        {/* Hamburger Menu Toggle Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          type="button"
          className="p-2 text-slate-600 dark:text-slate-300 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 active:scale-95 transition-all cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? (
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Sliding Mobile Drawer Overlay Menu */}
      <div
        className={`fixed inset-x-0 top-0 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 shadow-xl transition-all duration-300 ease-in-out md:hidden pt-16 pb-6 px-4 z-40 ${
          isMobileMenuOpen
            ? "opacity-100 translate-y-0 visible"
            : "opacity-0 -translate-y-4 invisible pointer-events-none"
        }`}
        data-testid="mobile-drawer"
      >
        <div className="flex flex-col gap-1">
          {routesList.map((route) => {
            const isActive = location.pathname === route.path;
            return (
              <Link
                key={route.path}
                to={route.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`w-full px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-brand-50/60 text-brand-600 dark:bg-brand-950/40 dark:text-white font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/60 hover:text-slate-950 dark:hover:text-white"
                }`}
              >
                {route.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
