import { motion } from 'framer-motion';
import { FiAward } from 'react-icons/fi';
import ErrorCard from '../UI/ErrorCard';
import { PlatformCardSkeleton } from '../UI/LoadingSkeleton';

export default function HackerRankCard({ result, loading }) {
  if (loading) return <PlatformCardSkeleton />;
  if (!result) return null;
  if (result.error) return <ErrorCard title="HackerRank" message={result.error} />;

  const d = result.data;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="card p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FiAward className="text-coral-400" size={18} />
          <h3 className="font-semibold text-slate-100">HackerRank</h3>
        </div>
      </div>

      <div className="mb-3">
        <p className="text-xs text-slate-500 mb-1.5">Badges ({d.badgeCount})</p>
        {d.badges?.length ? (
          <div className="flex flex-wrap gap-1.5">
            {d.badges.map((b) => (
              <span
                key={b}
                className="text-[11px] bg-coral-400/10 text-coral-400 border border-coral-400/30 rounded-full px-2.5 py-1"
              >
                {b}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">No badges found</p>
        )}
      </div>

      <div>
        <p className="text-xs text-slate-500 mb-1.5">Certifications ({d.certificationCount})</p>
        {d.certifications?.length ? (
          <ul className="text-sm text-slate-300 list-disc list-inside space-y-0.5">
            {d.certifications.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-500">No certifications found</p>
        )}
      </div>
    </motion.div>
  );
}
