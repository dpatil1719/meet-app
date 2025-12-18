import { useMemo } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
} from "recharts";

const GENRES = ["Angular", "JavaScript", "Node", "React", "jQuery"];
const COLORS = ["#22c55e", "#60a5fa", "#a78bfa", "#f59e0b", "#ef4444"];

export default function EventGenresChart({ events = [] }) {
  const data = useMemo(() => {
    const safe = Array.isArray(events) ? events : [];
    return GENRES.map((g) => {
      const value = safe.filter((e) =>
        (e?.summary || "").toLowerCase().includes(g.toLowerCase())
      ).length;
      return { name: g, value };
    }).filter((d) => d.value > 0);
  }, [events]);

  if (!data.length) {
    return (
      <div className="chart-card empty">
        <p className="muted">No genre data for the current selection.</p>
      </div>
    );
  }

  const renderLabel = ({ cx, cy, midAngle, outerRadius, percent, index }) => {
    if (!percent) return null;
    const RAD = Math.PI / 180;
    const r = outerRadius + 14;
    const x = cx + r * Math.cos(-midAngle * RAD);
    const y = cy + r * Math.sin(-midAngle * RAD);
    return (
      <text
        x={x}
        y={y}
        fill="#d1d5db"
        fontSize="13"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${data[index].name} ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="chart-card">
      <ResponsiveContainer width="100%" height={340}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={90}
            labelLine={false}
            label={renderLabel}
            isAnimationActive={false}
          >
            {data.map((entry, i) => (
              <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Legend
            verticalAlign="bottom"
            align="center"
            iconType="circle"
            wrapperStyle={{ color: "#cbd5e1", fontSize: 13, paddingTop: 8 }}
          />
          <Tooltip
            contentStyle={{
              background: "#0b0f14",
              border: "1px solid #1f2937",
              color: "#e5e7eb",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
