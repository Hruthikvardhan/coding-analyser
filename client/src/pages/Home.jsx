import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiArrowRight, FiClock } from "react-icons/fi";
import useAnalyse from "../hooks/useAnalyse";
import { RECENT_SEARCHES_KEY } from "../utils/constants";

const FIELDS = [
  { key: "leetcode", label: "LeetCode username" },
  { key: "github", label: "GitHub username" },
  { key: "gfg", label: "GeeksForGeeks username (coming soon)", disabled: true },
  {
    key: "hackerrank",
    label: "HackerRank username (coming soon)",
    disabled: true,
  },
  { key: "codechef", label: "CodeChef username (coming soon)", disabled: true },
];

export default function Home() {
  const navigate = useNavigate();
  const { analyse, loading } = useAnalyse();
  const [usernames, setUsernames] = useState({
    leetcode: "",
    github: "",
    gfg: "",
    hackerrank: "",
    codechef: "",
  });
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    try {
      setRecent(JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) || "[]"));
    } catch {
      setRecent([]);
    }
  }, []);

  const handleChange = (key) => (e) =>
    setUsernames((prev) => ({ ...prev, [key]: e.target.value }));

  const handleAnalyse = async () => {
    const result = await analyse(usernames);
    if (result) {
      sessionStorage.setItem("cpa_last_result", JSON.stringify(result));
      navigate("/results");
    }
  };

  const rerunSearch = (entry) => {
    const { at, ...usernamesOnly } = entry;
    setUsernames((prev) => ({ ...prev, ...usernamesOnly }));
  };

  return (
    <div className="max-w-3xl mx-auto px-5 py-14">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <span className="inline-block font-stat text-xs text-amber-400 tracking-widest mb-3">
          $ analyse --profile
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-3">
          Analyse Your Coding Journey
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
          Pull your public stats from LeetCode, GitHub, GeeksForGeeks and
          HackerRank into one dashboard — with a single score that reflects your
          all-round strength.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="card p-6 space-y-4"
      >
        {FIELDS.map((f) => (
          <div key={f.key}>
            <label className="text-xs text-slate-500 mb-1.5 block">
              {f.label}
            </label>
            <input
              className="input-field"
              placeholder={
                f.disabled ? "Coming in a future release" : "e.g. torvalds"
              }
              value={usernames[f.key]}
              onChange={handleChange(f.key)}
              disabled={f.disabled}
            />
          </div>
        ))}

        <button
          onClick={handleAnalyse}
          disabled={loading}
          className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
        >
          {loading ? (
            <span className="font-stat text-sm">analysing…</span>
          ) : (
            <>
              Analyse <FiArrowRight />
            </>
          )}
        </button>
      </motion.div>

      {recent.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center gap-2 text-slate-500 text-xs mb-3">
            <FiClock size={14} />
            Recent searches
          </div>
          <div className="flex flex-wrap gap-2">
            {recent.map((entry, i) => {
              const label =
                entry.leetcode ||
                entry.github ||
                entry.gfg ||
                entry.hackerrank ||
                "search";
              return (
                <button
                  key={i}
                  onClick={() => rerunSearch(entry)}
                  className="text-xs font-stat bg-ink-800/60 border border-ink-600/60 rounded-full px-3 py-1.5 text-slate-300 hover:border-amber-400/50 hover:text-amber-400 transition-colors"
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
