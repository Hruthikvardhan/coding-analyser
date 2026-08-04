import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { DIFFICULTY_COLORS } from '../../utils/constants';

export default function DonutChart({ easy = 0, medium = 0, hard = 0 }) {
  const data = [
    { name: 'Easy', value: easy },
    { name: 'Medium', value: medium },
    { name: 'Hard', value: hard }
  ];
  const total = easy + medium + hard;

  return (
    <div className="relative h-48">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={3}
            stroke="none"
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={DIFFICULTY_COLORS[entry.name]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ background: '#111A2C', border: '1px solid #243252', borderRadius: 8 }}
            itemStyle={{ color: '#e2e8f0' }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="font-stat text-2xl font-bold text-slate-100">{total}</span>
        <span className="text-[11px] text-slate-500">solved</span>
      </div>
    </div>
  );
}
