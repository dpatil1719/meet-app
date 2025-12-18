import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#ef4444', '#22c55e', '#6366f1', '#eab308', '#a855f7', '#9ca3af']; // last = "Other"

const GENRES = [
  { name: 'React',      rx: /react(?!\s*router)/i },            // React, React Native
  { name: 'JavaScript', rx: /\bjavascript\b|\bjs\b/i },         // JavaScript, JS
  { name: 'Node',       rx: /\bnode(\.js)?\b/i },               // Node, Node.js
  { name: 'jQuery',     rx: /\bjquery\b/i },                    // jQuery
  { name: 'Angular',    rx: /\bangular(\.js)?\b/i },            // Angular, AngularJS
];

export default function EventGenresChart({ events = [] }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const totals = GENRES.map(g => ({
      name: g.name,
      value: events.filter(e =>
        g.rx.test(((e && e.summary) || '') + ' ' + ((e && e.description) || ''))
      ).length,
    }));

    const matched = totals.reduce((s, d) => s + d.value, 0);
    const other = events.length > matched ? [{ name: 'Other', value: events.length - matched }] : [];
    setData([...totals, ...other]);
  }, [`${events}`]);

  const renderLabel = ({ cx, cy, midAngle, outerRadius, percent, index }) => {
    if (!percent) return null;
    const RAD = Math.PI / 180;
    const r = outerRadius * 1.12;
    const x = cx + r * Math.cos(-midAngle * RAD);
    const y = cy + r * Math.sin(-midAngle * RAD);
    const txt = `${data[index]?.name ?? ''} ${(percent * 100).toFixed(0)}%`;
    return (
      <text
        x={x}
        y={y}
        fill="#ffffff"
        fontSize="14"
        fontWeight="600"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        stroke="#000000"
        strokeWidth="0.6"
        paintOrder="stroke"
      >
        {txt}
      </text>
    );
  };

  const allZero = data.length && data.every(d => d.value === 0);

  if (allZero) {
    return (
      <div style={{ color: '#9ca3af', textAlign: 'center', padding: 16 }}>
        No genre data for this selection
      </div>
    );
  }

  return (
    <ResponsiveContainer width="99%" height={320}>
      <PieChart>
        <Pie data={data} dataKey="value" outerRadius={120} labelLine={false} label={renderLabel}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Legend verticalAlign="bottom" />
      </PieChart>
    </ResponsiveContainer>
  );
}
