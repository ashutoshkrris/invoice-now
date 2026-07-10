import { useNavigate } from "react-router-dom";

export default function BackButton({ label = "Back to Invoice Editor" }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/")}
      className="group flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 shadow-sm transition-all cursor-pointer select-none"
    >
      <span className="group-hover:-translate-x-0.5 transition-transform duration-200">←</span>
      <span>{label}</span>
    </button>
  );
}
