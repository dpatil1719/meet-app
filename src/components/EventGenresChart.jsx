import { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Tooltip,
  Legend,
  Cell,
} from 'recharts';

const COLORS = ['#22c55e', '#60a5fa', '#a78bfa', '#f59e0b', '#ef4444']; // Angular, JavaScript, Node, jQuery, React
const GENRES = ['Angular', 'JavaScript', 'Node', 'jQuery', 'React'];

export default function EventGenresChart({ events }) {
  const [data, setData] = useState([]);

  // build data: [{name: 'React', value: 16}, ...]
  const getData = () =>
    GENRES.map((genre) => {
      const count = events.filter((e) => e.summary?.toLowerCase().includes(genre.toLowerCase())).length;
      return { name: genre, value: count };
    });

  useEffect(() => {
    setData(getData());
  }, [`${events}`]); // re-run when events change

  // crisp, readable, on-slice labels (white text with dark outline)
  const renderPctLabel = ({ cx, cy, midAngle, innerRadius = 0, outerRadius, percent }) => {
    if (!percent) return null;
    const RAD = Math.PI / 180;
    // place slightly inside the slice so it never collides with edges
    const r = ((innerRadius + outerRadius) / 2) * 0.92;
    const x = cx + r * Math.cos(-midAngle * RAD);
    const y = cy + r * Math.sin(-midAngle * RAD);
    return (
      <text
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="14"
        fontWeight="700"
        // outline under the fill for contrast on any slice color
        stroke="rgba(0,0,0,0.55)"
        strokeWidth="3"
        style={{ paintOrder: 'stroke' }}
        fill="#ffffff"
        className="chart-label"
      >
        {`${Math.round(percent * 100)}%`}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={360}>
      <PieChart margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="40%"
          cy="48%"
          outerRadius={120}
          labelLine={false}
          label={renderPctLabel}
          isAnimationActive={false} // avoid subtle prod/dev animation diffs
        >
          {data.map((entry, i) => (
            <Cell key={`cell-${entry.name}`} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>

        <Tooltip
          formatter={(value, name) => [`${value}`, name]}
          contentStyle={{
            background: 'rgba(17,17,17,.9)',
            border: '1px solid rgba(255,255,255,.12)',
            borderRadius: 8,
            color: '#e5e7eb',
          }}
        />
        <Legend
          verticalAlign="bottom"
          align="center"
          iconType="circle"
          wrapperStyle={{ paddingTop: 10 }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
