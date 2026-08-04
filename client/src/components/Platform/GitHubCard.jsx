import { motion } from 'framer-motion';
import { FiGithub, FiStar, FiUsers } from 'react-icons/fi';
import LanguageChart from '../Charts/LanguageChart';
import HeatMap from '../Charts/HeatMap';
import StatBadge from '../UI/StatBadge';
import ErrorCard from '../UI/ErrorCard';
import { PlatformCardSkeleton } from '../UI/LoadingSkeleton';

export default function GitHubCard({ result, loading }) {
  if (loading) return <PlatformCardSkeleton />;
  if (!result) return null;
  if (result.error) return <ErrorCard title="GitHub" message={result.error} />;

  const d = result.data;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 }}
      className="card p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FiGithub className="text-violet-400" size={18} />
          <h3 className="font-semibold text-slate-100">GitHub</h3>
        </div>
        {result.cached && (
          <span className="text-[10px] text-slate-500 font-stat">
            cached · {new Date(result.cachedAt).toLocaleTimeString()}
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <StatBadge icon={FiGithub} label="Repos" value={d.publicRepos} color="#8B7FD1" />
        <StatBadge icon={FiStar} label="Stars" value={d.totalStars} color="#F2B705" />
        <StatBadge icon={FiUsers} label="Followers" value={d.followers} color="#2DD4BF" />
      </div>

      <LanguageChart languages={d.topLanguages} />
      <div className="mt-3">
        <HeatMap activeDays={d.contributionStreakDays} />
      </div>
    </motion.div>
  );
}
