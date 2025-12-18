import { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
} from "recharts";

/**
 * We keep a fixed order of genres but match case-insensitively
 * and allow "Angular" to also catch "AngularJS".
 */
const GENRES = ["React", "JavaScript", "Node", "Angular", "jQuery"];

// pleasant, high-contrast colors (works on dark and light)
const COLOR_BY = {
  React: "#ef4444",      // red-500
  JavaScript: "#22c55e", // emerald-500
  Node: "#3b82f6",       // blue-500
  Angular: "#a855f7",    // purple-500
  jQuery: "#f59e0b",     // amber-500
};

export default function EventGenresChart({ events = [] }) {
  const [data, setData] = useState([]);

  const normalized = useMemo(
    () =>
      (events || []).map((e) => ({
        summary: (e?.summary || "").toLowerCase(),
      })),
    [events]
  );

  const getData = () =>
    GENRES.map((g) => {
      const key = g.toLowerCase();
      const count = normalized.filter((e) => {
        // treat "AngularJS" as Angular too
        if (key === "angular") return e.summary.includes("angular");
        return e.summary.includes(key);
      }).length;
      return { name: g, value: count };
    }).filter((d) => d.value > 0); // hide 0-slices (especially on localhost)

  useEffect(() => {
    // stringify to force update when array identity doesn't change
    setData(getData());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(events)]);

  // readable outside labels (genre + percent)
  const renderLabel = ({ cx, cy, midAngle, outerRadius, percent, index }) => {
    if (!data.length || percent === 0) return null;
    const RAD = Math.PI / 180;
    const r = outerRadius * 1.22; // push labels out so they never collide the pie
    const x = cx + r * Math.cos(-midAngle * RAD);
    const y = cy + r * Math.sin(-midAngle * RAD);
    const name = data[index].name;
    const color = COLOR_BY[name] || "#e5e7eb";
    return (
      <text
        x={x}
        y={y}
        fill={color}
        fontSize={14}
        fontWeight={600}
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${name} ${(percent * 100).toFixed(0)}%`}
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
          outerRadius={120}
          labelLine={false}
          label={renderLabel}
          isAnimationActive={false}
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={COLOR_BY[entry.name]} />
          ))}
        </Pie>
        <Legend verticalAlign="bottom" align="center" />
        <Tooltip
          cursor={{ fill: "transparent" }}
          contentStyle={{
            background: "rgba(17,17,17,.92)",
            border: "1px solid rgba(255,255,255,.12)",
            color: "#fff",
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
