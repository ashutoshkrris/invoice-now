import Footer from "../components/Footer";

export default function PrivacyPage({ theme, setTheme }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <header className="no-print border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <a
            href="#/"
            className="font-bold text-lg text-slate-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
          >
            Invoice Now
          </a>
          <div className="flex items-center gap-4 text-sm">
            <a
              href="#/"
              className="font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Back to editor
            </a>
            <button
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {theme === "dark" ? "Light" : "Dark"}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto px-4 md:px-8 py-12 w-full">
        <p className="text-xs font-bold tracking-widest uppercase text-brand-600 dark:text-brand-400 mb-3">
          Privacy Policy
        </p>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
          Your data never leaves your browser
        </h1>
        <div className="space-y-5 text-base leading-relaxed text-slate-600 dark:text-slate-300">
          <p>
            <strong className="text-slate-900 dark:text-white">Invoice Now</strong> is a
            client-side application. We do not operate a backend that stores invoices, client
            records, or personally identifiable information (PII).
          </p>
          <p>
            All invoice content — business details, customer names, addresses, line items, payment
            notes, and logos — is held in your browser&apos;s memory and optional local storage on
            your device. Nothing is uploaded to our servers because we do not collect it.
          </p>
          <p>
            When you export a PDF or PNG, the file is generated locally in your browser and saved
            to your device. Print output is handled by your operating system&apos;s print dialog.
          </p>
          <p>
            Theme preference may be stored in <code className="text-sm">localStorage</code> solely
            so the app can remember light or dark mode between visits. You can clear this at any
            time via your browser settings.
          </p>
          <p>
            Invoice Now does not use analytics cookies, advertising trackers, or third-party data
            brokers. If you open an external link (for example, the GitHub repository), that site
            has its own privacy policy.
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Last updated: July 2026
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
