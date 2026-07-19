import { Link } from "react-router-dom";
import { Icons } from "../shared/Icons"; // Standard relative directory step configuration
import { getCopyrightYear, getAppVersion } from "../../utils/utils";

export default function Footer() {
  return (
    <footer className="no-print mt-auto bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300 w-full">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-10 md:py-14">
        {/* --- TOP SECTION: BRAND + LINKS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 pb-10 border-b border-slate-100 dark:border-slate-900">
          {/* Left Column: Brand Identity, Description & Badge Embed */}
          <div className="md:col-span-5 space-y-4 text-left">
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
            {/* Product Hunt Embed Badge right under description */}
            <div className="pt-1 select-none">
              <a
                href="https://www.producthunt.com/products/invoice-now?embed=true&amp;utm_source=badge-featured&amp;utm_medium=badge&amp;utm_campaign=badge-invoice-now"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block transition-opacity duration-200 hover:opacity-90"
              >
                <img
                  alt="Invoice Now - Privacy-first invoice builder that runs entirely locally | Product Hunt"
                  width="250"
                  height="54"
                  src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1198464&amp;theme=light&amp;t=1784394098394"
                  className="w-[140px] md:w-[150px] h-auto object-contain dark:invert-[0.05] dark:hue-rotate-180"
                />
              </a>
            </div>
          </div>

          {/* Middle Columns: Future-Proof Navigation Link Columns */}
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

            {/* Column 2: Legal rules mapping */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Legal
              </h4>
              <ul className="space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                <li>
                  <Link
                    to="/privacy-policy"
                    className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms-of-use"
                    className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                  >
                    Terms of Use
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Open Source Links Matrix */}
          <div className="md:col-span-3 space-y-3 text-left md:text-right flex flex-col md:items-end justify-start">
            <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 w-full">
              Open Source
            </h4>
            <div className="flex flex-col gap-3 pt-1 w-full md:items-end font-semibold text-xs">
              <a
                href="https://github.com/ashutoshkrris/invoice-now"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors w-max"
                title="View source code on GitHub"
              >
                <Icons.Github />
                <span>GitHub Repository</span>
              </a>

              {/* Added Report Issue Link */}
              <a
                href="https://github.com/ashutoshkrris/invoice-now/issues/new?template=bug_report.yml"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors w-max"
                title="Report a bug or submit feedback on GitHub"
              >
                <svg
                  className="w-3.5 h-3.5 stroke-current fill-none shrink-0"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>Report an Issue</span>
              </a>

              <a
                href="https://github.com/sponsors/ashutoshkrris"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800/80 text-rose-600 dark:text-rose-400 font-bold text-xs rounded-lg border border-slate-200 dark:border-slate-800 transition-all duration-200 shadow-xs hover:shadow-sm w-max group select-none"
                title="Sponsor the project on GitHub"
              >
                <svg
                  className="w-3.5 h-3.5 fill-current transform group-hover:scale-110 transition-transform duration-200 shrink-0"
                  viewBox="0 0 16 16"
                >
                  <path d="M4.25 2.5c-1.336 0-2.75 1.034-2.75 2.5 0 3.5 4.75 7.75 6.5 7.75s6.5-4.25 6.5-7.75c0-1.466-1.414-2.5-2.75-2.5-1.072 0-2.072.714-2.5 1.5-.428-.786-1.428-1.5-2.5-1.5z" />
                </svg>
                <span>Sponsor</span>
              </a>
            </div>
          </div>
        </div>

        {/* --- BOTTOM SECTION: COPYRIGHT + CREDITS --- */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-medium text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1 order-2 sm:order-1 text-center sm:text-left">
            <span>© {getCopyrightYear()}</span>
            <span className="font-bold text-slate-700 dark:text-slate-300">Invoice Now</span>
            <span>• Built Local & Secure</span>
            <span>• v{getAppVersion()}</span>
          </div>

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
