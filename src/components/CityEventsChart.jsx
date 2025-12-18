import { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

const CityEventsChart = ({ allLocations, events }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(getData());
  }, [JSON.stringify(events), JSON.stringify(allLocations)]);

  const getData = () =>
    allLocations.map((location) => {
      const count = events.filter((e) => e.location === location).length;
      const city = location.split(/, | - /)[0];
      return { city, count };
    });

  return (
    <ResponsiveContainer width="99%" height={340}>
      <ScatterChart margin={{ top: 10, right: 10, bottom: 60, left: -30 }}>
        <CartesianGrid />
        <XAxis
          type="category"
          dataKey="city"
          name="City"
          angle={60}
          interval={0}
          tick={{ dx: 20, dy: 40, fontSize: 12 }}
        />
        <YAxis type="number" dataKey="count" name="Number of events" allowDecimals={false} />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
        <Scatter data={data} />
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default CityEventsChart;
