import { useEffect, useState } from "react";
import { Icons } from "../Icons";

export default function OpenSourceSection() {
  const [contributors, setContributors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchContributors() {
      try {
        setIsLoading(true);

        const res = await fetch(
          "https://api.github.com/repos/ashutoshkrris/invoice-now/contributors"
        );

        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();
        setContributors(data);
      } catch (err) {
        console.error("Error loading contributors:", err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    }

    fetchContributors();
  }, []);

  return (
    <>
      {/* --- OPEN SOURCE CORE DESCRIPTION --- */}
      <section className="mb-14 text-left space-y-4">
        <div>
          <h3 className="text-lg font-bold text-slate-950 dark:text-white tracking-tight">
            Open Source Community
          </h3>

          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-1">
            Invoice Now is built entirely in the open. We welcome feature requests, layout template
            submissions, localization improvements, and community bug reports.
          </p>
        </div>

        <a
          href="https://github.com/ashutoshkrris/invoice-now"
          target="_blank"
          rel="noopener noreferrer"
          className="group max-w-md flex items-center justify-between p-4 bg-white dark:bg-slate-900 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md hover:border-brand-500 dark:hover:border-brand-500 transition-all duration-200 cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-slate-900 dark:bg-slate-800 rounded-xl flex items-center justify-center text-white text-lg shrink-0 group-hover:scale-105 transition-transform">
              <Icons.Github />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-extrabold tracking-wide text-slate-400 dark:text-slate-500 uppercase">
                Hosted on GitHub
              </p>

              <p className="text-sm font-bold text-slate-900 dark:text-white truncate mt-0.5 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                ashutoshkrris / invoice-now
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-brand-600 dark:text-brand-400 opacity-80 group-hover:opacity-100 transition-opacity pl-2">
            <span>Contribute</span>
            <span className="group-hover:translate-x-0.5 transition-transform">→</span>
          </div>
        </a>
      </section>

      {/* --- CONTRIBUTORS --- */}
      <section className="border-slate-200 dark:border-slate-800 text-left space-y-6">
        <div>
          <h3 className="text-md font-bold text-slate-950 dark:text-white tracking-tight mb-1">
            Project Contributors
          </h3>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            Meet the incredible community of developers helping shape this tool.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse flex flex-col items-center p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/40 rounded-xl space-y-3"
              >
                <div className="h-12 w-12 bg-slate-200 dark:bg-slate-800 rounded-full" />
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : error || contributors.length === 0 ? (
          <div className="p-4 bg-slate-100 dark:bg-slate-900 text-xs font-semibold rounded-xl text-slate-500 dark:text-slate-400">
            Could not load live contributors. View them at{" "}
            <a
              href="https://github.com/ashutoshkrris/invoice-now"
              target="_blank"
              rel="noreferrer"
              className="text-brand-500 underline"
            >
              github.com/ashutoshkrris/invoice-now
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3.5">
            {contributors.map((user) => (
              <a
                key={user.id}
                href={user.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative p-3 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-slate-200 dark:border-slate-800/80 hover:border-brand-500 rounded-xl flex flex-col items-center text-center shadow-sm transition-all duration-200"
              >
                <span className="absolute top-1.5 right-1.5 text-slate-300 group-hover:text-brand-500 text-[10px]">
                  ↗
                </span>

                <img
                  src={user.avatar_url}
                  alt={`${user.login} avatar`}
                  className="h-12 w-12 rounded-full object-cover border mb-2"
                  loading="lazy"
                />

                <p className="text-[11px] font-bold truncate w-full">@{user.login}</p>

                <p className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">
                  {user.contributions} {user.contributions === 1 ? "commit" : "commits"}
                </p>
              </a>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
