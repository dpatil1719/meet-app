// src/components/CityEventsChart.jsx
import { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

const CityEventsChart = ({ allLocations = [], events = [] }) => {
  const [data, setData] = useState([]);

  const getData = () => {
    if (!allLocations.length || !events.length) return [];
    return allLocations.map((location) => {
      const count = events.filter((e) => e.location === location).length;
      // Some locations are "City, Country" and some "City - Country"
      const city = location.split(/, | - /)[0];
      return { city, count };
    });
  };

  useEffect(() => {
    setData(getData());
  }, [`${events}`, `${allLocations}`]); // re-run when events or locations change

  return (
    <ResponsiveContainer width="99%" height={400}>
      <ScatterChart
        margin={{ top: 20, right: 20, bottom: 60, left: -30 }}
      >
        <CartesianGrid />
        <XAxis
          type="category"
          dataKey="city"
          name="City"
          angle={60}
          interval={0}
          tick={{ dx: 20, dy: 40, fontSize: 14 }}
        />
        <YAxis
          type="number"
          dataKey="count"
          name="Number of events"
          allowDecimals={false}
        />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
        <Scatter name="Events per city" data={data} />
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default CityEventsChart;
