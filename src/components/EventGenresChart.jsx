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

const GENRES = ["React", "JavaScript", "Node", "jQuery", "Angular"];
const COLORS = ["#ef4444", "#22c55e", "#3b82f6", "#eab308", "#a855f7"];

export default function EventGenresChart({ events = [] }) {
  const data = useMemo(() => {
    const lower = (s) => (s || "").toLowerCase();
    return GENRES.map((g) => ({
      name: g,
      value: events.filter((e) => lower(e.summary).includes(lower(g))).length,
    }));
  }, [events]);

  const total = useMemo(() => data.reduce((s, d) => s + d.value, 0), [data]);

  const renderLabel = ({ cx, cy, midAngle, outerRadius, percent, index }) => {
    if (!percent) return null;
    const RAD = Math.PI / 180;
    const r = outerRadius + 16;
    const x = cx + r * Math.cos(-midAngle * RAD);
    const y = cy + r * Math.sin(-midAngle * RAD);
    return (
      <text
        x={x}
        y={y}
        fontSize={14}
        fontWeight={700}
        fill="#eaeaea"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${GENRES[index]} ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (!total) {
    return (
      <div className="chart-shell chart-shell--empty">
        <p>No genre data for the current filters.</p>
      </div>
    );
  }

  return (
    <div className="chart-shell">
      <ResponsiveContainer width="100%" height={360} className="charts-rc">
        <PieChart margin={{ top: 10, right: 90, bottom: 10, left: 90 }}>
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
