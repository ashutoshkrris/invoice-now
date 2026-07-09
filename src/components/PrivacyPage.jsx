export default function PrivacyPage({ onBack }) {
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
            Privacy Policy
          </p>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
            Your data never leaves this browser
          </h1>
          <p className="text-xs text-slate-400 mb-8">Last updated: July 2026</p>

          <div className="space-y-5 text-slate-600 dark:text-slate-300 leading-relaxed text-[15px]">
            <p>
              Invoice Now is a <strong className="text-slate-900 dark:text-white">client-side only</strong>{" "}
              application. We do not operate application backends that store invoices, customer
              records, payment details, or other personally identifiable information (PII).
            </p>

            <h2 className="text-lg font-bold text-slate-900 dark:text-white pt-2">What we collect</h2>
            <p>
              <strong className="text-slate-900 dark:text-white">Nothing from your invoices.</strong>{" "}
              Business names, client addresses, line items, tax IDs, bank instructions, logos, and
              notes remain in your browser session. Draft state may be written to{" "}
              <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">localStorage</code>{" "}
              on your device so work survives a refresh—this storage is not transmitted to us.
            </p>

            <h2 className="text-lg font-bold text-slate-900 dark:text-white pt-2">Exports</h2>
            <p>
              PDF and PNG exports are generated entirely in the browser using local rendering
              libraries. Files download to your machine; they are not uploaded to Invoice Now
              servers (there are none for invoice content).
            </p>

            <h2 className="text-lg font-bold text-slate-900 dark:text-white pt-2">Third parties</h2>
            <p>
              Hosting for the static site (for example GitHub Pages or similar) may log standard
              web request metadata (IP, user agent) as part of delivering the HTML/JS assets. That
              infrastructure does not receive the contents of invoices you create.
            </p>

            <h2 className="text-lg font-bold text-slate-900 dark:text-white pt-2">Your control</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Clear site data / local storage in your browser to erase local drafts</li>
              <li>Work offline after the app assets are cached by your browser</li>
              <li>Audit the open-source code on GitHub at any time</li>
            </ul>

            <h2 className="text-lg font-bold text-slate-900 dark:text-white pt-2">Contact</h2>
            <p>
              Questions about this policy can be raised via the project repository:{" "}
              <a
                href="https://github.com/ashutoshkrris/invoice-now"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-brand-600 dark:text-brand-400 underline decoration-dotted underline-offset-4"
              >
                ashutoshkrris/invoice-now
              </a>
              .
            </p>
          </div>
        </article>
      </div>
    </div>
  );
}
