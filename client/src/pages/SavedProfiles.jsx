import { motion } from 'framer-motion';
import { FiTrash2, FiEye } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import useProfile from '../hooks/useProfile';
import ScoreGauge from '../components/UI/ScoreGauge';

export default function SavedProfiles() {
  const { profiles, loading, remove } = useProfile();
  const navigate = useNavigate();

  const viewProfile = (p) => {
    sessionStorage.setItem(
      'cpa_last_result',
      JSON.stringify({
        overallScore: p.overallScore,
        breakdown: {
          leetcode: 0,
          github: 0,
          gfg: 0,
          hackerrank: 0
        },
        insights: { strengths: [], weaknesses: [], suggestions: [] },
        platforms: {
          leetcode: p.leetcodeData ? { data: p.leetcodeData } : null,
          github: p.githubData ? { data: p.githubData } : null,
          gfg: p.gfgData ? { data: p.gfgData } : null,
          hackerrank: p.hackerrankData ? { data: p.hackerrankData } : null
        }
      })
    );
    navigate('/results');
  };

  return (
    <div className="max-w-5xl mx-auto px-5 py-10">
      <h1 className="text-2xl font-bold text-slate-100 mb-1">Saved Profiles</h1>
      <p className="text-slate-400 text-sm mb-6">
        {loading ? 'Loading…' : `${profiles.length} profile${profiles.length === 1 ? '' : 's'} saved`}
      </p>

      {!loading && profiles.length === 0 && (
        <div className="card p-10 text-center text-slate-500">
          No saved profiles yet. Analyse a profile from Home and save it.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {profiles.map((p, i) => (
          <motion.div
            key={p._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="card p-5 flex flex-col items-center text-center"
          >
            <h3 className="font-semibold text-slate-100 mb-1">{p.name}</h3>
            <p className="text-[11px] text-slate-500 mb-3">
              Saved {new Date(p.savedAt).toLocaleDateString()}
            </p>
            <ScoreGauge score={p.overallScore} size={110} strokeWidth={8} />

            <div className="flex gap-2 mt-4 w-full">
              <button onClick={() => viewProfile(p)} className="btn-ghost flex-1 flex items-center justify-center gap-1.5 text-sm">
                <FiEye size={14} /> View
              </button>
              <button
                onClick={() => remove(p._id)}
                className="btn-ghost flex-1 flex items-center justify-center gap-1.5 text-sm hover:border-coral-400/60 hover:text-coral-400"
              >
                <FiTrash2 size={14} /> Delete
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
