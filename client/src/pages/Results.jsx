import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import ScoreGauge from "../components/UI/ScoreGauge";
import SuggestionCard from "../components/UI/SuggestionCard";
import LeetCodeCard from "../components/Platform/LeetCodeCard";
import GitHubCard from "../components/Platform/GitHubCard";
import GFGCard from "../components/Platform/GFGCard";
import HackerRankCard from "../components/Platform/HackerRankCard";
import { DashboardSkeleton } from "../components/UI/LoadingSkeleton";
import { saveProfile } from "../utils/api";

export default function Results() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [profileName, setProfileName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("cpa_last_result");
    if (stored) {
      setData(JSON.parse(stored));
    }
  }, []);

  if (!data) {
    return (
      <div className="max-w-3xl mx-auto px-5 py-14 text-center">
        <p className="text-slate-400 mb-4">
          No analysis yet. Run one from the home page.
        </p>
        <button className="btn-primary" onClick={() => navigate("/")}>
          Go to Home
        </button>
      </div>
    );
  }

  const { overallScore, breakdown, insights, platforms } = data;

  const handleSave = async () => {
    if (!profileName.trim()) {
      toast.error("Enter a name to save this profile");
      return;
    }
    setSaving(true);
    try {
      await saveProfile({
        name: profileName,
        leetcode: platforms.leetcode?.data?.username || "",
        github: platforms.github?.data?.username || "",
        gfg: platforms.gfg?.data?.username || "",
        hackerrank: platforms.hackerrank?.data?.username || "",
        leetcodeData: platforms.leetcode?.data || null,
        githubData: platforms.github?.data || null,
        gfgData: platforms.gfg?.data || null,
        hackerrankData: platforms.hackerrank?.data || null,
        overallScore,
      });
      toast.success("Profile saved!");
      setProfileName("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-5 py-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6 mb-6 flex flex-col sm:flex-row items-center gap-8"
      >
        <ScoreGauge score={overallScore} />
        <div className="flex-1 w-full">
          <h2 className="text-lg font-semibold text-slate-100 mb-3">
            Overall Score Breakdown
          </h2>
          <div className="space-y-2">
            {Object.entries(breakdown)
              .filter(([, score]) => score !== null)
              .map(([platform, score]) => (
                <div key={platform} className="flex items-center gap-3">
                  <span className="text-xs w-24 capitalize text-slate-400">
                    {platform}
                  </span>
                  <div className="flex-1 h-2 bg-ink-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full"
                      style={{ width: `${score}%` }}
                    />
                  </div>
                  <span className="font-stat text-xs w-10 text-right text-slate-400">
                    {Math.round(score)}
                  </span>
                </div>
              ))}
          </div>

          <div className="flex items-center gap-2 mt-5">
            <input
              className="input-field"
              placeholder="Name this profile to save it"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
            />
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary whitespace-nowrap"
            >
              {saving ? "Saving…" : "Save profile"}
            </button>
          </div>
        </div>
      </motion.div>

      {!data && <DashboardSkeleton />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        <LeetCodeCard result={platforms.leetcode} />
        <GitHubCard result={platforms.github} />
        <GFGCard result={platforms.gfg} />
        <HackerRankCard result={platforms.hackerrank} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="card p-5">
          <h3 className="font-semibold text-slate-100 mb-3">Strong in</h3>
          <div className="flex flex-wrap gap-2">
            {insights.strengths.length ? (
              insights.strengths.map((s) => (
                <span
                  key={s}
                  className="text-xs bg-teal-400/10 text-teal-400 border border-teal-400/30 rounded-full px-3 py-1"
                >
                  {s}
                </span>
              ))
            ) : (
              <p className="text-sm text-slate-500">
                Analyse more platforms to see strengths.
              </p>
            )}
          </div>

          <h3 className="font-semibold text-slate-100 mb-3 mt-5">Needs work</h3>
          <div className="flex flex-wrap gap-2">
            {insights.weaknesses.length ? (
              insights.weaknesses.map((w) => (
                <span
                  key={w}
                  className="text-xs bg-coral-400/10 text-coral-400 border border-coral-400/30 rounded-full px-3 py-1"
                >
                  {w}
                </span>
              ))
            ) : (
              <p className="text-sm text-slate-500">Nothing flagged yet.</p>
            )}
          </div>
        </div>

        <SuggestionCard suggestions={insights.suggestions} />
      </div>
    </div>
  );
}
