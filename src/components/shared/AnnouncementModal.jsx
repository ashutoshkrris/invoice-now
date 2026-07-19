import { useState, useEffect } from "react";
import { Icons } from "./Icons";
import { CONSTANTS } from "../../constants/globalConstants";

export default function AnnouncementModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if the user has already seen the Invoice Now 2.0 announcement
    const hasSeenAnnouncement = localStorage.getItem(CONSTANTS.V2_ANNOUNCED_KEY);
    if (!hasSeenAnnouncement) {
      // Small timeout gives the app layout a moment to settle before popping the modal
      const timer = setTimeout(() => setIsOpen(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(CONSTANTS.V2_ANNOUNCED_KEY, "true");
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 no-print flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in">
      {/* MODAL CONTAINER */}
      <div
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh] scale-100 transition-all duration-300 transform"
        role="dialog"
        aria-modal="true"
      >
        {/* HEADER BRANDING */}
        <div className="p-6 pb-4 bg-gradient-to-br from-brand-50 to-white dark:from-slate-950 dark:to-slate-900 border-b border-slate-100 dark:border-slate-800/60 flex justify-between items-start">
          <div className="space-y-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider bg-brand-100 text-brand-700 dark:bg-brand-950/60 dark:text-brand-400 uppercase">
              🚀 What&apos;s New
            </span>
            <h2 className="text-xl font-black text-slate-950 dark:text-white tracking-tight">
              Welcome to Invoice Now 2.0
            </h2>
          </div>
          <button
            onClick={handleDismiss}
            className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
            aria-label="Dismiss announcement"
          >
            <Icons.Close className="w-4 h-4" />
          </button>
        </div>

        {/* FEATURE HIGHLIGHT SCROLL VIEW */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
            Thanks to the amazing feedback and feature reviews from our{" "}
            <a
              href="https://www.producthunt.com/products/invoice-now"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-brand-600 dark:text-brand-400 underline decoration-brand-500/30 hover:decoration-brand-500 hover:text-brand-700 dark:hover:text-brand-300 transition-all duration-200"
            >
              Product Hunt
            </a>{" "}
            community, we&apos;ve rebuilt the core architecture from scratch to make local billing
            more secure and productive.
          </p>

          {/* GRANULAR FEATURE MATRIX LIST */}
          <div className="space-y-3.5">
            <div className="flex gap-3">
              <span className="text-base shrink-0 mt-0.5">🗂️</span>
              <div>
                <h4 className="text-xs font-bold text-slate-950 dark:text-white">
                  Isolated Multi-Workspaces
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  Manage up to 25 distinct client and billing invoice profiles out of a streamlined
                  flyout sidebar directory.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="text-base shrink-0 mt-0.5">📥</span>
              <div>
                <h4 className="text-xs font-bold text-slate-950 dark:text-white">
                  Universal JSON Portability Backups
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  Export or import your entire database environment—complete with text records,
                  states, and logos—in a single secure file click.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="text-base shrink-0 mt-0.5">📱</span>
              <div>
                <h4 className="text-xs font-bold text-slate-950 dark:text-white">
                  Mobile-First Touch Architecture
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  Persistent multi-row controls that eliminate desktop hover triggers completely for
                  rapid management on touch targets.
                </p>
              </div>
            </div>
          </div>

          <hr className="border-slate-100 dark:border-slate-800/60" />

          {/* PRODUCT HUNT UPVOTE ZONE */}
          <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-950 dark:text-white">
                Loved these upgrades?
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Help us reach more creators with an honest upvote!
              </p>
            </div>
            {/* OFFICIAL PRODUCT HUNT EMBED */}
            <div className="shrink-0 select-none">
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
        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* ISSUE REPORT LINK */}
          <a
            href="https://github.com/ashutoshkrris/invoice-now/issues/new?template=bug_report.yml"
            target="_blank"
            rel="noreferrer"
            className="text-[11px] font-bold text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 transition-colors flex items-center gap-1 cursor-pointer"
          >
            🐛 Found an issue? Report it here
          </a>

          <button
            onClick={handleDismiss}
            className="w-full sm:w-auto px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors cursor-pointer text-center"
          >
            Awesome, Let&apos;s Go
          </button>
        </div>
      </div>
    </div>
  );
}
