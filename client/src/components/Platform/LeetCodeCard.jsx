import { motion } from "framer-motion";
import { FiCode } from "react-icons/fi";
import DonutChart from "../Charts/DonutChart";
import StatBadge from "../UI/StatBadge";
import ErrorCard from "../UI/ErrorCard";
import { PlatformCardSkeleton } from "../UI/LoadingSkeleton";

export default function LeetCodeCard({ result, loading }) {
  if (loading) return <PlatformCardSkeleton />;
  if (!result) return null;
  if (result.error)
    return <ErrorCard title="LeetCode" message={result.error} />;

  const d = result.data;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="card p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FiCode className="text-amber-400" size={18} />
          <h3 className="font-semibold text-slate-100">LeetCode</h3>
        </div>
        {result.cached && (
          <span className="text-[10px] text-slate-500 font-stat">
            cached · {new Date(result.cachedAt).toLocaleTimeString()}
          </span>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <DonutChart
          easy={d.easySolved}
          medium={d.mediumSolved}
          hard={d.hardSolved}
        />
        <div className="grid grid-cols-2 gap-2 w-full">
          <StatBadge
            label="Acceptance"
            value={
              d.acceptanceRate !== null && d.acceptanceRate !== undefined
                ? `${d.acceptanceRate}%`
                : "N/A"
            }
            color="#F2B705"
          />
          <StatBadge
            label="Global rank"
            value={d.ranking ? `#${d.ranking.toLocaleString()}` : "—"}
            color="#8B7FD1"
          />
          <StatBadge
            label="Contest rating"
            value={d.contestRating ?? "N/A"}
            color="#2DD4BF"
          />
          <StatBadge
            label="Top %"
            value={d.topPercentage ? `${d.topPercentage}%` : "—"}
            color="#F0654F"
          />
        </div>
      </div>
    </motion.div>
  );
}
