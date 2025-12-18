// src/components/CityEventsChart.jsx
import { useEffect, useState } from 'react';
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

export default function CityEventsChart({ allLocations = [], events = [] }) {
  const [data, setData] = useState([]);

  const getData = () =>
    allLocations
      .map((location) => {
        const count = events.filter((e) => e.location === location).length;
        const city = location.split(/, | - /)[0];
        return { city, count };
      })
      .filter((d) => d.count > 0); // hide zero-count cities (keeps chart clean)

  useEffect(() => {
    setData(getData());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [`${events}`, `${allLocations}`]);

  return (
    <ResponsiveContainer width="100%" height={340}>
      <ScatterChart margin={{ top: 10, right: 20, bottom: 70, left: -10 }}>
        <CartesianGrid stroke="#3a3a3a" />
        <XAxis
          type="category"
          dataKey="city"
          angle={60}
          interval={0}
          tick={{ dx: 16, dy: 36, fontSize: 12, fill: '#cbd5e1' }}
        />
        <YAxis
          type="number"
          dataKey="count"
          name="Events"
          allowDecimals={false}
          tick={{ fill: '#cbd5e1' }}
        />
        <Tooltip contentStyle={{ background: '#111827', border: '1px solid #374151' }} />
        {/* Bright cyan markers so they stand out on dark */}
        <Scatter name="Events per city" data={data} fill="#22d3ee" fillOpacity={0.95} />
      </ScatterChart>
    </ResponsiveContainer>
  );
}
