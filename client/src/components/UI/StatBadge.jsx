export default function StatBadge({ icon: Icon, label, value, color = '#F2B705' }) {
  return (
    <div className="flex items-center gap-2 bg-ink-900/60 border border-ink-600/60 rounded-lg px-3 py-2">
      {Icon && <Icon size={16} color={color} />}
      <div className="flex flex-col leading-tight">
        <span className="font-stat text-sm font-semibold text-slate-100">{value}</span>
        <span className="text-[11px] text-slate-500">{label}</span>
      </div>
    </div>
  );
}
