export default function AboutPage({ onBack, theme }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-900 transition-colors duration-200">
      <div className="max-w-3xl mx-auto w-full px-4 md:px-8 py-12">
        <button
          type="button"
          onClick={onBack}
          className="no-print mb-8 text-sm font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          ← Back to invoice editor
        </button>

        <article className="bg-white dark:bg-slate-950 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 md:p-12">
          <p className="text-[11px] font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400 mb-3">
            About Invoice Now
          </p>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-6">
            Privacy-first invoices, entirely in your browser
          </h1>

          <div className="space-y-5 text-slate-600 dark:text-slate-300 leading-relaxed text-[15px]">
            <p>
              <strong className="text-slate-900 dark:text-white">Invoice Now</strong> is a
              lightweight, client-side invoice builder for freelancers and small businesses who
              want polished documents without surrendering client data to a remote server.
            </p>
            <p>
              Everything stays local: line items, customer details, branding, and exports. There is
              no account signup, no cloud sync, and no telemetry pipeline. Your browser holds the
              working state (via local storage), and exports render as PNG or PDF on your device.
            </p>
            <p>
              We built Invoice Now because most invoicing tools force a trade-off between polish and
              privacy. You should not need a SaaS subscription—or a data processing agreement—to
              send a clean invoice.
            </p>

            <h2 className="text-lg font-bold text-slate-900 dark:text-white pt-4">What you get</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Multiple professional templates with live WYSIWYG editing</li>
              <li>Country presets for currency, tax labels, and default rates</li>
              <li>Dark / light themes that follow your preference</li>
              <li>Print, PNG, and PDF export without uploading content</li>
            </ul>

            <h2 className="text-lg font-bold text-slate-900 dark:text-white pt-4">Open source</h2>
            <p>
              Invoice Now is open source. Contributions, bug reports, and template ideas are welcome
              on{" "}
              <a
                href="https://github.com/ashutoshkrris/invoice-now"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-brand-600 dark:text-brand-400 underline decoration-dotted underline-offset-4"
              >
                GitHub
              </a>
              .
            </p>
          </div>
        </article>
      </div>
    </div>
  );
}
