export default function ProfileCompareCard({ categories = [], p1Name, p2Name }) {
  return (
    <div className="card overflow-hidden">
      <div className="grid grid-cols-3 bg-ink-900/60 px-4 py-3 text-xs text-slate-500 font-medium">
        <span>{p1Name}</span>
        <span className="text-center">Category</span>
        <span className="text-right">{p2Name}</span>
      </div>
      <div className="divide-y divide-ink-600/50">
        {categories.map((c) => (
          <div key={c.key} className="grid grid-cols-3 px-4 py-3 items-center">
            <span
              className={`font-stat text-sm ${c.winner === 'p1' ? 'text-amber-400 font-bold' : 'text-slate-300'}`}
            >
              {c.v1}
              {c.winner === 'p1' && ' 🏆'}
            </span>
            <span className="text-center text-xs text-slate-500">{c.label}</span>
            <span
              className={`font-stat text-sm text-right ${
                c.winner === 'p2' ? 'text-amber-400 font-bold' : 'text-slate-300'
              }`}
            >
              {c.winner === 'p2' && '🏆 '}
              {c.v2}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
