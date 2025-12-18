import { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function CityEventsChart({ allLocations = [], events = [] }) {
  const [data, setData] = useState([]);

  const getData = useMemo(
    () => () =>
      allLocations.map((location) => {
        const count = events.filter((e) => e.location === location).length;
        const city =
          (location || "").split(/, | - /)[0]; // handle "Dubai - United Arab Emirates"
        return { city, count };
      }),
    [allLocations, events]
  );

  useEffect(() => {
    setData(getData());
  }, [getData, JSON.stringify(events)]);

  return (
    <ResponsiveContainer width="100%" height={340}>
      <ScatterChart
        margin={{ top: 10, right: 20, bottom: 70, left: 0 }} // bottom space for tilted labels
      >
        <CartesianGrid strokeDasharray="3 3" />
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
          domain={[0, "dataMax+1"]}
        />
        <Tooltip cursor={{ strokeDasharray: "3 3" }} />
        <Scatter name="Events" data={data} fill="#60a5fa" />
      </ScatterChart>
    </ResponsiveContainer>
  );
}
