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

  const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, percent, index }) => {
    if (!percent) return null;
    const RAD = Math.PI / 180;
    const r = outerRadius;
    const x = cx + r * Math.cos(-midAngle * RAD) * 1.07;
    const y = cy + r * Math.sin(-midAngle * RAD) * 1.07;
    return (
      <text
        x={x}
        y={y}
        fill="#ddd"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
      >
        {`${genres[index]} ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="99%" height={340}>
      <PieChart margin={{ top: 8, right: 0, bottom: 28, left: 0 }}>
        <Pie
          data={data}
          dataKey="value"
          cx="50%"
          cy="64%"        // push down to avoid top clipping
          outerRadius={112} // slightly smaller for breathing room
          labelLine={false}
          label={renderCustomizedLabel}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={colors[i % colors.length]} />
          ))}
        </Pie>
        <Legend verticalAlign="bottom" align="center" />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default EventGenresChart;
