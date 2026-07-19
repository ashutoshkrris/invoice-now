import OpenSourceSection from "../components/about/OpenSourceSection";
import BackButton from "../components/shared/BackButton";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-16 text-left space-y-8">
        {/* --- BACK BUTTON NAVIGATION --- */}
        <BackButton />

        {/* --- MAIN CORE DESCRIPTION --- */}
        <header className="space-y-3 border-b border-slate-200 dark:border-slate-800 pb-6">
          <span className="text-[10px] font-extrabold tracking-widest text-brand-600 dark:text-brand-400 uppercase block">
            ABOUT INVOICE NOW
          </span>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-950 dark:text-white max-w-2xl leading-tight">
            Privacy-first invoices, entirely in your browser
          </h2>
          <div className="space-y-5 text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium max-w-3xl leading-relaxed pt-2">
            <p>
              Invoice Now is a lightweight,{" "}
              <strong className="text-slate-900 dark:text-white font-bold">
                client-side invoice builder
              </strong>{" "}
              for freelancers and small businesses who want polished documents without surrendering
              client data to a remote server.
            </p>
            <p>
              <strong className="text-slate-900 dark:text-white font-bold">
                Everything stays local:
              </strong>{" "}
              line items, customer details, branding, assets, and exports. There is{" "}
              <strong className="text-slate-900 dark:text-white font-bold">
                no account signup, no cloud sync, and no telemetry pipeline
              </strong>
              . Your browser manages workspace setups using a hybrid local storage system: text
              configurations map to{" "}
              <strong className="text-slate-900 dark:text-white font-bold">local storage</strong>,
              while heavy assets like business logos scale seamlessly through an isolated
              client-side{" "}
              <strong className="text-slate-900 dark:text-white font-bold">
                IndexedDB sandbox
              </strong>
              .
            </p>
            <p>
              With our built-in{" "}
              <strong className="text-slate-900 dark:text-white font-bold">
                JSON Portability Engine
              </strong>
              , you can backup all your data, workspaces, and branding assets in a single text file
              to keep your local information secure, portable, and offline.
            </p>
            <p>
              We built Invoice Now because most online tools force an unnecessary trade-off between
              highlighted layouts and data privacy. You should{" "}
              <strong className="text-brand-600 dark:text-brand-400 font-bold">
                not need a SaaS subscription
              </strong>{" "}
              —or a complex data processing agreement—to simply send a clean bill to your client.
            </p>
          </div>
        </header>

        {/* --- EXPANDED APPLICATIONS DETAILS --- */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 mb-12 text-left shadow-sm">
          <h3 className="text-sm font-bold text-slate-950 dark:text-white mb-4 tracking-tight">
            Features & Capabilities
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
            <li className="flex items-start gap-2.5">
              <span className="text-emerald-500 shrink-0 mt-0.5">✓</span>
              <span>
                Multiple premium templates featuring instant{" "}
                <strong className="text-slate-900 dark:text-white font-bold">
                  WYSIWYG editing
                </strong>{" "}
                workflows.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-emerald-500 shrink-0 mt-0.5">✓</span>
              <span>
                Isolated{" "}
                <strong className="text-slate-900 dark:text-white font-bold">
                  Multi-Workspace switcher
                </strong>{" "}
                supporting up to 25 completely standalone invoice registries.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-emerald-500 shrink-0 mt-0.5">✓</span>
              <span>
                Universal{" "}
                <strong className="text-slate-900 dark:text-white font-bold">
                  JSON Data Backup & Restore
                </strong>{" "}
                engines with built-in cache-eviction safeguards.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-emerald-500 shrink-0 mt-0.5">✓</span>
              <span>
                Intelligent localized configurations for currencies,{" "}
                <strong className="text-slate-900 dark:text-white font-bold">
                  custom tax labels
                </strong>
                , and default system rates.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-emerald-500 shrink-0 mt-0.5">✓</span>
              <span>
                High-performance architecture separating metadata from graphics using{" "}
                <strong className="text-slate-900 dark:text-white font-bold">
                  IndexedDB asset storage
                </strong>
                .
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-emerald-500 shrink-0 mt-0.5">✓</span>
              <span>
                Seamless dark/light theme options matching your system{" "}
                <strong className="text-slate-900 dark:text-white font-bold">
                  preference configurations
                </strong>
                .
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-emerald-500 shrink-0 mt-0.5">✓</span>
              <span>
                Zero external processing; print, high-res PNG, and{" "}
                <strong className="text-slate-900 dark:text-white font-bold">
                  vector PDF compilation run entirely offline
                </strong>
                .
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-emerald-500 shrink-0 mt-0.5">✓</span>
              <span>
                Comprehensive chronological{" "}
                <strong className="text-slate-900 dark:text-white font-bold">
                  undo and redo state histories
                </strong>{" "}
                built straight into the engine.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-emerald-500 shrink-0 mt-0.5">✓</span>
              <span>
                Adaptive component-driven architecture engineered for{" "}
                <strong className="text-slate-900 dark:text-white font-bold">
                  fully mobile-responsive
                </strong>{" "}
                and touch-accessible layouts.
              </span>
            </li>
          </ul>
        </section>

        <OpenSourceSection />
      </div>
    </div>
  );
}
