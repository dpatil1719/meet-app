// src/components/CityEventsChart.jsx
import { useMemo } from "react";
import {
  ResponsiveContainer,
  PieChart, Pie, Cell, Legend, Tooltip,
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid
} from "recharts";

const GENRES = ["React", "JavaScript", "Node", "jQuery", "Angular"];
const MATCHERS = {
  React: /(react)/i,
  JavaScript: /(javascript|\bjs\b|typescript|\bts\b)/i,
  Node: /(node(\.js)?)/i,
  jQuery: /(jquery)/i,
  Angular: /(angular)/i,
};
// Colors: React, JS, Node, jQuery, Angular, Other
const COLORS = ["#ef4444", "#22c55e", "#3b82f6", "#eab308", "#a855f7", "#9ca3af"];

export default function CityEventsChart({ allLocations = [], events = [] }) {
  // --------- PIE DATA (by genre, always shows, even if nothing matches) ----------
  const genreData = useMemo(() => {
    const base = GENRES.map((g) => {
      const re = MATCHERS[g];
      const value = events.filter((e) => re.test(e?.summary || "")).length;
      return { name: g, value };
    });
    const sum = base.reduce((s, d) => s + d.value, 0);
    const other = Math.max(0, events.length - sum);
    return other > 0 ? [...base, { name: "Other", value: other }] : base;
  }, [events]);

  // label outside the pie so "JavaScript" never clips
  const renderPieLabel = ({ cx, cy, midAngle, outerRadius, percent, index }) => {
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
        {`${genreData[index].name} ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // --------- SCATTER DATA (count by city for the *visible* events) ----------
  const cityData = useMemo(() => {
    // Build a set from allLocations so every city appears with at least 0
    const map = new Map(allLocations.map((loc) => [loc.split(/,| - /)[0], 0]));
    for (const e of events) {
      const city = (e?.location || "").split(/,| - /)[0];
      if (city) map.set(city, (map.get(city) || 0) + 1);
    }
    return Array.from(map.entries()).map(([city, count]) => ({ city, count }));
  }, [events, allLocations]);

  // If absolutely no events, show a friendly empty block (prevents blank UI)
  if (events.length === 0) {
    return (
      <div style={{ display: "grid", placeItems: "center", height: 360, border: "1px dashed #374151", borderRadius: 12, color: "#9ca3af" }}>
        No events to visualize.
      </div>
    );
  }

  // Two charts, side-by-side, with generous margins so labels never clip
  return (
    <div
      className="charts-container"
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(360px, 560px) 1fr",
        gap: 28,
        alignItems: "start",
        overflow: "visible"
      }}
    >
      {/* PIE (left) */}
      <div style={{ overflow: "visible" }}>
        <ResponsiveContainer width="100%" height={360}>
          <PieChart margin={{ top: 8, right: 160, bottom: 8, left: 160 }}>
            <Pie
              data={genreData}
              dataKey="value"
              nameKey="name"
              outerRadius={120}
              labelLine={false}
              label={renderPieLabel}
              isAnimationActive
            >
              {genreData.map((_, i) => (
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

      {/* SCATTER (right) */}
      <div style={{ overflow: "visible" }}>
        <ResponsiveContainer width="100%" height={360}>
          <ScatterChart margin={{ top: 8, right: 20, bottom: 60, left: 20 }}>
            <CartesianGrid />
            <XAxis
              type="category"
              dataKey="city"
              name="City"
              angle={60}
              interval={0}
              tick={{ dx: 20, dy: 40, fontSize: 12 }}
            />
            <YAxis
              type="number"
              dataKey="count"
              name="Number of events"
              allowDecimals={false}
            />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} />
            <Scatter name="Events" data={cityData} fill="#38bdf8" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
