import { useNavigate } from "react-router-dom";
import OpenSourceSection from "./about/OpenSourceSection";

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-16">
        {/* --- BACK BUTTON NAVIGATION --- */}
        <button
          onClick={() => navigate("/")}
          className="group mb-10 flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 shadow-sm transition-all cursor-pointer"
        >
          <span className="group-hover:-translate-x-0.5 transition-transform">←</span> Back to
          Invoice Editor
        </button>

        {/* --- MAIN CORE DESCRIPTION --- */}
        <header className="space-y-4 mb-12 text-left">
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
              line items, customer details, branding, and exports. There is{" "}
              <strong className="text-slate-900 dark:text-white font-bold">
                no account signup, no cloud sync, and no telemetry pipeline
              </strong>
              . Your browser holds the working state exclusively via{" "}
              <strong className="text-slate-900 dark:text-white font-bold">local storage</strong>,
              and exports render as PNG or PDF directly on your hardware device.
            </p>
            <p>
              We built Invoice Now because most online tools force an unnecessary trade-off between
              polish and data privacy. You should{" "}
              <strong className="text-brand-600 dark:text-brand-400 font-bold">
                not need a SaaS subscription
              </strong>
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
                viewports.
              </span>
            </li>
          </ul>
        </section>

        <OpenSourceSection />
      </div>
    </div>
  );
}
