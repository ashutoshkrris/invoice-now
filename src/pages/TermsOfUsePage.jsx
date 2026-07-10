import BackButton from "../components/shared/BackButton";

export default function TermsOfUsePage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-400 transition-colors duration-200">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-16 text-left space-y-8">
        {/* --- BACK BUTTON --- */}
        <BackButton />

        {/* --- HEADER --- */}
        <header className="space-y-3 border-b border-slate-200 dark:border-slate-800 pb-6">
          <span className="text-[10px] font-extrabold tracking-widest text-brand-600 dark:text-brand-400 uppercase block">
            LEGAL TERMS
          </span>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-950 dark:text-white leading-tight">
            Terms of Use
          </h2>
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Last Updated: July 2026
          </p>
        </header>

        {/* --- CONTENT BODY --- */}
        <div className="space-y-6 text-sm font-medium leading-relaxed">
          <section className="space-y-2.5">
            <h3 className="text-base font-bold text-slate-950 dark:text-white tracking-tight">
              1. Application Acceptance & Licensing
            </h3>
            <p>
              Invoice Now provides a software platform strictly for local document building. By
              interacting with this browser utility workspace, you acknowledge that you are using an
              open-source tool distributed for free under open community developer licensing
              parameters.
            </p>
          </section>

          <section className="space-y-2.5">
            <h3 className="text-base font-bold text-slate-950 dark:text-white tracking-tight">
              2. User Data Responsibilities
            </h3>
            <p>
              Because this tool lacks a database back-end layer or administrative backup protocols,{" "}
              <strong className="text-slate-950 dark:text-white font-semibold">
                you assume full, exclusive ownership over data recovery and management
              </strong>
              . If you clear out browser cookies or wipe system configuration paths, any structural
              records matching your templates are permanently unrecoverable. We hold zero liability
              for lost records or accidental deletions.
            </p>
          </section>

          <section className="space-y-2.5">
            <h3 className="text-base font-bold text-slate-950 dark:text-white tracking-tight">
              3. Permitted Commercial Use
            </h3>
            <p>
              You are permitted to use Invoice Now to generate commercial billing invoices for
              corporate workflows, client operations, corporate distributions, and billing
              adjustments completely free of royalties or platform usage surcharges. You are
              explicitly prohibited from wrapping this localized software script inside paid
              mirroring containers or reselling this tool under deceptive proprietary terms.
            </p>
          </section>

          <section className="space-y-2.5">
            <h3 className="text-base font-bold text-slate-950 dark:text-white tracking-tight">
              4. Disclaimer of Warranties
            </h3>
            <p className="italic bg-slate-100 dark:bg-slate-900 border-l-2 border-slate-300 dark:border-slate-700 p-4 rounded-r-xl text-slate-600 dark:text-slate-400">
              The application is provided &ldquo;as is&rdquo;, without warranty of any kind, express
              or implied, including but not limited to the warranties of merchantability, fitness
              for a particular purpose, or non-infringement. In no event shall the authors,
              copyright holders, or open-source project maintainers be liable for any claim,
              damages, or other financial liabilities arising out of or in connection with the
              software.
            </p>
          </section>

          <section className="space-y-2.5">
            <h3 className="text-base font-bold text-slate-950 dark:text-white tracking-tight">
              5. Tax & Legal Compliance
            </h3>
            <p>
              Invoice Now provides country presets and layout templates purely as visual starting
              configurations. This tool does not verify the legal validity of your corporate tax
              labels, invoicing formatting rules, or regional accounting compliance guidelines. You
              remain entirely responsible for validating that your generated calculations conform to
              your local tax authority codes.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
