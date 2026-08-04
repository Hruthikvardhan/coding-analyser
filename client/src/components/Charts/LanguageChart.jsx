import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const PALETTE = ['#8B7FD1', '#F2B705', '#2DD4BF', '#F0654F', '#5B8DEF', '#E879F9'];

export default function LanguageChart({ languages = [] }) {
  if (!languages.length) {
    return <p className="text-sm text-slate-500 py-8 text-center">No language data available yet.</p>;
  }

  return (
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={languages} dataKey="count" nameKey="name" outerRadius={70} stroke="none">
            {languages.map((entry, i) => (
              <Cell key={entry.name} fill={PALETTE[i % PALETTE.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ background: '#111A2C', border: '1px solid #243252', borderRadius: 8 }}
            itemStyle={{ color: '#e2e8f0' }}
          />
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            wrapperStyle={{ fontSize: 12, color: '#94a3b8' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
