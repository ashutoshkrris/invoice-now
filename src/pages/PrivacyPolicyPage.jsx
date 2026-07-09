import BackButton from "../components/shared/BackButton";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-400 transition-colors duration-200">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-16 text-left space-y-8">
        {/* --- BACK BUTTON --- */}
        <BackButton />

        {/* --- HEADER --- */}
        <header className="space-y-3 border-b border-slate-200 dark:border-slate-800 pb-6">
          <span className="text-[10px] font-extrabold tracking-widest text-brand-600 dark:text-brand-400 uppercase block">
            LEGAL DOCUMENT
          </span>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-950 dark:text-white leading-tight">
            Privacy Policy
          </h2>
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Last Updated: July 2026
          </p>
        </header>

        {/* --- CONTENT BODY --- */}
        <div className="space-y-6 text-sm font-medium leading-relaxed">
          <section className="space-y-2.5">
            <h3 className="text-base font-bold text-slate-950 dark:text-white tracking-tight">
              1. Our Privacy Commitment
            </h3>
            <p>
              Invoice Now is built entirely on a{" "}
              <strong className="text-slate-950 dark:text-white font-semibold">
                privacy-first, client-side architecture
              </strong>
              . We believe your business analytics, item rates, financial margins, and customer
              databases belong entirely to you. Our core operational baseline guarantees that data
              stays localized strictly on your physical browser window.
            </p>
          </section>

          <section className="space-y-2.5">
            <h3 className="text-base font-bold text-slate-950 dark:text-white tracking-tight">
              2. Data Collection & Processing Boundaries
            </h3>
            <p>
              Unlike standard invoice generators,{" "}
              <strong className="text-slate-950 dark:text-white font-semibold">
                Invoice Now does not run a remote database server, database layer, cloud
                synchronization stack, or user signup gateway
              </strong>
              .
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600 dark:text-slate-400">
              <li>
                <strong className="text-slate-800 dark:text-slate-200">Invoice Metadata:</strong>{" "}
                Line items, client names, payment notes, taxes, and branding colors exist solely
                inside your browser’s temporary state or local sandbox storage.
              </li>
              <li>
                <strong className="text-slate-800 dark:text-slate-200">Image Uploads:</strong> When
                importing a business logo, it is converted directly to a base64 inline graphic
                string inside your browser cache. It is never transmitted across the network.
              </li>
              <li>
                <strong className="text-slate-800 dark:text-slate-200">
                  Telemetry & Analytics:
                </strong>{" "}
                We do not run any cookies, pixel trackers, heatmaps, or behavioral user metrics
                collection programs.
              </li>
            </ul>
          </section>

          <section className="space-y-2.5">
            <h3 className="text-base font-bold text-slate-950 dark:text-white tracking-tight">
              3. Local Browser Storage
            </h3>
            <p>
              To protect your workspace against accidental window closures or page reloads, this
              application stores your active working invoice layout variables inside your
              browser&apos;s{" "}
              <strong className="text-slate-950 dark:text-white font-semibold">
                Local Storage
              </strong>{" "}
              cache. This profile data resides on your machine indefinitely until you manually click
              through to wipe it out or clear your overall browser system cache history.
            </p>
          </section>

          <section className="space-y-2.5">
            <h3 className="text-base font-bold text-slate-950 dark:text-white tracking-tight">
              4. Offline Document Exporting
            </h3>
            <p>
              Document compilation for Print window structures, crisp high-res PNG configurations,
              and vector-perfect PDF compilation layers execute entirely client-side via canvas
              rendering dependencies. Your financial details are{" "}
              <strong className="text-brand-600 dark:text-brand-400 font-semibold">
                never uploaded to third-party file clouds
              </strong>{" "}
              or external microservices to finalize file processing.
            </p>
          </section>

          <section className="space-y-2.5">
            <h3 className="text-base font-bold text-slate-950 dark:text-white tracking-tight">
              5. Contact & Open Source Auditing
            </h3>
            <p>
              Because this application is 100% open source, you do not have to take our privacy
              claims on faith. Anyone can review, analyze, and test every line of code handling the
              processing pipeline by inspecting the raw code in our public GitHub repository. For
              systemic inquiries regarding this framework, you can open an issue ticket inside the
              project community hub.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
