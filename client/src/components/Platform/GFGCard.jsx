import { motion } from 'framer-motion';
import { FiTarget } from 'react-icons/fi';
import StatBadge from '../UI/StatBadge';
import ErrorCard from '../UI/ErrorCard';
import { PlatformCardSkeleton } from '../UI/LoadingSkeleton';

export default function GFGCard({ result, loading }) {
  if (loading) return <PlatformCardSkeleton />;
  if (!result) return null;
  if (result.error) return <ErrorCard title="GeeksForGeeks" message={result.error} />;

  const d = result.data;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="card p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FiTarget className="text-teal-400" size={18} />
          <h3 className="font-semibold text-slate-100">GeeksForGeeks</h3>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <StatBadge label="Coding score" value={d.codingScore} color="#2DD4BF" />
        <StatBadge label="Problems solved" value={d.problemsSolved} color="#F2B705" />
        <StatBadge label="Institute rank" value={d.instituteRank ?? '—'} color="#8B7FD1" />
        <StatBadge label="Streak" value={d.streak ?? 0} color="#F0654F" />
      </div>
    </motion.div>
  );
}
