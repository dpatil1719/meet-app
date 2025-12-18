import { useMemo } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const GENRES = ['React', 'JavaScript', 'Node', 'jQuery', 'Angular'];
const COLORS = ['#ef4444', '#22c55e', '#3b82f6', '#facc15', '#a855f7'];

// Match common variants so localhost data (e.g., "JS Conf", "Node.js", "React Native") counts
const PATTERN = {
  React: /react/i,
  JavaScript: /\bjavascript\b|(^|\s)js(\b|[^a-z])/i,
  Node: /\bnode(\.js)?\b/i,
  jQuery: /\bjquery\b/i,
  Angular: /\bangular\b/i
};

export default function EventGenresChart({ events = [] }) {
  const data = useMemo(() => {
    return GENRES.map((name) => ({
      name,
      value: events.filter(e => PATTERN[name].test((e?.summary ?? ''))).length
    }));
  }, [events]);

  const total = data.reduce((s, d) => s + d.value, 0);

  const renderLabel = ({ cx, cy, midAngle, outerRadius, percent, index }) => {
    if (!percent) return null;
    const RAD = Math.PI / 180;
    const r = outerRadius + 10; // push text outside the slice
    const x = cx + r * Math.cos(-midAngle * RAD);
    const y = cy + r * Math.sin(-midAngle * RAD);
    return (
      <text
        x={x}
        y={y}
        fontSize={14}
        fontWeight={600}
        fill="#ffffff"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
      >
        {`${GENRES[index]} ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={340}>
      <PieChart margin={{ top: 16, right: 56, bottom: 8, left: 56 }}>
        {total ? (
          <>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={115}
              labelLine={false}
              label={renderLabel}
              isAnimationActive={false}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" align="center" iconType="circle" iconSize={10} />
          </>
        ) : (
          <text x="50%" y="50%" textAnchor="middle" fill="#9CA3AF" fontSize="14">
            No genre data for current selection
          </text>
        )}
      </PieChart>
    </ResponsiveContainer>
  );
}
