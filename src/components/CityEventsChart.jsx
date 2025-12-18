import { useMemo } from 'react';
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

export default function CityEventsChart({ allLocations = [], events = [] }) {
  const data = useMemo(() => {
    if (!allLocations.length || !events.length) return [];
    return allLocations.map((loc) => ({
      city: loc.split(/, | - /)[0],
      count: events.filter((e) => e.location === loc).length
    }));
  }, [allLocations, events]);

  if (!data.length) return null;

  return (
    <ResponsiveContainer width="100%" height={340}>
      <ScatterChart margin={{ top: 16, right: 24, bottom: 72, left: 8 }}>
        <CartesianGrid />
        <XAxis
          type="category"
          dataKey="city"
          name="City"
          interval={0}
          angle={55}
          tick={{ dy: 30, fontSize: 12 }}
        />
        <YAxis type="number" dataKey="count" name="Events" allowDecimals={false} />
        <Tooltip />
        <Scatter data={data} fill="#22d3ee" />
      </ScatterChart>
    </ResponsiveContainer>
  );
}
