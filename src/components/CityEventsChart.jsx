// src/components/CityEventsChart.jsx
import { useMemo } from "react";
import {
  ResponsiveContainer,
  PieChart, Pie, Cell, Tooltip,
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
} from "recharts";

const GENRES = ["React", "JavaScript", "Node", "jQuery", "AngularJS"];
const RE = {
  React: /(react)/i,
  JavaScript: /(javascript|\bjs\b|typescript|\bts\b)/i,
  Node: /(node(\.js)?)/i,
  jQuery: /(jquery)/i,
  AngularJS: /(angular(\.js)?)/i,
};

export default function CityEventsChart({ allLocations = [], events = [] }) {
  // --- PIE DATA (by genre) ---
  const pieData = useMemo(() => {
    const base = GENRES.map((g) => ({
      name: g,
      value: events.filter((e) => RE[g].test(e?.summary || "")).length,
    }));
    const allZero = base.every((d) => d.value === 0);
    return allZero ? GENRES.map((g, i) => ({ name: g, value: i === 0 ? 1 : 0 })) : base;
  }, [events]);

  const labelOutside = ({ cx, cy, midAngle, outerRadius, percent, index }) => {
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
        fontWeight={600}
        fill="#6D28D9"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${pieData[index].name} ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // --- SCATTER DATA (count by city) ---
  const scatterData = useMemo(() => {
    const map = new Map(allLocations.map((loc) => [loc.split(/,| - /)[0], 0]));
    for (const e of events) {
      const city = (e?.location || "").split(/,| - /)[0];
      if (city) map.set(city, (map.get(city) || 0) + 1);
    }
    return Array.from(map.entries()).map(([city, count]) => ({ city, count }));
  }, [events, allLocations]);

  const safeScatter = scatterData.length ? scatterData : [{ city: "No data", count: 0 }];

  return (
    <div
      className="charts-container"
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(360px, 520px) minmax(460px, 1fr)",
        gap: 28,
        alignItems: "center",
        margin: "12px 0",
      }}
    >
      {/* Pie (left) */}
      <div style={{ overflow: "visible" }}>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart margin={{ top: 0, right: 160, bottom: 0, left: 60 }}>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              outerRadius={110}
              labelLine={false}
              label={labelOutside}
              fill="#8B5CF6"
              stroke="#fff"
              strokeWidth={2}
              isAnimationActive
            >
              {pieData.map((_, i) => (
                <Cell key={i} fill="#8B5CF6" />
              ))}
            </Pie>
            <Tooltip
              cursor={false}
              contentStyle={{ background: "#ffffff", border: "1px solid #e5e7eb", color: "#111827" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Scatter (right) */}
      <div style={{ minWidth: 460 }}>
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart margin={{ top: 0, right: 24, bottom: 60, left: 44 }}>
            <CartesianGrid stroke="#e5e7eb" />
            <XAxis
              type="category"
              dataKey="city"
              name="City"
              interval={0}
              tickMargin={10}
              tick={{ fontSize: 14, fill: "#374151" }}
            />
            <YAxis
              type="number"
              dataKey="count"
              name="Number of events"
              allowDecimals={false}
              domain={[0, (dataMax) => Math.max(1, dataMax + 1)]}
              tick={{ fontSize: 14, fill: "#374151" }}
            />
            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              contentStyle={{ background: "#ffffff", border: "1px solid #e5e7eb", color: "#111827" }}
            />
            <Scatter
              name="Events"
              data={safeScatter}
              fill="#22D3EE"
              stroke="#ffffff"
              strokeWidth={1.5}
              shape="circle"
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
