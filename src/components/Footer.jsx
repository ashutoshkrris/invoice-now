import { Icons } from "./Icons";

export default function Footer() {
  const startYear = 2026;
  const currentYear = new Date().getFullYear();

  const copyrightYear = currentYear > startYear ? `${startYear}-${currentYear}` : `${startYear}`;

  return (
    <footer className="no-print mt-auto bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
        {/* Copyright branding */}
        <div className="flex items-center gap-1.5 order-2 sm:order-1">
          <span className="font-bold text-slate-900 dark:text-white">Invoice Now</span>
          <span>© {copyrightYear}</span>
          <span className="hidden sm:inline text-slate-300 dark:text-slate-700">|</span>
          <span className="hidden sm:inline">All rights reserved.</span>
        </div>

        {/* Builder Credits */}
        <div className="flex items-center gap-1 order-1 sm:order-2">
          <span>Developed with</span>
          <Icons.Heart />
          <span>by</span>
          <a
            href="https://ashutoshkrris.in"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-slate-800 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 transition-colors underline decoration-dotted underline-offset-4"
          >
            Ashutosh Krishna
          </a>
        </div>

        {/* Navigation & Project Links */}
        <div className="flex items-center gap-5 order-3">
          <a
            href="#/privacy"
            className="font-semibold hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Privacy
          </a>
          <a
            href="https://github.com/ashutoshkrris/invoice-now"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 font-semibold hover:text-slate-900 dark:hover:text-white transition-colors"
            title="View source code on GitHub"
          >
            <Icons.Github />
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
