import { motion } from 'framer-motion';

/**
 * Generic card shell used where a platform-specific card isn't needed
 * (e.g. compact summaries on SavedProfiles/Leaderboard grids).
 */
export default function PlatformCard({ icon: Icon, title, accentColor = '#F2B705', children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="card p-5"
    >
      <div className="flex items-center gap-2 mb-3">
        {Icon && <Icon size={18} color={accentColor} />}
        <h3 className="font-semibold text-slate-100">{title}</h3>
      </div>
      {children}
    </motion.div>
  );
}
