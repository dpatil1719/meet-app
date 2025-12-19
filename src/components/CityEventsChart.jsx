import { useMemo } from "react";
import {
  ResponsiveContainer,
  ScatterChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Scatter,
} from "recharts";

export default function CityEventsChart({ allLocations = [], events = [] }) {
  const data = useMemo(() => {
    const locs = Array.isArray(allLocations) ? allLocations : [];
    const evs = Array.isArray(events) ? events : [];
    return locs
      .map((location) => {
        const count = evs.filter((e) => e.location === location).length;
        const city = (location || "").split(/, | - /)[0]; // handle ", " or " - "
        return { city, count };
      })
      .filter((d) => d.count > 0);
  }, [allLocations, events]);

  return (
    <div className="chart-card">
      <ResponsiveContainer width="100%" height={340}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 60, left: 10 }}>
          <CartesianGrid strokeDasharray="2 2" />
          <XAxis
            type="category"
            dataKey="city"
            name="City"
            angle={45}
            interval={0}
            tick={{ dy: 30, fontSize: 12 }}
          />
          <YAxis
            type="number"
            dataKey="count"
            allowDecimals={false}
            name="Events"
          />
          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
          <Scatter data={data} fill="#38bdf8" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
