import { useState, useEffect } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const EventGenresChart = ({ events }) => {
  const [data, setData] = useState([]);
  const genres = ['React', 'JavaScript', 'Node', 'jQuery', 'Angular'];
  const colors = ['#e74c3c', '#3498db', '#9b59b6', '#f1c40f', '#2ecc71'];

  useEffect(() => {
    setData(getData());
  }, [JSON.stringify(events)]);

  const getData = () =>
    genres.map((genre) => ({
      name: genre,
      value: events.filter((e) => e.summary?.includes(genre)).length,
    }));

  // draw % label inside each slice
  const renderInsideLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (!percent) return null;
    const RAD = Math.PI / 180;
    const r = (innerRadius || 0) + ((outerRadius || 0) - (innerRadius || 0)) * 0.55;
    const x = cx + r * Math.cos(-midAngle * RAD);
    const y = cy + r * Math.sin(-midAngle * RAD);
    return (
      <text x={x} y={y} fill="#fff" fontSize="12" fontWeight="600"
            textAnchor="middle" dominantBaseline="central">
        {`${Math.round(percent * 100)}%`}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="99%" height={340}>
      <PieChart margin={{ top: 12, right: 8, bottom: 40, left: 8 }}>
        <Pie
          data={data}
          dataKey="value"
          cx="50%"
          cy="60%"          /* a touch lower so it doesn't crowd the top */
          outerRadius={112} /* a bit smaller to leave room for legend */
          labelLine={false}
          label={renderInsideLabel}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={colors[i % colors.length]} />
          ))}
        </Pie>
        <Legend verticalAlign="bottom" align="center" wrapperStyle={{ marginTop: 8 }} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default EventGenresChart;
