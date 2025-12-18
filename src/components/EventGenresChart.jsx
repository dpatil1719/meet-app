import { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
} from "recharts";

/** Fixed order so colors & legend are stable */
const GENRES = ["Angular", "JavaScript", "Node", "React", "jQuery"];

/** Colors to match your screenshot (green, blue, purple, orange, red) */
const COLOR_BY = {
  Angular:    "#22c55e",
  JavaScript: "#3b82f6",
  Node:       "#8b5cf6",
  React:      "#f59e0b",
  jQuery:     "#ef4444",
};

export default function EventGenresChart({ events = [] }) {
  const [data, setData] = useState([]);

  const normalized = useMemo(
    () =>
      (events || []).map((e) => ({
        summary: String(e?.summary || "").toLowerCase(),
      })),
    [events]
  );

  const buildData = () =>
    GENRES.map((g) => {
      const k = g.toLowerCase();
      const isAngular = k === "angular";
      const value = normalized.filter((e) =>
        isAngular ? e.summary.includes("angular") : e.summary.includes(k)
      ).length;
      return { name: g, value };
    });

  useEffect(() => {
    setData(buildData());
    // stringify to ensure updates when array identity is stable
  }, [JSON.stringify(events)]);

  // Inside-slice % labels (white text with subtle dark outline for readability)
  const renderInsidePercent = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (!percent) return null;
    const RAD = Math.PI / 180;
    const r = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + r * Math.cos(-midAngle * RAD);
    const y = cy + r * Math.sin(-midAngle * RAD);
    const text = `${(percent * 100).toFixed(0)}%`;
    return (
      <>
        <text
          x={x} y={y} textAnchor="middle" dominantBaseline="central"
          fill="rgba(0,0,0,.45)" stroke="rgba(0,0,0,.45)" strokeWidth="3"
          style={{ paintOrder: "stroke" }}
        >
          {text}
        </text>
        <text
          x={x} y={y} textAnchor="middle" dominantBaseline="central"
          fill="#ffffff" fontWeight="700"
        >
          {text}
        </text>
      </>
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
          label={renderInsidePercent}
          isAnimationActive={false}
        >
          {GENRES.map((g) => (
            <Cell key={g} fill={COLOR_BY[g]} />
          ))}
        </Pie>

        {/* Fixed legend order/colors to always match the screenshot */}
        <Legend
          verticalAlign="bottom"
          align="left"
          payload={GENRES.map((g) => ({
            value: g,
            type: "square",
            color: COLOR_BY[g],
            id: g,
          }))}
        />

        <Tooltip
          cursor={{ fill: "transparent" }}
          contentStyle={{
            background: "rgba(17,17,17,.9)",
            border: "1px solid rgba(255,255,255,.15)",
            color: "#fff",
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
