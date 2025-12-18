// src/components/EventGenresChart.jsx
import { useEffect, useState } from 'react';
import {
  PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer
} from 'recharts';

const colors = ['#ef4444', '#60a5fa', '#a78bfa', '#34d399', '#f59e0b']; // React, JS, Node, Angular, jQuery

export default function EventGenresChart({ events = [] }) {
  const [data, setData] = useState([]);

  const genres = ['React', 'JavaScript', 'Node', 'Angular', 'jQuery'];

  const getData = () =>
    genres
      .map((genre) => ({
        name: genre,
        value: events.filter((e) => e.summary?.toLowerCase().includes(genre.toLowerCase())).length,
      }))
      .filter((d) => d.value > 0); // hide zero-slice entries to avoid tiny/overlapping labels

  useEffect(() => {
    setData(getData());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [`${events}`]);

  // % labels inside slices
  const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, percent }) => {
    if (!percent) return null;
    const RAD = Math.PI / 180;
    const r = outerRadius * 0.72;
    const x = cx + r * Math.cos(-midAngle * RAD);
    const y = cy + r * Math.sin(-midAngle * RAD);
    return (
      <text x={x} y={y} fill="#e5e7eb" textAnchor="middle" dominantBaseline="central" fontSize="12">
        {(percent * 100).toFixed(0)}%
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={340}>
      <PieChart margin={{ top: 0, right: 0, bottom: 42, left: 0 }}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          outerRadius={110}
          labelLine={false}
          label={renderCustomizedLabel}
          isAnimationActive={false}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={colors[i % colors.length]} />
          ))}
        </Pie>

        {/* Legend pushed down so it never overlaps the pie */}
        <Legend
          verticalAlign="bottom"
          align="center"
          wrapperStyle={{ marginTop: 14 }}
          iconType="circle"
        />
        <Tooltip contentStyle={{ background: '#111827', border: '1px solid #374151' }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
