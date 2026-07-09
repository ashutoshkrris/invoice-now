import { Link } from "react-router-dom";
import { Icons } from "./Icons";

export default function Footer() {
  const startYear = 2026;
  const currentYear = new Date().getFullYear();
  const copyrightYear = currentYear > startYear ? `${startYear}-${currentYear}` : `${startYear}`;

  return (
    <footer className="no-print mt-auto bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300 w-full">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-10 md:py-14">
        {/* --- TOP SECTION: BRAND + LINKS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 pb-10 border-b border-slate-100 dark:border-slate-900">
          {/* Left Column: Brand Identity & Description (Spans 5/12 columns on desktop) */}
          <div className="md:col-span-5 space-y-3.5 text-left">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 bg-gradient-to-tr from-brand-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <span className="font-black text-sm tracking-tight text-slate-950 dark:text-white">
                Invoice Now
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed font-medium">
              A modern, privacy-first invoice generator built for freelancers and small businesses.
              Generate professional PDF invoices locally in your browser.
            </p>
          </div>

          {/* Middle Columns: Future-Proof Navigation Link Columns (Spans 4/12 columns) */}
          <div className="md:col-span-4 grid grid-cols-2 gap-6 text-left">
            {/* Column 1: Product info mapping */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Application
              </h4>
              <ul className="space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                <li>
                  <Link
                    to="/"
                    className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                  >
                    Invoice Builder
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                  >
                    About Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: Legal rules mapping (Ready for your upcoming updates) */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Legal
              </h4>
              <ul className="space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Code Repositories & Connections (Spans 3/12 columns) */}
          <div className="md:col-span-3 space-y-3 text-left md:text-right flex flex-col md:items-end justify-start">
            <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 w-full">
              Open Source
            </h4>
            <div className="flex items-center gap-4 pt-1 w-full md:justify-end">
              <a
                href="https://github.com/ashutoshkrris/invoice-now"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 font-semibold text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                title="View source code on GitHub"
              >
                <Icons.Github />
                <span>GitHub Repository</span>
              </a>
            </div>
          </div>
        </div>

        {/* --- BOTTOM SECTION: COPYRIGHT + CREDITS --- */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-medium text-slate-500 dark:text-slate-400">
          {/* Left aligned standard copyright tracking signature */}
          <div className="flex items-center gap-1 order-2 sm:order-1 text-center sm:text-left">
            <span>© {copyrightYear}</span>
            <span className="font-bold text-slate-700 dark:text-slate-300">Invoice Now</span>
            <span>• Built Local & Secure</span>
          </div>

          {/* Right aligned professional developer credits signature wrapper */}
          <div className="flex items-center gap-1 order-1 sm:order-2 p-0.5">
            <span>Developed with</span>
            <Icons.Heart />
            <span>by</span>
            <a
              href="https://ashutoshkrris.in"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-slate-800 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 transition-colors underline decoration-dotted underline-offset-4 focus:outline-none focus:ring-2 focus:ring-brand-500 rounded px-1"
            >
              Ashutosh Krishna
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
