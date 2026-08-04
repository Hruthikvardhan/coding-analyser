import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiAward } from 'react-icons/fi';
import { getLeaderboard } from '../utils/api';

const RANK_COLORS = ['#F2B705', '#94a3b8', '#F0654F'];

export default function Leaderboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLeaderboard()
      .then(({ data }) => setData(data))
      .catch(() => toast.error('Failed to load leaderboard'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-5 py-10">
      <h1 className="text-2xl font-bold text-slate-100 mb-1">Leaderboard</h1>
      <p className="text-slate-400 text-sm mb-6">Top saved profiles by overall score.</p>

      {loading && <p className="text-slate-500">Loading…</p>}

      {data && (
        <div className="card divide-y divide-ink-600/50 overflow-hidden">
          {data.overall.length === 0 && (
            <p className="p-8 text-center text-slate-500">No saved profiles yet.</p>
          )}
          {data.overall.map((p, i) => (
            <motion.div
              key={p._id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className="flex items-center gap-4 px-5 py-4"
            >
              <div className="w-8 flex justify-center">
                {i < 3 ? (
                  <FiAward size={20} color={RANK_COLORS[i]} />
                ) : (
                  <span className="font-stat text-sm text-slate-500">{i + 1}</span>
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-100">{p.name}</p>
                <p className="text-xs text-slate-500">
                  LC {p.leetcodeData?.totalSolved || 0} solved · GH {p.githubData?.totalStars || 0}★
                </p>
              </div>
              <span className="font-stat font-bold text-amber-400">{Math.round(p.overallScore)}</span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
