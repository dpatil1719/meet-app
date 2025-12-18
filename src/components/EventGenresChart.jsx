// src/components/EventGenresChart.jsx
import { useEffect, useState } from 'react';
import {
  PieChart, Pie, ResponsiveContainer, Cell, Legend, Tooltip,
} from 'recharts';

const COLORS = ['#34d399', '#60a5fa', '#a78bfa', '#f87171', '#fbbf24']; // green, blue, violet, red, yellow

export default function EventGenresChart({ events = [] }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(buildData(events));
  }, [JSON.stringify(events)]);

  function buildData(evts) {
    const counts = { Angular: 0, JavaScript: 0, Node: 0, jQuery: 0, React: 0 };

    evts.forEach((e) => {
      const s = (e?.summary || '').toLowerCase();
      // order matters: count only one primary keyword per event
      if (/\breact\b/.test(s)) counts.React += 1;
      else if (/\bjavascript\b|\bjs\b/.test(s)) counts.JavaScript += 1;
      else if (/\bnode\b/.test(s)) counts.Node += 1;
      else if (/\bjquery\b/.test(s)) counts.jQuery += 1;
      else if (/\bangular\b/.test(s)) counts.Angular += 1;
    });

    const rows = Object.entries(counts).map(([name, value]) => ({ name, value }));
    const total = rows.reduce((a, r) => a + r.value, 0);

    // If nothing matches (e.g., Munich’s “JS Conf Warmup”), still render a pie
    if (total === 0 && evts.length > 0) return [{ name: 'Other', value: evts.length }];

    return rows;
  }

  // readable % labels on dark bg
  const renderPct = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (!percent) return null;
    const RAD = Math.PI / 180;
    const r = (innerRadius + outerRadius) / 2;
    const x = cx + r * Math.cos(-midAngle * RAD);
    const y = cy + r * Math.sin(-midAngle * RAD);
    return (
      <text
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="central"
        fill="#fff"
        stroke="rgba(0,0,0,.6)"
        strokeWidth={2}
        paintOrder="stroke"
        fontSize={14}
      >
        {(percent * 100).toFixed(0)}%
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={340}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          outerRadius={110}
          labelLine={false}
          label={renderPct}
          isAnimationActive={false}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>

        <Tooltip
          formatter={(val, name) => [val, name]}
          contentStyle={{ background: '#111827', border: '1px solid #374151' }}
          itemStyle={{ color: '#e5e7eb' }}
          labelStyle={{ color: '#e5e7eb' }}
        />
        <Legend verticalAlign="bottom" align="center" wrapperStyle={{ marginTop: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
