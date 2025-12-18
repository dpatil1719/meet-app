// src/components/EventGenresChart.jsx
import { useMemo } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
} from "recharts";

// Canonical genres and robust matchers
const GENRES = ["React", "JavaScript", "Node", "jQuery", "Angular"];
const MATCHERS = {
  React: /(react)/i,
  JavaScript: /(javascript|\bjs\b|typescript|\bts\b)/i,
  Node: /(node(\.js)?)/i,
  jQuery: /(jquery)/i,
  Angular: /(angular)/i,
};

// Add a distinct "Other" slice to ensure the pie never disappears
const COLORS = ["#ef4444", "#22c55e", "#3b82f6", "#eab308", "#a855f7", "#9ca3af"]; // last = Other

export default function EventGenresChart({ events = [] }) {
  // Build data from the currently visible events
  const baseData = useMemo(() => {
    return GENRES.map((g) => {
      const re = MATCHERS[g];
      const value = events.filter((e) => re.test(e?.summary || "")).length;
      return { name: g, value };
    });
  }, [events]);

  const countsSum = baseData.reduce((s, d) => s + d.value, 0);
  const otherCount = Math.max(0, events.length - countsSum);

  // Always render: include "Other" when needed
  const data = otherCount > 0 ? [...baseData, { name: "Other", value: otherCount }] : baseData;

  // Custom outside labels with generous margins so "JavaScript" doesn't clip
  const renderLabel = ({ cx, cy, midAngle, outerRadius, percent, index }) => {
    if (!percent) return null;
    const RAD = Math.PI / 180;
    const r = outerRadius + 18;
    const x = cx + r * Math.cos(-midAngle * RAD);
    const y = cy + r * Math.sin(-midAngle * RAD);
    return (
      <text
        x={x}
        y={y}
        fontSize={14}
        fontWeight={700}
        fill="#e5e7eb"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${data[index].name} ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // If absolutely no events, show a friendly placeholder instead of a blank area
  if (events.length === 0) {
    return (
      <div className="chart-shell chart-shell--empty">
        <p>No events to visualize.</p>
      </div>
    );
  }

  return (
    <div className="chart-shell">
      <ResponsiveContainer width="100%" height={360} className="charts-rc">
        <PieChart margin={{ top: 8, right: 160, bottom: 8, left: 160 }}>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={120}
            labelLine={false}
            label={renderLabel}
            isAnimationActive
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Legend verticalAlign="bottom" align="center" />
          <Tooltip
            formatter={(v, n) => [`${v}`, n]}
            contentStyle={{ background: "#111827", border: "1px solid #374151", color: "#e5e7eb" }}
            itemStyle={{ color: "#e5e7eb" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
