import { FiTrendingUp } from 'react-icons/fi';

export default function SuggestionCard({ suggestions = [] }) {
  if (!suggestions.length) return null;

  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-3">
        <FiTrendingUp className="text-amber-400" size={18} />
        <h3 className="font-semibold text-slate-100">Improvement suggestions</h3>
      </div>
      <ul className="space-y-2">
        {suggestions.map((s, i) => (
          <li key={i} className="flex gap-2 text-sm text-slate-300">
            <span className="text-amber-400 font-stat">{String(i + 1).padStart(2, '0')}</span>
            <span>{s}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
