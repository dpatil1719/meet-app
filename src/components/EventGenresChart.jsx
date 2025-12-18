// src/components/EventGenresChart.jsx
import { useEffect, useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';

const GENRES = ['React', 'JavaScript', 'Node', 'jQuery', 'Angular'];
// Pleasant, high-contrast palette on dark UI
const COLORS = ['#f87171', '#60a5fa', '#a78bfa', '#facc15', '#34d399']; // red, blue, purple, yellow, green

function getTextColor(hex) {
  // Compute luminance to decide white/near-black label for contrast
  const c = hex.replace('#', '');
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  const L = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return L > 0.6 ? '#0f172a' : '#ffffff'; // dark text on light slice, white on dark
}

export default function EventGenresChart({ events = [] }) {
  const [data, setData] = useState([]);

  const buildData = useMemo(
    () => () =>
      GENRES.map((genre) => {
        const count = events.filter((e) =>
          (e.summary || '').toLowerCase().includes(genre.toLowerCase())
        ).length;
        return { name: genre, value: count };
      }).filter((d) => d.value > 0), // drop empty slices; remove this line if you want to keep them
    [events]
  );

  useEffect(() => {
    setData(buildData());
  }, [buildData]);

  // Always-visible % label with contrast + subtle outline
  const renderLabel = ({ cx, cy, midAngle, outerRadius, percent, index }) => {
    if (!percent) return null;
    const RAD = Math.PI / 180;
    const r = outerRadius * 0.72; // place label well inside the slice
    const x = cx + r * Math.cos(-midAngle * RAD);
    const y = cy + r * Math.sin(-midAngle * RAD);
    const color = getTextColor(COLORS[index % COLORS.length]);

    return (
      <text
        x={x}
        y={y}
        fill={color}
        fontSize={14}
        textAnchor="middle"
        dominantBaseline="central"
        style={{
          paintOrder: 'stroke',
          stroke: 'rgba(0,0,0,0.65)', // outline for readability on any fill
          strokeWidth: 3,
        }}
      >
        {`${Math.round(percent * 100)}%`}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="99%" height={360}>
      <PieChart>
        <Tooltip
          formatter={(value, name) => [`${value} events`, name]}
          wrapperStyle={{ borderRadius: 8 }}
          contentStyle={{
            background: '#0b0f1a',
            border: '1px solid #334155',
            color: '#e2e8f0',
          }}
          itemStyle={{ color: '#e2e8f0' }}
          cursor={{ fill: 'rgba(148,163,184,0.08)' }}
        />
        <Legend verticalAlign="bottom" align="center" iconType="circle" />
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="46%"
          outerRadius={120}
          labelLine
          label={renderLabel}
          isAnimationActive={false}
        >
          {data.map((entry, i) => (
            <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
